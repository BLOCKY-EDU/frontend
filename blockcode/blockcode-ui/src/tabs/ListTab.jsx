import * as Blockly from 'blockly';
import React from 'react';
import {COMBINE_TYPES} from "./CombineType.jsx";

export function registerListBlocks() {
  // 글머리(ul) 컨테이너
  Blockly.Blocks['list_bulleted'] = {
    init: function () {
      this.appendStatementInput("ITEMS")
        .setCheck("list_item")
        .appendField("글머리");
      this.setPreviousStatement(true,COMBINE_TYPES);
      this.setNextStatement(true,COMBINE_TYPES);
      this.setColour('#D8B4F8');  // ← 컬러 변경
      this.setTooltip("글머리 리스트(ul)를 만듭니다");
      this.setHelpUrl("");
    }
  }

  // 리스트 항목
  Blockly.Blocks['list_item'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("글머리 내용")
        .appendField(new Blockly.FieldTextInput("텍스트 입력"), "TEXT");
      this.setPreviousStatement(true, "list_item");
      this.setNextStatement(true, "list_item");
      this.setColour('#D8B4F8');  // ← 컬러 변경
      this.setTooltip("글머리 항목을 만듭니다");
      this.setHelpUrl("");
    }
  };

  // 숫자 목록(ol) 컨테이너
  Blockly.Blocks['list_numbered'] = {
    init: function () {
      this.appendStatementInput("ITEMS")
        .setCheck("ordered_list_item")
        .appendField("숫자 목록");
      this.setPreviousStatement(true,COMBINE_TYPES);
      this.setNextStatement(true,COMBINE_TYPES);
      this.setColour('#D8B4F8');  // ← 컬러 변경
      this.setTooltip("숫자 목록 리스트(ol)를 만듭니다");
      this.setHelpUrl("");
    }
  };

  // 숫자 목록 항목
  Blockly.Blocks['ordered_list_item'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("숫자 목록 내용")
        .appendField(new Blockly.FieldTextInput("텍스트 입력"), "TEXT");
      this.setPreviousStatement(true, "ordered_list_item");
      this.setNextStatement(true, "ordered_list_item");
      this.setColour('#D8B4F8');  // ← 컬러 변경
      this.setTooltip("숫자 목록 항목을 만듭니다");
      this.setHelpUrl("");
    }
  };
}

export function getListTabToolbox() {
  return {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'list_bulleted' },
      { kind: 'block', type: 'list_item' },
      { kind: 'block', type: 'list_numbered' },
      { kind: 'block', type: 'ordered_list_item' }
    ]
  };
}

// 파일 맨 위(혹은 적절한 위치)에 전역 카운터 추가
let _listKeyCounter = 0;

/**
 * parseSingleListBlock
 * - xmlInput: string (xml), 또는 DOM Element (block), 또는 Document
 * - parseLayoutXmlToJSX와 같은 방식으로 top-level block들을 찾아 각 block의 next 체인을 따라 처리
 * - 반환: null | React.Element | React.Element[]  (parseLayoutXmlToJSX의 unwrapParsed와 호환)
 */
export function parseListXmlToJSX(xmlInput) {
    if (!xmlInput) return null;

    // 1) 입력을 root element 수준으로 정리
    let rootEl = null;
    if (typeof xmlInput === 'string') {
        const doc = new DOMParser().parseFromString(xmlInput, 'text/xml');
        rootEl = doc.documentElement;
    } else if (xmlInput instanceof Document) {
        rootEl = xmlInput.documentElement;
    } else if (xmlInput && xmlInput.nodeType) {
        // block Element 혹은 다른 Element 전달된 경우
        rootEl = xmlInput;
    } else {
        return null;
    }

    // 2) top-level block들 수집 (xml 내부에 여러 block이 있을 수 있으므로 안전하게 추출)
    let topBlocks = [];
    if (rootEl.tagName === 'xml') {
        topBlocks = Array.from(rootEl.childNodes).filter(n => n.nodeType === 1 && n.tagName === 'block');
    } else if (rootEl.tagName === 'block') {
        topBlocks = [rootEl];
    } else {
        // 다른 element가 넘어왔을 경우: 그 안의 직계 block들 우선 추출
        topBlocks = Array.from(rootEl.getElementsByTagName('block')).filter(b => b.parentNode === rootEl);
        if (topBlocks.length === 0) {
            // fallback: 문서 전체에서 바깥 블록들만
            topBlocks = Array.from(rootEl.getElementsByTagName('block')).filter(b => !b.parentNode || b.parentNode.tagName === 'xml');
        }
    }

    const out = [];

    // 3) 각 topBlock에 대해 next 체인을 따라 처리
    for (const b of topBlocks) {
        let current = b;

        while (current) {
            const type = current.getAttribute('type');

            // --- 리스트 컨테이너 처리 (ITEMS statement 내부의 체인)
            if (type === 'list_bulleted' || type === 'list_numbered') {
                const statement = Array.from(current.children).find(el => el.tagName === 'statement' && el.getAttribute('name') === 'ITEMS');
                const items = [];

                if (statement) {
                    // statement 내부의 첫 block부터 next 체인 따라 항목 수집
                    let inner = Array.from(statement.children).find(el => el.tagName === 'block');

                    while (inner) {
                        const innerType = inner.getAttribute('type');

                        const isValidItem =
                            (type === 'list_bulleted' && innerType === 'list_item') ||
                            (type === 'list_numbered' && innerType === 'ordered_list_item');

                        if (isValidItem) {
                            const field = Array.from(inner.children).find(el => el.tagName === 'field' && el.getAttribute('name') === 'TEXT');
                            const text = field?.textContent?.trim() || '';
                            if (text) {
                                const id = inner.getAttribute('id') || `list-item-${++_listKeyCounter}`;
                                items.push(<li key={id}>{text}</li>);
                            }
                        }

                        // inner의 next chain으로 이동
                        const nextEl = Array.from(inner.children).find(el => el.tagName === 'next');
                        inner = nextEl ? Array.from(nextEl.children).find(el => el.tagName === 'block') : null;
                    }
                }

                const Tag = type === 'list_bulleted' ? 'ul' : 'ol';
                const key = b.getAttribute('id') || `list-container-${++_listKeyCounter}`;
                const className = type === 'list_bulleted' ? 'ul-block-list' : 'ol-block-list';
                out.push(<Tag key={key} className={className}>{items}</Tag>);

                // --- 단일 리스트 항목(최상위에 item 블록만 있을 때)
            } else if (type === 'list_item' || type === 'ordered_list_item') {
                const field = Array.from(current.children).find(el => el.tagName === 'field' && el.getAttribute('name') === 'TEXT');
                const text = field?.textContent?.trim();
                if (text) {
                    const id = current.getAttribute('id') || `list-item-${++_listKeyCounter}`;
                    out.push(<li key={id}>{text}</li>);
                }
            }

            // 다음 top-level 체인으로 이동
            const nextNode = Array.from(current.children).find(el => el.tagName === 'next');
            current = nextNode ? Array.from(nextNode.children).find(el => el.tagName === 'block') : null;
        }
    }

    if (out.length === 0) return null;
    if (out.length === 1) return out[0]; // 기존 호출부와 호환되도록 단일 element는 element 자체 반환
    return out; // 여러 element일 경우 배열 반환 (parseLayout의 unwrapParsed와 호환)
}


export function parseSingleListBlock(blockXml) {
    if (!blockXml) return null;

    const parser = new DOMParser();
    const dom = parser.parseFromString(blockXml, 'text/xml');
    const block = dom.getElementsByTagName('block')[0];
    if (!block) return null;

    const type = block.getAttribute('type');

    // 단일 리스트 항목
    if (type === 'list_item' || type === 'ordered_list_item') {
        const field = Array.from(block.children).find(
            (el) => el.tagName === 'field' && el.getAttribute('name') === 'TEXT'
        );
        const text = field?.textContent?.trim();
        if (!text) return null;
        return <li>{text}</li>;
    }

    // 리스트 컨테이너 (ul / ol)
    if (type === 'list_bulleted' || type === 'list_numbered') {
        const statement = Array.from(block.children).find(
            (el) => el.tagName === 'statement' && el.getAttribute('name') === 'ITEMS'
        );
        if (!statement) return type === 'list_bulleted' ? <ul /> : <ol />;

        const items = [];
        let current = Array.from(statement.children).find((el) => el.tagName === 'block');

        while (current) {
            const currentType = current.getAttribute('type');

            // 컨테이너 타입과 항목 타입 일치 여부 체크
            const isValidItem =
                (type === 'list_bulleted' && currentType === 'list_item') ||
                (type === 'list_numbered' && currentType === 'ordered_list_item');

            if (isValidItem) {
                const field = Array.from(current.children).find(
                    (el) => el.tagName === 'field' && el.getAttribute('name') === 'TEXT'
                );
                const text = field?.textContent?.trim();
                if (text) {
                    const id = current.getAttribute('id') || text;
                    items.push(<li key={id}>{text}</li>);
                }
            }

            // 직계 next 블록으로 이동
            const nextEl = Array.from(current.children).find((el) => el.tagName === 'next');
            current = nextEl ? Array.from(nextEl.children).find((el) => el.tagName === 'block') : null;
        }

        return type === 'list_bulleted' ? <ul>{items}</ul> : <ol>{items}</ol>;
    }

    return null;
}
