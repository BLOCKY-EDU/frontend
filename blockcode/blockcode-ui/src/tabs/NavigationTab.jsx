// // tabs/NavigationTab.jsx
// import * as Blockly from 'blockly';

// export function registerNavigationBlocks() {
//   Blockly.Blocks['navigation_button'] = {
//     init: function () {
//       this.appendDummyInput()
//         .appendField("이동 버튼")
//         .appendField(new Blockly.FieldTextInput("페이지 이름"), "PAGE");
//       this.setColour("#FFCC99");
//       this.setTooltip("다른 페이지로 이동하는 버튼입니다.");
//     }
//   };
// }

// export function getNavigationTabToolbox() {
//   return {
//     kind: "categoryToolbox",
//     contents: [
//       {
//         kind: "category",
//         name: "이동 도구",
//         colour: "#FFCC99",
//         contents: [
//           { kind: "block", type: "navigation_button" }
//         ]
//       }
//     ]
//   };
// }

// export function parseNavigationXmlToJSX(xml) {
//   const dom = Blockly.Xml.textToDom(xml);
//   const blocks = dom.children;
//   const jsxElements = [];

//   for (const block of blocks) {
//     if (block.getAttribute('type') === 'navigation_button') {
//       const page = block.querySelector("field[name='PAGE']")?.textContent || "";
//       jsxElements.push(<button>{page} 페이지로 이동</button>);
//     }
//   }

//   return jsxElements;
// }

// src/tabs/NavigationTab.jsx
import * as Blockly from 'blockly';

export function registerNavigationBlocks() {
  Blockly.Blocks['navigation_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이동 버튼")
        .appendField(new Blockly.FieldTextInput("이동할 주소를 입력하세요"), "LINK")
        .appendField("버튼 이름")
        .appendField(new Blockly.FieldTextInput("GO"), "LABEL");
      this.setColour("#D1B3FF");
      this.setTooltip("클릭 시 특정 링크로 이동하는 버튼입니다.");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
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

// src/tabs/NavigationTab.jsx (이어쓰기)
export function parseNavigationXmlToJSX(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const block = xmlDoc.querySelector("block[type='navigation_button']");
  if (!block) return null;

  const link = block.querySelector("field[name='LINK']")?.textContent || "#";
  const label = block.querySelector("field[name='LABEL']")?.textContent || "GO";

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button style={{
        padding: '8px 16px',
        backgroundColor: '#D1B3FF',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '8px 0'
      }}>
        {label}
      </button>
    </a>
  );
}

