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
 *   requiredSelectors: ['h1', 'button[type="submit"]'],
 *   forbiddenSelectors: ['iframe'],
 *   requireText: ['로그인'],
 *   requireInlineStyles: ['background-color'],
 *   requireTextAt: [{ selector: 'h1', text: '쿠키 레시피', mode: 'equals' }],
 *   forbidTextAt: [{ selector: 'p', text: '금지어', mode: 'includes' }],
 *   requireInlineStylesAt: [
 *     { selector: 'div', prop: 'background-color', value: '#FAFAFA', mode: 'includes' },
 *     { selector: 'div', prop: 'box-shadow',      value: '#c0c0c0', mode: 'includes' }
 *   ],
 *   requireAttributes: [
 *     { selector: 'img', attr: 'src', value: '/images/', mode: 'includes' }
 *   ]
 * }
 */

export function gradeHtml(html, rules = {}, globalBackgroundColor) {
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
      if (selector === "body" && prop === "background-color") {
          const actual = normalizeColorToRgbaLike(globalBackgroundColor);
          const expected = normalizeColorToRgbaLike(value);
          const ok = matchByMode(actual, expected, { mode, caseSensitive, normalize: false });
          pass(ok, '스타일(요소별)', `body [style.${prop}] ${mode} "${value}"`, { selector, prop, value, mode });
          continue;
      }
      const els = getAll(selector);
      const ok = els.some(el => {
        const map = inlineStyleMap(el);
        const actualRaw = map[(prop || '').toLowerCase()];
        if (actualRaw == null) return false;

        // 🔹 색상 내장 값 정규화 (hex / rgb / rgba → rgba(r,g,b,a), 공백 제거)
        const actual = standardizeColorsInCssValue(actualRaw);
        const expected = standardizeColorsInCssValue(String(value ?? ''));

        // box-shadow처럼 위치/순서가 달라도 색만 확인하고 싶을 때
        // - expected가 "색상" 자체로 보이면 색상만 비교 (equals/regex 무시)
        if (isColorLike(value)) {
          const actualColor = normalizeColorToRgbaLike(extractFirstColorToken(actual) || '');
          const expectedColor = normalizeColorToRgbaLike(String(value));
          return actualColor && expectedColor && actualColor === expectedColor;
        }

        // 일반 비교: 색 토큰을 통일한 문자열끼리 비교
        return matchByMode(actual, expected, { mode, caseSensitive, normalize: false });
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

/* -------------------- 색상 정규화 유틸 (추가) -------------------- */
function hexToRgbTuple(hex) {
  const m = String(hex || '').trim().toLowerCase().match(/^#([0-9a-f]{3,8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map(ch => ch + ch).join(''); // #abc -> #aabbcc
  if (h.length === 4) h = h.split('').map(ch => ch + ch).join(''); // #rgba -> #rrggbbaa
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  let a = 1;
  if (h.length >= 8) a = parseInt(h.slice(6, 8), 16) / 255;
  return [r, g, b, a];
}

function normalizeColorToRgbaLike(value) {
  if (!value) return "";
  const v = String(value).trim().toLowerCase();

  // hex -> rgba
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(v)) {
    const tup = hexToRgbTuple(v);
    if (!tup) return v;
    const [r, g, b, a] = tup;
    return `rgba(${r},${g},${b},${a})`;
  }

  // rgb(...) / rgba(...) -> 공백 제거 & 소문자
  if (/^rgba?\(/.test(v)) {
    // rgb(r, g, b) -> rgba(r,g,b,1)
    const compact = v.replace(/\s+/g, '');
    if (/^rgb\(/.test(compact)) {
      const inner = compact.slice(4, -1); // r,g,b
      return `rgba(${inner},1)`;
    }
    return compact; // 이미 rgba(...)
  }

  // 네임드 컬러 등도 브라우저로 정규화(가능하면)
  try {
    const el = document.createElement('div');
    el.style.color = v;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color; // "rgb(r, g, b)"
    document.body.removeChild(el);
    return normalizeColorToRgbaLike(computed);
  } catch (e) {
    return v;
  }
}

function isColorLike(val) {
  const s = String(val || '').trim();
  return (
    /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(s) ||
    /^rgba?\(/i.test(s) ||
    /^[a-z]+$/i.test(s) // 네임드 컬러
  );
}

// 문자열 안에서 첫 번째 색상 토큰(#... / rgb(...) / rgba(...) / 네임드) 추출
function extractFirstColorToken(str) {
  if (!str) return '';
  const m =
    String(str).match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\)|[a-z]+)/i);
  return m ? m[1] : '';
}

// 문자열에 포함된 모든 색 토큰을 rgba(...) 형태로 표준화
function standardizeColorsInCssValue(str) {
  if (!str) return '';
  let out = String(str);

  // hex → rgba
  out = out.replace(/#[0-9a-f]{3,8}/ig, (m) => normalizeColorToRgbaLike(m));

  // rgb/rgba → rgba (공백 제거 포함)
  out = out.replace(/rgba?\([^)]+\)/ig, (m) => normalizeColorToRgbaLike(m));

  // 네임드 컬러 → rgba (가능하면)
  // 네임드는 단어 경계에서만 치환 (길게 뽑히는 걸 방지)
  out = out.replace(/\b[a-z]+\b/ig, (m) => {
    // 숫자/단위/키워드로 오해될 수 있는 것들은 스킵
    if (/^(auto|inherit|initial|unset|none|solid|dotted|dashed|double|currentcolor)$/.test(m.toLowerCase())) {
      return m;
    }
    const norm = normalizeColorToRgbaLike(m);
    // 변환에 실패하면 원본 유지
    return norm && norm !== m ? norm : m;
  });

  // 공백을 통일 (비교에 유리)
  return out.replace(/\s+/g, '');
}

