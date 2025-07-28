// tabs/ListTab.jsx
import * as Blockly from 'blockly';

export function registerListBlocks() {
  Blockly.Blocks['list_item'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("리스트 항목")
        .appendField(new Blockly.FieldTextInput("항목 내용"), "ITEM");
      this.setColour("#B5D8FF");
      this.setTooltip("리스트 항목을 나타냅니다.");
    }
  };
}

export function getListTabToolbox() {
  return {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "리스트 도구",
        colour: "#B5D8FF",
        contents: [
          { kind: "block", type: "list_item" }
        ]
      }
    ]
  };
}

export function parseListXmlToJSX(xml) {
  const dom = Blockly.Xml.textToDom(xml);
  const blocks = dom.children;
  const jsxElements = [];

  for (const block of blocks) {
    if (block.getAttribute('type') === 'list_item') {
      const itemValue = block.querySelector("field[name='ITEM']")?.textContent || "";
      jsxElements.push(<li>{itemValue}</li>);
    }
  }

  if (jsxElements.length > 0) {
    return <ul>{jsxElements}</ul>;
  }
  return [];
}