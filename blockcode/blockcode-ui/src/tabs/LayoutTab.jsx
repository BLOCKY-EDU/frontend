import * as Blockly from 'blockly';
import { parseStyleStatementsToStyleObj } from './StyleTab';

/* ✅ 1. 블록 등록 */
export function registerLayoutBlocks() {
  Blockly.Blocks['container_box'] = {
    init: function () {
      this.appendDummyInput().appendField("상자");
      this.appendStatementInput("CONTENT").setCheck(null);   // 내부 콘텐츠
      this.appendStatementInput("STYLE").setCheck(null);     // 스타일 블록 연결
      this.setColour("#A3D5FF");
      this.setTooltip("내용을 담는 레이아웃 상자입니다.");
    }
  };
}

/* ✅ 2. 툴박스 JSON */
export function getLayoutTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "container_box" }
    ]
  };
}

/* ✅ 3. XML → JSX 변환 */
export function parseLayoutXmlToJSX(xml) {
  if (!xml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blockNodes = dom.getElementsByTagName('block');

  const parseBlock = (block) => {
    const type = block.getAttribute('type');

    if (type === 'container_box') {
      let contentStatement = null;
      let styleStatement = null;

      // statement 블록들 중 어떤 것이 CONTENT, 어떤 것이 STYLE인지 나눔
      const statements = block.getElementsByTagName('statement');
      for (let i = 0; i < statements.length; i++) {
        const name = statements[i].getAttribute('name');
        if (name === 'CONTENT') contentStatement = statements[i];
        if (name === 'STYLE') styleStatement = statements[i];
      }

      // style 블록 → JS 객체로 변환
      const styleObj = parseStyleStatementsToStyleObj(styleStatement);

      // content 블록 → JSX 재귀 파싱
      const children = [];
      if (contentStatement) {
        const innerBlock = contentStatement.getElementsByTagName('block')[0];
        if (innerBlock) {
          const childJSX = parseBlock(innerBlock);
          if (childJSX) children.push(childJSX);
        }
      }

      return (
        <div key={`box-${Math.random()}`} style={styleObj}>
          {children}
        </div>
      );
    }

    return null;
  };

  const result = [];
  for (let i = 0; i < blockNodes.length; i++) {
    result.push(parseBlock(blockNodes[i]));
  }

  return result;
}