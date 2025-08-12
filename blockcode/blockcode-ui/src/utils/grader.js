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
 *   requireInlineStyles: ['background-color', 'font-family', 'animation']
 * }
 */
export function gradeHtml(html, rules = {}) {
  const res = { checks: [], score: 0, total: 0 };
  const wrap = document.createElement('div');
  wrap.innerHTML = html || '';

  const pass = (ok, type, target) => {
    res.total++;
    if (ok) res.score++;
    res.checks.push({ type, target, pass: ok });
  };

  if (Array.isArray(rules.requiredSelectors)) {
    for (const sel of rules.requiredSelectors) {
      pass(!!wrap.querySelector(sel), '필수 요소', sel);
    }
  }
  if (Array.isArray(rules.forbiddenSelectors)) {
    for (const sel of rules.forbiddenSelectors) {
      pass(!wrap.querySelector(sel), '금지 요소', sel);
    }
  }
  if (Array.isArray(rules.requireText)) {
    const text = wrap.textContent || '';
    for (const t of rules.requireText) {
      pass(text.includes(t), '텍스트', `\"${t}\" 포함`);
    }
  }
  if (Array.isArray(rules.requireInlineStyles)) {
    for (const prop of rules.requireInlineStyles) {
      pass(!!findAnyElementWithInlineStyle(wrap, prop), '스타일', `인라인 스타일 \"${prop}\" 사용`);
    }
  }

  return res;
}

function findAnyElementWithInlineStyle(root, cssProp) {
  const all = root.querySelectorAll('*');
  for (const el of all) {
    const s = (el.getAttribute && el.getAttribute('style')) || '';
    if (s && s.toLowerCase().includes(cssProp.toLowerCase())) {
      return el;
    }
  }
  return null;
}