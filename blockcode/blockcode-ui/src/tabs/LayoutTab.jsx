import * as Blockly from 'blockly';
import { parseStyleStatementsToStyleObj } from './StyleTab';
import { parseSingleWritingBlock } from './WritingTab';
import { parseSingleButtonBlock } from './ButtonTab';
import { ColourPreviewDropdown } from '../blocks/CustomFields';

import { STYLE_BLOCK_TYPES } from "./StyleTab";
import { COMBINE_TYPES } from "./CombineType.jsx";

import { parseSingleNavigationBlock } from './NavigationTab';
import { parseSingleListBlock } from './ListTab';
import { parseSingleImageBlock } from "./ImageTab.jsx";

const localCombineTypes = [...COMBINE_TYPES, 'container_box'];

export function registerLayoutBlocks() {
    Blockly.Blocks['container_box'] = {
        init: function () {
            this.appendDummyInput().appendField("상자");
            this.appendStatementInput("CONTENT").setCheck(localCombineTypes).appendField("내용");   // 내부 콘텐츠
            this.appendStatementInput("STYLE").setCheck(STYLE_BLOCK_TYPES).appendField("스타일");     // 스타일 블록 연결
            this.setColour("#A3D5FF");
            this.setTooltip("내용을 담는 레이아웃 상자입니다.");
              // this.setPreviousStatement(true, 'container_box');
              // this.setNextStatement(true, 'container_box');
            this.setPreviousStatement(true, COMBINE_TYPES); // 공통 타입으로
            this.setNextStatement(true, COMBINE_TYPES); // 공통 타입으로
        }
    };

    //   Blockly.Blocks['global_background'] = {
    //   init: function () {
    //     this.appendDummyInput()
    //       .appendField("배경색")
    //       .appendField(new ColourPreviewDropdown(undefined), 'COLOR'); // ✅ 커스텀 필드 사용
    //     this.setColour("#E2B8FF");
    //     this.setTooltip("전체 배경색을 설정합니다.");
    //     this.setPreviousStatement(true, null);
    //     this.setNextStatement(true, null);
    //   }
    // };

}

export function getLayoutTabToolbox() {
    return {
        kind: "flyoutToolbox",
        contents: [
            { kind: "block", type: "container_box" },
            // { kind: "block", type: "global_background" }

        ]
    };
}


let _containerBoxKeyCounter = 0;

function getDirectChildByTagName(parent, tagName) {
    if (!parent || !parent.childNodes) return null;
    for (let i = 0; i < parent.childNodes.length; i++) {
        const n = parent.childNodes[i];
        if (n.nodeType === 1 && n.tagName === tagName) return n;
    }
    return null;
}

function serializeDom(node) {
    return new XMLSerializer().serializeToString(node);
}

function unwrapParsed(parsed) {
    if (parsed == null) return null;

    // 배열이면 재귀적으로 풀기
    if (Array.isArray(parsed)) {
        const flat = [];
        for (const p of parsed) {
            const u = unwrapParsed(p);
            if (u == null) continue;
            if (Array.isArray(u)) flat.push(...u);
            else flat.push(u);
        }
        return flat.length ? flat : null;
    }

    // 어떤 파서가 { type, content } 형태로 반환할 수 있음 -> content를 사용
    if (typeof parsed === 'object' && parsed.type !== undefined && parsed.content !== undefined) {
        return unwrapParsed(parsed.content);
    }

    // 그 외 (React element 등) 그대로 반환
    return parsed;
}

/**
 * parseSingleContainerBlock: 단일 container_box block DOM을 받아 <div> JSX 하나를 반환
 * - input: block DOM Element OR XML string of that block
 */
function parseSingleContainerBlock(input) {
    // input이 문자열이면 DOM으로 변환
    let block;
    if (!input) return null;
    if (typeof input === 'string') {
        const doc = new DOMParser().parseFromString(input, 'text/xml');
        block = doc.getElementsByTagName('block')[0];
        if (!block) return null;
    } else {
        block = input;
    }

    if (block.getAttribute('type') !== 'container_box') return null;

    // style statement (직계) 찾기
    let styleStatement = null;
    let contentStatement = null;
    for (let i = 0; i < block.childNodes.length; i++) {
        const c = block.childNodes[i];
        if (c.nodeType !== 1) continue;
        if (c.tagName === 'statement') {
            const name = c.getAttribute('name');
            if (name === 'STYLE') styleStatement = c;
            else if (name === 'CONTENT') contentStatement = c;
        }
    }

    // parseStyleStatementsToStyleObj는 사용자의 파일에 이미 있어야 함
    const styleObj = typeof parseStyleStatementsToStyleObj === 'function'
        ? parseStyleStatementsToStyleObj(styleStatement)
        : {};

    // CONTENT 처리: CONTENT 안의 첫 블록부터 next 체인을 따라 재귀로 파싱
    const children = [];
    if (contentStatement) {
        let inner = getDirectChildByTagName(contentStatement, 'block');
        while (inner) {
            const innerType = inner.getAttribute('type');

            let parsed = null;
            // 파서 네이밍 맞추기
            if (typeof parseSingleWritingBlock === 'function' && [
                'text_title', 'text_small_title', 'small_content', 'recipe_step', 'toggle_input', 'highlight_text', 'paragraph'
            ].includes(innerType)) {
                parsed = parseSingleWritingBlock(serializeDom(inner));
            } else if (typeof parseSingleButtonBlock === 'function' && [
                'normal_button', 'submit_button', 'text_input', 'email_input', 'checkbox_block', 'select_box'
            ].includes(innerType)) {
                parsed = parseSingleButtonBlock(serializeDom(inner));
            } else if (typeof parseSingleNavigationBlock === 'function' && innerType === 'navigation_button') {
                parsed = parseSingleNavigationBlock(serializeDom(inner));
            } else if (typeof parseSingleListBlock === 'function' && ['list_bulleted', 'list_numbered', 'list_item', 'ordered_list_item'].includes(innerType)) {
                parsed = parseSingleListBlock(serializeDom(inner));
            } else if (typeof parseSingleImageBlock === 'function' && ['insert_image', 'insert_video', 'youtube_link'].includes(innerType)) {
                parsed = parseSingleImageBlock(serializeDom(inner));
            } else if (innerType === 'container_box') {
                parsed = parseSingleContainerBlock(inner); // 재귀 (DOM 전달)
            }

            const unwrapped = unwrapParsed(parsed);
            if (unwrapped != null) {
                if (Array.isArray(unwrapped)) children.push(...unwrapped);
                else children.push(unwrapped);
            }

            // inner의 직계 next로 이동
            const nextNode = getDirectChildByTagName(inner, 'next');
            inner = nextNode ? getDirectChildByTagName(nextNode, 'block') : null;
        }
    }

    const key = block.getAttribute('id') || `container-box-${++_containerBoxKeyCounter}`;
    return (
        <div key={key} style={styleObj}>
            {children}
        </div>
    );
}

export function parseLayoutXmlToJSX(xmlInput, setGlobalBackgroundColor) {
    if (!xmlInput) return null;

    // xmlInput: string OR DOM Document/Element
    let rootEl = null;
    if (typeof xmlInput === 'string') {
        const doc = new DOMParser().parseFromString(xmlInput, 'text/xml');
        rootEl = doc.documentElement;
    } else if (xmlInput.nodeType) {
        rootEl = xmlInput;
    } else if (xmlInput instanceof Document) {
        rootEl = xmlInput.documentElement;
    } else {
        return null;
    }

    // top-level block elements 얻기
    let topBlocks = [];
    if (rootEl.tagName === 'xml') {
        for (let node = rootEl.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === 1 && node.tagName === 'block') topBlocks.push(node);
        }
    } else if (rootEl.tagName === 'block') {
        topBlocks = [rootEl];
    } else {
        // 혹시 block들을 직접 포함한 다른 element가 넘어오면 그 안의 block 찾기
        topBlocks = Array.from(rootEl.getElementsByTagName('block'));
        // 좀 더 안전하게하기 위해 최상위로 사용하려면 루트 직계 block만 골라냄
        topBlocks = topBlocks.filter(b => b.parentNode === rootEl);
        if (topBlocks.length === 0) {
            // fallback: 문서 전체에서 가장 바깥 블록들만
            topBlocks = Array.from(rootEl.getElementsByTagName('block')).filter(b => !b.parentNode || b.parentNode.tagName === 'xml');
        }
    }

    const out = [];

    for (const b of topBlocks) {
        // global background 같은 최상위 스타일 블록 지원
        const t = b.getAttribute('type');
        if (t === 'style_background' || t === 'global_background') {
            if (typeof setGlobalBackgroundColor === 'function') {
                const field = getDirectChildByTagName(b, 'field');
                const color = field ? field.textContent : '#ffffff';
                setGlobalBackgroundColor(color);
            }
            continue;
        }

        // topBlock이 container_box인 경우 그 블록과 next 체인을 따라 렌더링
        // (blockToDom으로 얻는 xmlText는 해당 블록의 next를 포함하므로 다음으로 넘어감)
        let current = b;
        while (current) {
            const type = current.getAttribute('type');
            if (type === 'container_box') {
                const parsed = parseSingleContainerBlock(current);
                const unwrapped = unwrapParsed(parsed);
                if (unwrapped != null) {
                    if (Array.isArray(unwrapped)) out.push(...unwrapped);
                    else out.push(unwrapped);
                }
            } else {
                // 만약 container가 아닌 다른 최상위 블록이 topBlocks에 있으면,
                // parseXmlToJSX(사용자의 상위 함수)가 이미 그것을 개별적으로 처리하므로 여기선 무시
            }

            const nextNode = getDirectChildByTagName(current, 'next');
            current = nextNode ? getDirectChildByTagName(nextNode, 'block') : null;
        }
    }

    return out;
}
