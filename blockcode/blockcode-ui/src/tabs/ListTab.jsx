import * as Blockly from 'blockly';
import React from 'react';

export function registerListBlocks() {
  // 글머리(ul) 컨테이너
  Blockly.Blocks['list_bulleted'] = {
    init: function () {
      this.appendStatementInput("ITEMS")
        .setCheck("list_item")
        .appendField("글머리");
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

export const parseListXmlToJSX = (xmlText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const block = xml.firstChild;
  if (!block) return null;

  const type = block.getAttribute('type');
  if (type === "list_bulleted" || type === "list_numbered") {
    // 자식 statement(ITEMS) 찾기
    const statement = block.querySelector('statement[name="ITEMS"]');
    const items = [];
    if (statement) {
      let current = statement.firstElementChild; // <block ...>
      while (current) {
        // list_item 또는 ordered_list_item
        const field = current.querySelector('field[name="TEXT"]');
        const text = field?.textContent || '';
        items.push(<li key={text + Math.random()}>{text}</li>);
        current = current.querySelector('next > block');
      }
    }
    if (type === "list_bulleted") return <ul>{items}</ul>;
    if (type === "list_numbered") return <ol>{items}</ol>;
    return null;
  }
  // 항목 블록
  if (type === "list_item" || type === "ordered_list_item") {
    const field = block.querySelector('field[name="TEXT"]');
    const text = field?.textContent || '';
    return <li>{text}</li>;
  }
  return null;
};