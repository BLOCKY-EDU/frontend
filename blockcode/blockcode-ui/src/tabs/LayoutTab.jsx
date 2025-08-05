import * as Blockly from 'blockly';
import { FieldColour } from '@blockly/field-colour';

import { parseStyleStatementsToStyleObj } from './StyleTab';

import { parseWritingXmlToJSX } from './WritingTab';
import { parseButtonXmlToJSX } from './ButtonTab';

import {STYLE_BLOCK_TYPES} from "./StyleTab";
import {COMBINE_TYPES} from "./CombineType.jsx";
// import { parseImageXmlToJSX } from './tabs/ImageTab';
/* ✅ 1. 블록 등록 */
export function registerLayoutBlocks() {
  Blockly.Blocks['container_box'] = {
    init: function () {
      this.appendDummyInput().appendField("상자");
      this.appendStatementInput("CONTENT").setCheck(COMBINE_TYPES);   // 내부 콘텐츠
      this.appendStatementInput("STYLE").setCheck(STYLE_BLOCK_TYPES);     // 스타일 블록 연결
      this.setColour("#A3D5FF");
      this.setTooltip("내용을 담는 레이아웃 상자입니다.");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };
  Blockly.Blocks['background_color_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("배경색")
.appendField(new Blockly.FieldColour("#ffffff"), "COLOR");
        this.setColour("#E2B8FF");
      this.setTooltip("전체 배경색을 설정합니다.");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };
  
}

/* ✅ 2. 툴박스 JSON */
export function getLayoutTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "container_box" },
      { kind: "block", type: "background_color_block" },
      { kind: "block", type: "color_circle_block" }

    ]
  };
}



export function parseLayoutXmlToJSX(xml) {
  if (!xml) return null;
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blockNodes = dom.getElementsByTagName('block');

  // 여러 상자가 들어오더라도, blockNodes[0]만 단일 상자 처리
  const result = [];
  for (let i = 0; i < blockNodes.length; i++) {
    result.push(parseSingleContainerBlock(blockNodes[i]));
  }
  return result;
}



// "상자 하나"만 처리!
function parseSingleContainerBlock(block) {
  const type = block.getAttribute('type');
  if (type === 'container_box') {
    let contentStatement = null;
    let styleStatement = null;
    const statements = block.getElementsByTagName('statement');
    for (let i = 0; i < statements.length; i++) {
      const name = statements[i].getAttribute('name');
      if (name === 'CONTENT') contentStatement = statements[i];
      if (name === 'STYLE') styleStatement = statements[i];
    }
    const styleObj = parseStyleStatementsToStyleObj(styleStatement);

    const children = [];
    // **여기서 contentStatement 안에 있는 블록들만, next 체인만 따로 파싱**
    if (contentStatement) {
      let innerBlock = contentStatement.getElementsByTagName('block')[0];
      while (innerBlock) {
        const type = innerBlock.getAttribute('type');
        let childJSX = null;
        if (
          ["text_title", "text_small_title", "small_content", "recipe_step", "checkbox_block", "toggle_input", "highlight_text"].includes(type)
        ) {
          childJSX = parseWritingXmlToJSX(new XMLSerializer().serializeToString(innerBlock));
          if (Array.isArray(childJSX)) children.push(...childJSX);
          else if (childJSX) children.push(childJSX);
        }
        else if (
          ["normal_button", "submit_button", "text_input", "email_input", "select_box"].includes(type)
        ) {
          childJSX = parseButtonXmlToJSX(new XMLSerializer().serializeToString(innerBlock));
          if (Array.isArray(childJSX)) children.push(...childJSX);
          else if (childJSX) children.push(childJSX);
        }
        else {
          childJSX = parseSingleContainerBlock(innerBlock);
          if (Array.isArray(childJSX)) children.push(...childJSX);
          else if (childJSX) children.push(childJSX);
        }
        // 이 **상자 CONTENT에 붙은 블록만 next로 진행**
        innerBlock = innerBlock.getElementsByTagName('next')[0]?.getElementsByTagName('block')[0];
      }
    }

    return (
      <div key={`box-${Math.random()}`} style={styleObj}>
        {children}
      </div>
    );
  }
  return null;
}
