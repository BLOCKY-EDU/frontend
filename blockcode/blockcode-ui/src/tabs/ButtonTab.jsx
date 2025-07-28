// ButtonTab.jsx
import React from 'react';
import * as Blockly from 'blockly';

export function registerButtonBlocks() {
  Blockly.Blocks['normal_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("일반 버튼")
        .appendField(new Blockly.FieldTextInput("클릭"), "LABEL");
      this.setColour("#F4B6C2");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['submit_button'] = {
    init: function () {
      this.appendDummyInput()
          .appendField("제출 버튼");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(0);
      this.setTooltip("제출 버튼을 누르면 알림이 뜹니다");
    }
  };
  
  Blockly.JavaScript['submit_button'] = function () {
    return `alert("제출이 완료되었습니다.");\n`;
  };
  

  Blockly.Blocks['text_input'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("글 입력칸")
        .appendField(new Blockly.FieldTextInput("내용을 입력하세요"), "PLACEHOLDER");
      this.setColour("#F4B6C2");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['email_input'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이메일 입력")
        .appendField(new Blockly.FieldTextInput("example@email.com"), "PLACEHOLDER");
      this.setColour("#F4B6C2");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['checkbox'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("체크박스")
        .appendField(new Blockly.FieldTextInput("옵션"), "LABEL");
      this.setColour("#F4B6C2");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };

  Blockly.Blocks['select_box'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("선택 상자")
        .appendField(new Blockly.FieldTextInput("옵션1, 옵션2"), "OPTIONS");
      this.setColour("#F4B6C2");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };
}

export function getButtonTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "normal_button" },
      { kind: "block", type: "submit_button" },
      { kind: "block", type: "text_input" },
      { kind: "block", type: "email_input" },
      { kind: "block", type: "checkbox" },
      { kind: "block", type: "select_box" },
    ]
  };
}

export function parseButtonXmlToJSX(xml) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blocks = dom.getElementsByTagName('block');
  const output = [];

  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].getAttribute('type');
    const field = blocks[i].getElementsByTagName('field');

    if (type === 'normal_button') {
      const label = field[0]?.textContent;
      output.push(<button key={i}>{label}</button>);
    } else if (type === 'submit_button') {
      const label = field[0]?.textContent;
      output.push(<button key={i} type="submit">{label}</button>);
    } else if (type === 'text_input') {
      const placeholder = field[0]?.textContent;
      output.push(<input key={i} type="text" placeholder={placeholder} />);
    } else if (type === 'email_input') {
      const placeholder = field[0]?.textContent;
      output.push(<input key={i} type="email" placeholder={placeholder} />);
    } else if (type === 'checkbox') {
      const label = field[0]?.textContent;
      output.push(
        <label key={i} style={{ display: "flex", alignItems: "center" }}>
          <input type="checkbox" style={{ marginRight: "6px" }} /> {label}
        </label>
      );
    } else if (type === 'select_box') {
      const options = field[0]?.textContent?.split(',').map(opt => opt.trim());
      output.push(
        <select key={i}>
          {options.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      );
    }
  }

  return output;
}