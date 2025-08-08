import * as Blockly from 'blockly';
import { parseStyleStatementsToStyleObj } from './StyleTab';
import {parseSingleWritingBlock} from './WritingTab';
import {parseSingleButtonBlock} from './ButtonTab';
import { ColourPreviewDropdown } from '../blocks/CustomFields';

import {STYLE_BLOCK_TYPES} from "./StyleTab";
import {COMBINE_TYPES} from "./CombineType.jsx";

import {parseSingleNavigationBlock} from './NavigationTab';
import {parseSingleListBlock} from './ListTab';
import {parseSingleImageBlock} from "./ImageTab.jsx";

export function registerLayoutBlocks() {
  Blockly.Blocks['container_box'] = {
    init: function () {
      this.appendDummyInput().appendField("상자");
      this.appendStatementInput("CONTENT").setCheck(COMBINE_TYPES);   // 내부 콘텐츠
      this.appendStatementInput("STYLE").setCheck(STYLE_BLOCK_TYPES);     // 스타일 블록 연결
      this.setColour("#A3D5FF");
      this.setTooltip("내용을 담는 레이아웃 상자입니다.");
      this.setPreviousStatement(true, 'container_box');
      this.setNextStatement(true, 'container_box');
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



// export function parseLayoutXmlToJSX(xml) {
//   if (!xml) return null;

//   const parser = new DOMParser();
//   const dom = parser.parseFromString(xml, 'text/xml');
//   const blockNodes = dom.getElementsByTagName('block');

//   const result = [];
//   for (let i = 0; i < blockNodes.length; i++) {
//     result.push(parseSingleContainerBlock(blockNodes[i]));
//   }

//   return result;
// }


// "상자 하나"만 처리!



export function parseLayoutXmlToJSX(xml, setGlobalBackgroundColor) {
  if (!xml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blockNodes = dom.getElementsByTagName('block');

  const result = [];

  for (let i = 0; i < blockNodes.length; i++) {
    const type = blockNodes[i].getAttribute('type');

    if (type === 'global_background') {
      const color = blockNodes[i].getElementsByTagName('field')[0]?.textContent || '#ffffff';
      setGlobalBackgroundColor(color); // ✅ 전역 배경색 변경
      continue; // 화면에 그릴 JSX는 없음
    }

    // container_box 등 실제 JSX 요소들은 그대로 파싱
    result.push(parseSingleContainerBlock(blockNodes[i]));
  }

  return result;
}

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
    if (contentStatement) {
      let innerBlock = contentStatement.getElementsByTagName('block')[0];
      while (innerBlock) {
        const type = innerBlock.getAttribute('type');
        let childJSX = null;

        if (
          ["text_title", "text_small_title", "small_content", "recipe_step", "toggle_input", "highlight_text"].includes(type)
        ) {
          childJSX = parseSingleWritingBlock(new XMLSerializer().serializeToString(innerBlock));
        }
        else if (
          ["normal_button", "submit_button", "text_input", "email_input", "checkbox_block", "select_box"].includes(type)
        ) {
          childJSX = parseSingleButtonBlock(new XMLSerializer().serializeToString(innerBlock));
        }
        else if (
          ["navigation_button"].includes(type)
        ) {
          childJSX = parseSingleNavigationBlock(new XMLSerializer().serializeToString(innerBlock));
        }
        // 목록 블록 처리 추가
        else if (
          ["list_bulleted", "list_numbered"].includes(type)
        ) {
          childJSX = parseSingleListBlock(new XMLSerializer().serializeToString(innerBlock));
        }
        else if (
            ["insert_image", "insert_video", "youtube_link"].includes(type)
        ) {
          childJSX = parseSingleImageBlock(new XMLSerializer().serializeToString(innerBlock));
        }
        else {
          childJSX = parseSingleContainerBlock(innerBlock);
        }

        if (Array.isArray(childJSX)) children.push(...childJSX);
        else if (childJSX) children.push(childJSX);

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