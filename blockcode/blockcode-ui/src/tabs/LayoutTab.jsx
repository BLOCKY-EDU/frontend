import * as Blockly from 'blockly';
import { parseStyleStatementsToStyleObj } from './StyleTab';

import { parseWritingXmlToJSX } from './WritingTab';
import { parseButtonXmlToJSX } from './ButtonTab';
// import { parseImageXmlToJSX } from './tabs/ImageTab';
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
// export function parseLayoutXmlToJSX(xml) {
//   if (!xml) return null;

//   const parser = new DOMParser();
//   const dom = parser.parseFromString(xml, 'text/xml');
//   const blockNodes = dom.getElementsByTagName('block');

//   const parseBlock = (block) => {
//     const type = block.getAttribute('type');

//     if (type === 'container_box') {
//       let contentStatement = null;
//       let styleStatement = null;

//       // statement 블록들 중 어떤 것이 CONTENT, 어떤 것이 STYLE인지 나눔
//       const statements = block.getElementsByTagName('statement');
//       for (let i = 0; i < statements.length; i++) {
//         const name = statements[i].getAttribute('name');
//         if (name === 'CONTENT') contentStatement = statements[i];
//         if (name === 'STYLE') styleStatement = statements[i];
//       }

//       // style 블록 → JS 객체로 변환
//       const styleObj = parseStyleStatementsToStyleObj(styleStatement);

//       // content 블록 → JSX 재귀 파싱
//       // const children = [];
//       // if (contentStatement) {
//       //   const innerBlock = contentStatement.getElementsByTagName('block')[0];
//       //   if (innerBlock) {
//       //     const childJSX = parseBlock(innerBlock);
//       //     if (childJSX) children.push(childJSX);
//       //   }
//       // }

//       // 여러 개 연결된 블록을 모두 재귀적으로 파싱!
// const children = [];
// if (contentStatement) {
//   let innerBlock = contentStatement.getElementsByTagName('block')[0];
//   while (innerBlock) {
//     const childJSX = parseBlock(innerBlock);
//     if (childJSX) children.push(childJSX);
//     // 다음 연결된 블록(Statement chain)
//     innerBlock = innerBlock.getElementsByTagName('next')[0]?.getElementsByTagName('block')[0];
//   }
// }


//       return (
//         <div key={`box-${Math.random()}`} style={styleObj}>
//           {children}
//         </div>
//       );
//     }

//     return null;
//   };

//   const result = [];
//   for (let i = 0; i < blockNodes.length; i++) {
//     result.push(parseBlock(blockNodes[i]));
//   }

//   return result;
// }


// export function parseLayoutXmlToJSX(xml) {
//   if (!xml) return null;
//   const parser = new DOMParser();
//   const dom = parser.parseFromString(xml, 'text/xml');
//   const blockNodes = dom.getElementsByTagName('block');

//   const parseBlock = (block) => {
//     const type = block.getAttribute('type');
//     if (type === 'container_box') {
//       let contentStatement = null;
//       let styleStatement = null;
//       const statements = block.getElementsByTagName('statement');
//       for (let i = 0; i < statements.length; i++) {
//         const name = statements[i].getAttribute('name');
//         if (name === 'CONTENT') contentStatement = statements[i];
//         if (name === 'STYLE') styleStatement = statements[i];
//       }
//       const styleObj = parseStyleStatementsToStyleObj(styleStatement);

//       const children = [];
//       if (contentStatement) {
//         let innerBlock = contentStatement.getElementsByTagName('block')[0];
//         while (innerBlock) {
//           const type = innerBlock.getAttribute('type');
//           let childJSX = null;
//           if (
//             ["text_title", "text_small_title", "small_content", "recipe_step", "checkbox_block", "toggle_input", "highlight_text"].includes(type)
//           ) {
//             childJSX = parseWritingXmlToJSX(new XMLSerializer().serializeToString(innerBlock));
//             if (Array.isArray(childJSX)) children.push(...childJSX);
//             else if (childJSX) children.push(childJSX);
//           }
//           else if (
//             ["normal_button", "submit_button", "text_input", "email_input", "select_box"].includes(type)
//           ) {
//             childJSX = parseButtonXmlToJSX(new XMLSerializer().serializeToString(innerBlock));
//             if (Array.isArray(childJSX)) children.push(...childJSX);
//             else if (childJSX) children.push(childJSX);
//           }
//           // ... 기타 타입 처리
//           else {
//             // 혹시 중첩 컨테이너 등
//             childJSX = parseBlock(innerBlock);
//             if (Array.isArray(childJSX)) children.push(...childJSX);
//             else if (childJSX) children.push(childJSX);
//           }
//           innerBlock = innerBlock.getElementsByTagName('next')[0]?.getElementsByTagName('block')[0];
//         }
//       }
//       return (
//         <div key={`box-${Math.random()}`} style={styleObj}>
//           {children}
//         </div>
//       );
//     }
//     return null;
//   };

//   const result = [];
//   for (let i = 0; i < blockNodes.length; i++) {
//     result.push(parseBlock(blockNodes[i]));
//   }
//   return result;
// }


// export function parseLayoutXmlToJSX(xml) {
//   if (!xml) return null;
//   const parser = new DOMParser();
//   const dom = parser.parseFromString(xml, 'text/xml');
//   const blockNodes = dom.getElementsByTagName('block');

//   // 여러 상자가 들어오더라도, blockNodes[0]만 단일 상자 처리
//   const result = [];
//   for (let i = 0; i < blockNodes.length; i++) {
//     result.push(parseSingleContainerBlock(blockNodes[i]));
//   }
//   return result;
// }

export function parseLayoutXmlToJSX(xml) {
  if (!xml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blockNodes = dom.getElementsByTagName('block');

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
