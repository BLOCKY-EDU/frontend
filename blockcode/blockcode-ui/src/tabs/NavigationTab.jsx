// tabs/NavigationTab.jsx
import * as Blockly from 'blockly';

export function registerNavigationBlocks() {
  Blockly.Blocks['navigation_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이동 버튼")
        .appendField(new Blockly.FieldTextInput("페이지 이름"), "PAGE");
      this.setColour("#FFCC99");
      this.setTooltip("다른 페이지로 이동하는 버튼입니다.");
    }
  };
}

export function getNavigationTabToolbox() {
  return {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "이동 도구",
        colour: "#FFCC99",
        contents: [
          { kind: "block", type: "navigation_button" }
        ]
      }
    ]
  };
}

export function parseNavigationXmlToJSX(xml) {
  const dom = Blockly.Xml.textToDom(xml);
  const blocks = dom.children;
  const jsxElements = [];

  for (const block of blocks) {
    if (block.getAttribute('type') === 'navigation_button') {
      const page = block.querySelector("field[name='PAGE']")?.textContent || "";
      jsxElements.push(<button>{page} 페이지로 이동</button>);
    }
  }

  return jsxElements;
}