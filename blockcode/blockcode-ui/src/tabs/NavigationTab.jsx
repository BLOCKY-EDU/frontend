import * as Blockly from 'blockly';
import {COMBINE_TYPES} from "./CombineType.jsx";

export function registerNavigationBlocks() {
  Blockly.Blocks['navigation_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이동 버튼")
        .appendField(new Blockly.FieldTextInput("www.naver.com"), "LINK")
        .appendField("버튼 이름")
        .appendField(new Blockly.FieldTextInput("GO"), "LABEL");
      this.setColour("#D1B3FF");
      this.setTooltip("클릭 시 특정 링크로 이동하는 버튼입니다.");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };
}

export function getNavigationTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      {
        kind: "block",
        type: "navigation_button"
      }
    ]
  };
}

export function parseNavigationXmlToJSX(xmlText) {
  try {
    if (!xmlText || typeof xmlText !== 'string') {
      console.warn("parseNavigationXmlToJSX: 잘못된 XML 입력");
      return null;
    }

    // DOMParser 인스턴스 생성
    const parser = new DOMParser();
    const dom = parser.parseFromString(xmlText, 'text/xml');
    const block = dom.firstChild;

    if (!block) {
      console.warn("parseNavigationXmlToJSX: XML에서 block 노드를 찾을 수 없음");
      return null;
    }

    const fields = block.getElementsByTagName('field');
    const labelField = Array.from(fields).find(f => f.getAttribute('name') === 'LABEL');
    const linkField = Array.from(fields).find(f => f.getAttribute('name') === 'LINK');

    const label = labelField?.textContent?.trim() || '이동';
    let rawHref = linkField?.textContent?.trim() || '';

    // 링크 형식 보정
    if (rawHref.startsWith('/')) rawHref = rawHref.slice(1);
    const href = /^https?:\/\//i.test(rawHref) ? rawHref : `https://${rawHref}`;

    // 버튼 JSX 반환
    return (
      <button
        key={`nav-btn-${Date.now()}`}
        type="button"
        onClick={e => {
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
        }}
        style={{
          padding: '10px 16px',
          margin: '8px 0',
          borderRadius: 4,
          border: '1px solid #ccc',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer'
        }}
      >
        {label}
      </button>
    );
  } catch (error) {
    console.error("parseNavigationXmlToJSX 오류:", error);
    return null;
  }
}