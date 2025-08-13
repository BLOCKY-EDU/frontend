import * as Blockly from 'blockly';
import {COMBINE_TYPES} from "./CombineType.jsx";

/* 블록 정의 */
export function registerWritingBlocks() {
  Blockly.Blocks['text_title'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("큰 제목")
        .appendField(new Blockly.FieldTextInput("쿠키 레시피 만드는 법"), "TITLE");
      this.setColour("#FFAB19");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  Blockly.Blocks['text_small_title'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("작은 제목")
        .appendField(new Blockly.FieldTextInput("쿠키 레시피 만드는 법"), "SMALL_TITLE");
      this.setColour("#FFAB19");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };

  Blockly.Blocks['small_content'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("작은 설명")
        .appendField(new Blockly.FieldTextInput("르뱅쿠키 만들기"), "SMALL_CONTENT");
      this.setColour("#FFAB19");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);

    }
  };

  // Blockly.Blocks['recipe_step'] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("순서 단계")
  //       .appendField(new Blockly.FieldTextInput("밀가루를 이용해서 반죽을 만든다"), "STEP");
  //     this.setColour("#FFA5A5");
  //     this.setPreviousStatement(true, COMBINE_TYPES);
  //     this.setNextStatement(true, COMBINE_TYPES);
  //   }
  // };

  // Blockly.Blocks['checkbox_block'] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("체크박스")
  //       .appendField(new Blockly.FieldTextInput("밀가루"), "LABEL");
  //     this.setColour("#FFA5A5");
  //     this.setPreviousStatement(true, COMBINE_TYPES);
  //     this.setNextStatement(true, COMBINE_TYPES);
  //   }
  // };

  // Blockly.Blocks['toggle_input'] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("입력 또는 선택")
  //       .appendField(new Blockly.FieldDropdown([
  //         ["직접 입력", "input"],
  //         ["선택 토글", "select"]
  //       ]), "MODE")
  //       .appendField(new Blockly.FieldTextInput("값 또는 옵션"), "VALUE");
  //     this.setColour("#FFA5A5");
  //     this.setPreviousStatement(true, COMBINE_TYPES);
  //     this.setNextStatement(true, COMBINE_TYPES);
  //   }
  // };

  Blockly.Blocks['highlight_text'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("강조하기")
        .appendField(new Blockly.FieldTextInput("중요한 단어"), "HIGHLIGHT");
      this.setColour("#FFA5A5");
      this.setPreviousStatement(true, COMBINE_TYPES);
      this.setNextStatement(true, COMBINE_TYPES);
    }
  };
}

/* JSX 변환 함수 */
export function parseWritingXmlToJSX(xml) {
  if (!xml) return null;
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blocks = dom.getElementsByTagName('block');

  const output = [];
  let steps = [];
  let checkboxes = [];
  let toggles = [];

  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].getAttribute('type');

    if (type === 'text_title') {
      const title = blocks[i].getElementsByTagName('field')[0]?.textContent || "제목 없음";
      output.push(<h1 key={`title-${i}`} className="block-title">
        {title}
      </h1>
      );
    } else if (type === 'text_small_title') {
      const title = blocks[i].getElementsByTagName('field')[0]?.textContent || "제목 없음";
      output.push(<h3 key={`small_title-${i}`} className="block-subtitle" >{title} </h3>);
    } else if (type === 'small_content') {
      const content = blocks[i].getElementsByTagName('field')[0]?.textContent || "설명 없음";
      output.push(<h5 key={`small_content-${i}`} className="block-smallcontent">{content}</h5>);
    } else if (type === 'recipe_step') {
      const step = blocks[i].getElementsByTagName('field')[0]?.textContent || "";
      steps.push(<li key={`step-${i}`} className="block-list">{step}</li>);
    // } else if (type === 'checkbox_block') {
    //   const label = blocks[i].getElementsByTagName('field')[0]?.textContent || "체크";
    //   checkboxes.push(
    //     <label key={`checkbox-${i}`} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
    //       <input type="checkbox" style={{ marginRight: "8px" }} />
    //       {label}
    //     </label>
    //   );
    } else if (type === 'toggle_input') {
      const mode = blocks[i].getElementsByTagName('field')[0]?.textContent;
      const value = blocks[i].getElementsByTagName('field')[1]?.textContent;
      toggles.push(
        mode === "input"
          ? <input key={`toggle-${i}`} type="text" placeholder={value} style={{ marginBottom: '8px', padding: '4px' }} />
          : <select key={`toggle-${i}`} style={{ marginBottom: '8px', padding: '4px' }}><option>{value}</option></select>
      );
    } else if (type === 'highlight_text') {
      const text = blocks[i].getElementsByTagName('field')[0]?.textContent || "강조";
      output.push(
        <span
          key={`highlight-${i}`}
          style={{ textDecoration: 'underline', textDecorationColor: 'red' }}
        >
          {text}
        </span>
      );
    }
  }

  if (steps.length > 0) output.push(<ol key="steps">{steps}</ol>);
  // if (checkboxes.length > 0) output.push(<div key="checkboxes">{checkboxes}</div>);
  if (toggles.length > 0) output.push(<div key="toggles">{toggles}</div>);

  return output;
}

// 블록 하나만 처리
export function parseSingleWritingBlock(blockXml) {
  if (!blockXml) return null;

  const parser = new DOMParser();
  const dom = parser.parseFromString(blockXml, 'text/xml');
  const block = dom.getElementsByTagName('block')[0];
  const type = block.getAttribute('type');

  if (type === 'text_title') {
    const title = block.getElementsByTagName('field')[0]?.textContent || "제목 없음";
    return <h1>{title}</h1>;
  } else if (type === 'text_small_title') {
    const title = block.getElementsByTagName('field')[0]?.textContent || "제목 없음";
    return <h3>{title}</h3>;
  } else if (type === 'small_content') {
    const content = block.getElementsByTagName('field')[0]?.textContent || "설명 없음";
    return <h5>{content}</h5>;
  // } else if (type === 'checkbox_block') {
    // const label = block.getElementsByTagName('field')[0]?.textContent || "체크";
    // return (
    //     <label style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
    //       <input type="checkbox" style={{ marginRight: "8px" }} />
    //       {label}
    //     </label>
    // );
  } else if (type === 'highlight_text') {
    const text = block.getElementsByTagName('field')[0]?.textContent || "강조";
    return (
        <span style={{ textDecoration: 'underline', textDecorationColor: 'red' }}>
        {text}
      </span>
    );
  }

  return null;
}

/* 툴박스 반환 함수 */
export function getWritingTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "text_title" },
      { kind: "block", type: "text_small_title" },
      { kind: "block", type: "small_content" },
      // { kind: "block", type: "recipe_step" },
      // { kind: "block", type: "checkbox_block" },
      // { kind: "block", type: "toggle_input" },
      { kind: "block", type: "highlight_text" },
    ]
  };
}
