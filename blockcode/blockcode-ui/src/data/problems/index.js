// src/data/problems/index.js
import { BASIC_PROBLEMS } from "./basic.js";
import { INTERMEDIATE_PROBLEMS } from "./intermediate.js";
import { ADVANCED_PROBLEMS } from "./advanced.js";

export const LEVELS = {
    basic: BASIC_PROBLEMS,
    intermediate: INTERMEDIATE_PROBLEMS,
    advanced: ADVANCED_PROBLEMS,
};

export const ALL_PROBLEMS = [
    ...LEVELS.basic,
    ...LEVELS.intermediate,
    ...LEVELS.advanced,
];

export const PROBLEM_BY_ID = Object.fromEntries(
    ALL_PROBLEMS.map(p => [String(p.id), p])
);

// 레벨 구간 자동 산출
const calcRange = (arr) => {
    if (!arr || arr.length === 0) return [null, null];
    const ids = arr.map(p => p.id).sort((a, b) => a - b);
    return [ids[0], ids[ids.length - 1]];
};

export const STAGE_RANGES = {
    basic: calcRange(LEVELS.basic),
    intermediate: calcRange(LEVELS.intermediate),
    advanced: calcRange(LEVELS.advanced),
};

export function getLevelById(id) {
    const n = Number(id);
    for (const [name, arr] of Object.entries(LEVELS)) {
        if (arr.some(p => p.id === n)) return name; // 포함 여부로 판단
    }
    return null;
}

export function nextIdInSameLevel(id) {
    const n = Number(id);
    const level = getLevelById(n);
    if (!level) return null;
    const ids = LEVELS[level].map(p => p.id).sort((a, b) => a - b);
    const idx = ids.indexOf(n);
    if (idx === -1 || idx === ids.length - 1) return null;
    return String(ids[idx + 1]);
}
