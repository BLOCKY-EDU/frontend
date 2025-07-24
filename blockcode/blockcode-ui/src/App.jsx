import React, { useState, useEffect } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/msg/ko';

/* --- 💡 블록 정의 --- */
Blockly.Blocks['text_title'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("큰 제목")
      .appendField(new Blockly.FieldTextInput("쿠키 레시피 만드는 법"), "TITLE");
    this.setColour("#FFAB19");
  }
};
Blockly.Blocks['highlight_text'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("강조하기")
      .appendField(new Blockly.FieldTextInput("중요한 단어"), "HIGHLIGHT");
    this.setColour("#FF6666");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['text_small_title'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("작은 제목")
      .appendField(new Blockly.FieldTextInput("쿠키 레시피 만드는 법"), "SMALL_TITLE");
    this.setColour("#FFAB19");
  }
};

Blockly.Blocks['small_content'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("작은 설명")
      .appendField(new Blockly.FieldTextInput("르뱅쿠키 만들기"), "SMALL_CONTENT");
    this.setColour("#FFAB19");
  }
};

Blockly.Blocks['recipe_step'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("순서 단계")
      .appendField(new Blockly.FieldTextInput("밀가루를 이용해서 반죽을 만든다"), "STEP");
    this.setColour("#FFAB19");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['checkbox_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("체크박스")
      .appendField(new Blockly.FieldTextInput("밀가루"), "LABEL");
    this.setColour("#4C97FF");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks['toggle_input'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("입력 또는 선택")
      .appendField(new Blockly.FieldDropdown([
        ["직접 입력", "input"],
        ["선택 토글", "select"]
      ]), "MODE")
      .appendField(new Blockly.FieldTextInput("값 또는 옵션"), "VALUE");
    this.setColour("#C9E2F1");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

export default function App() {
  useEffect(() => {
    const handleResize = () => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        Blockly.svgResize(workspace);
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(() => handleResize(), 100);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { name: "화면", color: "#C9E2F1" },
    { name: "스타일", color: "#FFEE95" },
    { name: "글쓰기", color: "#FFCCCB" },
    { name: "버튼", color: "#F4B6C2" },
    { name: "사진", color: "#C9E2F1" },
    { name: "목록", color: "#B5D8FF" },
    { name: "이동", color: "#FFCC99" }
  ];

  const [xmlText, setXmlText] = useState("");
  const [activeTab, setActiveTab] = useState("글쓰기");

  const parseXmlToJSX = (xml) => {
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
        output.push(<h1 key={`title-${i}`}>{title}</h1>);
      }
      else if (type === 'text_small_title') {
        const title = blocks[i].getElementsByTagName('field')[0]?.textContent || "제목 없음";
        output.push(<h3 key={`small_title-${i}`}>{title}</h3>);
      }
      else if (type === 'small_content') {
        const title = blocks[i].getElementsByTagName('field')[0]?.textContent || "제목 없음";
        output.push(<h5 key={`small_content-${i}`}>{title}</h5>);
      }

      else if (type === 'recipe_step') {
        const step = blocks[i].getElementsByTagName('field')[0]?.textContent || "";
        steps.push(<li key={`step-${i}`}>{step}</li>);
      }

      else if (type === 'highlight_text') {
        const text = blocks[i].getElementsByTagName('field')[0]?.textContent || "강조";
        output.push(<span key={`highlight-${i}`} style={{ textDecoration: 'underline', textDecorationColor: 'red' }}>{text}</span>);
      }

      else if (type === 'checkbox_block') {
        const label = blocks[i].getElementsByTagName('field')[0]?.textContent || "체크";
        checkboxes.push(
          <label key={`checkbox-${i}`} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <input type="checkbox" style={{ marginRight: "8px" }} />
            {label}
          </label>
        );
      }

      else if (type === 'toggle_input') {
        const mode = blocks[i].getElementsByTagName('field')[0]?.textContent;
        const value = blocks[i].getElementsByTagName('field')[1]?.textContent;
        toggles.push(
          mode === "input"
            ? <input key={`toggle-${i}`} type="text" placeholder={value} style={{ marginBottom: '8px', padding: '4px' }} />
            : <select key={`toggle-${i}`} style={{ marginBottom: '8px', padding: '4px' }}><option>{value}</option></select>
        );
      }
    }

    if (steps.length > 0) output.push(<ol key="steps">{steps}</ol>);
    if (checkboxes.length > 0) output.push(<div key="checkboxes">{checkboxes}</div>);
    if (toggles.length > 0) output.push(<div key="toggles">{toggles}</div>);

    return output;
  };

  const getToolboxJson = (tab) => {
    switch (tab) {
      case "글쓰기":
        return {
          kind: "flyoutToolbox",
          contents: [
            { kind: "block", type: "text_title" },
            { kind: "block", type: "text_small_title" },
            { kind: "block", type: "text_small_title" },
            { kind: "block", type: "highlight_text" },

            { kind: "block", type: "small_content" },
            { kind: "block", type: "recipe_step" },
            { kind: "block", type: "checkbox_block" },
            { kind: "block", type: "toggle_input" }
          ]
        };
      default:
        return {
          kind: "flyoutToolbox",
          contents: []
        };
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo"><img src={blockyLogo} alt="BLOCKY" /></div>
        <nav className="nav">
          <span>서비스 소개</span>
          <span>자유롭게 놀기</span>
          <span>미션 수행하기</span>
        </nav>
        <div className="auth">
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </header>

      <main className="main-box">
        <section className="render-box">
          <div className="title-bar">나의 화면</div>
          <div className="rendered-content">{parseXmlToJSX(xmlText)}</div>
        </section>

        <section className="tool-editor-area">
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(activeTab === tab.name ? null : tab.name)}
                style={{ backgroundColor: activeTab === tab.name ? '#FFEE95' : tab.color }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="blockly-box">
            
            <div className="blockly-wrapper">
              <BlocklyWorkspace
                toolboxConfiguration={getToolboxJson(activeTab)}
                initialXml=""
                className="blockly-editor"
                workspaceConfiguration={{
                  toolboxPosition: 'top',
                  trashcan: true,
                  grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                  zoom: { controls: true, wheel: true },
                  renderer: "zelos",
                  horizontalLayout: true,
                  move: {
                    scrollbars: true,
                    drag: true,
                    wheel: true,
                  }
                }}
                onXmlChange={(newXml) => setXmlText(newXml)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
