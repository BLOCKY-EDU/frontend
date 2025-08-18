// src/utils/labelRegistry.js
const KEY = '__BLOCKY_LABELS__';

function ensure() {
  if (!window[KEY]) window[KEY] = { styleProps: {}, selectors: {} };
  return window[KEY];
}

// CSS 속성 -> 블록 라벨
export function recordStylePropLabel(prop, label) {
  if (!prop || !label) return;
  ensure().styleProps[String(prop).toLowerCase()] = String(label);
}
export function getStylePropLabel(prop) {
  return ensure().styleProps[String(prop || '').toLowerCase()];
}

// 선택자(h1/p/img 등) -> 블록 라벨
export function recordSelectorLabel(selector, label) {
  if (!selector || !label) return;
  ensure().selectors[String(selector)] = String(label);
}
export function getSelectorLabel(selector) {
  return ensure().selectors[String(selector)];
}

// 렌더 갱신 때 원하면 초기화
export function resetLabels() {
  window[KEY] = { styleProps: {}, selectors: {} };
}
