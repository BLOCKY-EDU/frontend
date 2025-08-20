import * as Blockly from 'blockly';
import {COMBINE_TYPES} from "./CombineType.jsx";

export function registerButtonBlocks() {
  Blockly.Blocks['normal_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("일반 버튼")
        .appendField(new Blockly.FieldTextInput("눌러보세요"), "LABEL");
      this.setColour("#FFCDD6");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  Blockly.Blocks['submit_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("제출 버튼")
        .appendField(new Blockly.FieldTextInput("제출"), "LABEL");
      this.setColour("#FFCDD6");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  // Blockly.JavaScript['submit_button'] = function () {
  //   return `alert("제출이 완료되었습니다.");\n`;
  // }

  Blockly.Blocks['text_input'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("글 입력칸")
        .appendField(new Blockly.FieldTextInput("글을 입력해보세요"), "PLACEHOLDER");
      this.setColour("#FFCDD6");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  Blockly.Blocks['email_input'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이메일 입력")
        .appendField(new Blockly.FieldTextInput("example@email.com"), "PLACEHOLDER");
      this.setColour("#FFCDD6");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  Blockly.Blocks['checkbox_block'] = {
      init: function () {
          this.appendDummyInput()
              .appendField("체크박스")
              .appendField(new Blockly.FieldTextInput("텍스트를 넣어보세요"), "LABEL");
          this.setColour("#FFCDD6");
          this.setPreviousStatement(true, COMBINE_TYPES);
          this.setNextStatement(true, COMBINE_TYPES);
      }
  };

  Blockly.Blocks['select_box'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("선택 상자")
        .appendField(new Blockly.FieldTextInput("옵션1,옵션2"), "OPTIONS");
      this.setColour("#FFCDD6");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };
}

/* ✅ 2. 툴박스 반환 */
export function getButtonTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "normal_button" },
      { kind: "block", type: "submit_button" },
      { kind: "block", type: "text_input" },
      { kind: "block", type: "email_input" },
      { kind: "block", type: "checkbox_block" },
      { kind: "block", type: "select_box" },
    ]
  };
}

/* ✅ 3. XML → JSX 변환 */
export function parseButtonXmlToJSX(xml) {
  if (!xml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blocks = dom.getElementsByTagName('block');

  const output = [];
  let checkboxes = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const type = block.getAttribute('type');
    const field = block.getElementsByTagName('field')[0]?.textContent;

    switch (type) {
      case 'normal_button':
        output.push(<button key={`btn-${i}`}>{field}</button>);
        break;
      case 'submit_button':
        output.push(<button key={`submit-${i}`} type="submit">{field}</button>);
        break;
      case 'text_input':
        output.push(<input key={`input-${i}`} type="text" placeholder={field} style={{ marginBottom: 10 }} />);
        break;
      case 'email_input':
        output.push(<input key={`email-${i}`} type="email" placeholder={field} style={{ marginBottom: 10 }} />);
        break;
      case 'checkbox_block':
          { const label = blocks[i].getElementsByTagName('field')[0]?.textContent || "체크";
          checkboxes.push(
              <label key={`checkbox-${i}`} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <input type="checkbox" style={{ marginRight: "8px" }} />
                  {label}
              </label>
          ); }
        break;
      case 'select_box':
        { const options = field.split(',').map((opt, idx) => <option key={idx}>{opt.trim()}</option>);
        output.push(<select key={`select-${i}`} style={{ marginBottom: 10 }}>{options}</select>);
        break; }
      default:
        break;
    }
  }
  if (checkboxes.length > 0) output.push(<div key="checkboxes">{checkboxes}</div>);
  return output;
}

export function parseSingleButtonBlock(blockXml) {
  if (!blockXml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(blockXml, 'text/xml');
  const block = dom.getElementsByTagName('block')[0];
  const type = block.getAttribute('type');
  const field = block.getElementsByTagName('field')[0]?.textContent || '';

  switch (type) {
    case 'normal_button':
      return <button>{field}</button>;
    case 'submit_button':
      return <button type="submit">{field}</button>;
    case 'text_input':
      return <input type="text" placeholder={field} style={{ marginBottom: 10 }} />;
    case 'email_input':
      return <input type="email" placeholder={field} style={{ marginBottom: 10 }} />;
      case 'checkbox_block':
          { const label = block.getElementsByTagName('field')[0]?.textContent || "체크";
          return (
              <label style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <input type="checkbox" style={{ marginRight: "8px" }} />
                  {label}
              </label>
          ); }
    case 'select_box':
      { const options = field.split(',').map((opt, idx) => <option key={idx}>{opt.trim()}</option>);
      return <select style={{ marginBottom: 10 }}>{options}</select>; }
    default:
      return null;
  }
}
