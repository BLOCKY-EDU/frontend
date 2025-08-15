// src/utils/grader.js
// HTML 기반 채점 유틸

const CURRENT_HTML_KEY = 'blocky_workspace_html_current';

export function htmlFromLocal() {
  try {
    return localStorage.getItem(CURRENT_HTML_KEY) || '';
  } catch (e) {
    return '';
  }
}

/**
 * rules 예시:
 * {
 *   // 기존
 *   requiredSelectors: ['h1', 'button[type="submit"]'],
 *   forbiddenSelectors: ['iframe'],
 *   requireText: ['로그인'],                    // 전체 텍스트 포함
 *   requireInlineStyles: ['background-color'], // 아무 요소든 인라인 스타일에 속성 존재
 *
 *   // 추가 (요소 단위 엄격 채점)
 *   requireTextAt: [
 *     { selector: 'h1', text: '쿠키 레시피', mode: 'equals', caseSensitive: false, normalize: true },
 *     { selector: 'p',  text: '초코칩',      mode: 'includes' },
 *     { selector: '.tip', text: '^TIP:',     mode: 'regex' }
 *   ],
 *   forbidTextAt: [
 *     { selector: 'p', text: '금지어', mode: 'includes' }
 *   ],
 *   requireInlineStylesAt: [
 *     { selector: 'div', prop: 'background-color', value: '#FAFAFA', mode: 'includes' },
 *     { selector: 'p',   prop: 'font-weight',      value: '700',     mode: 'equals' }
 *   ],
 *   requireAttributes: [
 *     { selector: 'input[type="email"]', attr: 'placeholder', value: '이메일', mode: 'includes' },
 *     { selector: 'button', attr: 'type', value: '^submit$', mode: 'regex' }
 *   ]
 * }
 */

export function gradeHtml(html, rules = {}) {
  const res = { checks: [], score: 0, total: 0 };
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';

  const pass = (ok, type, target, meta = {}) => {
    res.total++;
    if (ok) res.score++;
    res.checks.push({ type, target, pass: ok, meta });
  };

  // ===== helpers =====
  const norm = (s, { trim = true, normalize = true, caseSensitive = false } = {}) => {
    if (typeof s !== 'string') s = String(s ?? '');
    if (trim) s = s.trim();
    if (normalize) s = s.replace(/\s+/g, ' ');
    if (!caseSensitive) s = s.toLowerCase();
    return s;
  };

  const getAll = (sel) => {
    try {
      return Array.from(wrap.querySelectorAll(sel));
    } catch (e) {
      return [];
    }
  };

  const matchByMode = (actual, expected, { mode = 'equals', caseSensitive = false, normalize = true } = {}) => {
    const a = norm(actual, { caseSensitive, normalize });
    const b = norm(expected, { caseSensitive, normalize });
    if (mode === 'equals') return a === b;
    if (mode === 'includes') return a.includes(b);
    if (mode === 'regex') {
      try { return new RegExp(expected, caseSensitive ? '' : 'i').test(actual ?? ''); }
      catch { return false; }
    }
    return false;
  };

  const inlineStyleMap = (el) => {
    const s = (el.getAttribute && el.getAttribute('style')) || '';
    const map = {};
    s.split(';').forEach(pair => {
      const [k, v] = pair.split(':');
      if (!k) return;
      map[k.trim().toLowerCase()] = (v ?? '').trim();
    });
    return map;
  };

  // ===== 기존 규칙 =====
  if (Array.isArray(rules.requiredSelectors)) {
    for (const sel of rules.requiredSelectors) {
      pass(!!wrap.querySelector(sel), '필수 요소', sel, { selector: sel });
    }
  }
  if (Array.isArray(rules.forbiddenSelectors)) {
    for (const sel of rules.forbiddenSelectors) {
      pass(!wrap.querySelector(sel), '금지 요소', sel, { selector: sel });
    }
  }
  if (Array.isArray(rules.requireText)) {
    const text = wrap.textContent || '';
    for (const t of rules.requireText) {
      pass(text.includes(t), '텍스트(전체)', `"${t}" 포함`, { scope: 'document', text: t });
    }
  }
  if (Array.isArray(rules.requireInlineStyles)) {
    for (const prop of rules.requireInlineStyles) {
      pass(!!findAnyElementWithInlineStyle(wrap, prop), '스타일(전체)', `인라인 스타일 "${prop}" 사용`, { scope: 'document', prop });
    }
  }

  // ===== 추가 규칙: 요소 단위 텍스트 =====
  if (Array.isArray(rules.requireTextAt)) {
    for (const rule of rules.requireTextAt) {
      const { selector, text, mode = 'equals', caseSensitive = false, normalize = true } = rule || {};
      const els = getAll(selector);
      const ok = els.some(el => matchByMode(el.textContent ?? '', text, { mode, caseSensitive, normalize }));
      pass(ok, '텍스트(요소별)', `${selector} ⇒ ${mode} "${text}"`, { selector, text, mode });
    }
  }

  if (Array.isArray(rules.forbidTextAt)) {
    for (const rule of rules.forbidTextAt) {
      const { selector, text, mode = 'includes', caseSensitive = false, normalize = true } = rule || {};
      const els = getAll(selector);
      const has = els.some(el => matchByMode(el.textContent ?? '', text, { mode, caseSensitive, normalize }));
      pass(!has, '금지 텍스트(요소별)', `${selector} ⇒ ${mode} "${text}"`, { selector, text, mode });
    }
  }

  // ===== 추가 규칙: 요소 단위 스타일 =====
  if (Array.isArray(rules.requireInlineStylesAt)) {
    for (const rule of rules.requireInlineStylesAt) {
      const { selector, prop, value, mode = 'equals', caseSensitive = false } = rule || {};
      const els = getAll(selector);
      const ok = els.some(el => {
        const map = inlineStyleMap(el);
        const actual = map[(prop || '').toLowerCase()];
        if (actual == null) return false;
        return matchByMode(actual, value ?? '', { mode, caseSensitive, normalize: false });
      });
      pass(ok, '스타일(요소별)', `${selector} [style.${prop}] ${mode} "${value}"`, { selector, prop, value, mode });
    }
  }

  // ===== 추가 규칙: 요소 속성 =====
  if (Array.isArray(rules.requireAttributes)) {
    for (const rule of rules.requireAttributes) {
      const { selector, attr, value, mode = 'equals', caseSensitive = false } = rule || {};
      const els = getAll(selector);
      const ok = els.some(el => {
        const actual = el.getAttribute?.(attr) ?? '';
        return matchByMode(actual, value ?? '', { mode, caseSensitive, normalize: false });
      });
      pass(ok, '속성', `${selector} [${attr}] ${mode} "${value}"`, { selector, attr, value, mode });
    }
  }

  return res;
}

function findAnyElementWithInlineStyle(root, cssProp) {
  const all = root.querySelectorAll('*');
  for (const el of all) {
    const s = (el.getAttribute && el.getAttribute('style')) || '';
    if (s && s.toLowerCase().includes(String(cssProp).toLowerCase())) {
      return el;
    }
  }
  return null;
}
