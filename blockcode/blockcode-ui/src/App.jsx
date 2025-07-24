import React, { useState } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/msg/ko';

/* --- 💡 블록 정의 --- */
Blockly.Blocks['style_background'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("배경 색상")
      .appendField(new Blockly.FieldDropdown([
        ["하양", "#ffffff"],
        ["노랑", "#FFEE95"],
        ["하늘", "#C9E2F1"],
        ["핑크", "#FFCDD6"]
      ]), "COLOR");
    this.setColour("#FFD700");
  }
};

Blockly.Blocks['style_width'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("너비")
      .appendField(new Blockly.FieldNumber(100, 0, 1000), "WIDTH")
      .appendField("px");
    this.setColour("#FFD700");
  }
};

Blockly.Blocks['style_height'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("높이")
      .appendField(new Blockly.FieldNumber(100, 0, 1000), "HEIGHT")
      .appendField("px");
    this.setColour("#FFD700");
  }
};

Blockly.Blocks['style_text_align'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("텍스트 정렬")
      .appendField(new Blockly.FieldDropdown([
        ["왼쪽", "left"],
        ["가운데", "center"],
        ["오른쪽", "right"]
      ]), "ALIGN");
    this.setColour("#FFD700");
  }
};

/* --- JSX 파싱 --- */
export default function App() {
  const tabs = [
    { name: "화면", color: "#C9E2F1" },
    { name: "스타일", color: "#C9E2F1" },
    { name: "글쓰기", color: "#C9E2F1" },
    { name: "버튼", color: "#C9E2F1" },
    { name: "사진", color: "#C9E2F1" },
    { name: "목록", color: "#C9E2F1" },
    { name: "이동", color: "#C9E2F1" }
  ];

  const [xmlText, setXmlText] = useState("");
  const [activeTab, setActiveTab] = useState("스타일");

  const parseXmlToJSX = (xml) => {
    if (!xml) return null;
    const parser = new DOMParser();
    const dom = parser.parseFromString(xml, 'text/xml');
    const blocks = dom.getElementsByTagName('block');
    const output = [];

    for (let i = 0; i < blocks.length; i++) {
      const type = blocks[i].getAttribute('type');
      if (type === 'text_title') output.push(<h3 key={i}>제목</h3>);
      else if (type === 'text_paragraph') output.push(<p key={i}>문단 텍스트</p>);
      else if (type === 'checkbox_block') output.push(<label key={i}><input type="checkbox" /> 체크박스 항목</label>);
    }

    return output;
  };

  const getToolboxJson = (tab) => {
    switch (tab) {
      case "스타일":
        return {
          kind: "flyoutToolbox",
          contents: [
            { kind: "block", type: "style_background" },
            { kind: "block", type: "style_width" },
            { kind: "block", type: "style_height" },
            { kind: "block", type: "style_text_align" }
          ]
        };
      case "글쓰기":
        return {
          kind: "flyoutToolbox",
          contents: [
            { kind: "block", type: "text_title" },
            { kind: "block", type: "text_paragraph" },
            { kind: "block", type: "checkbox_block" }
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
                  zoom: { controls: true, wheel: true }
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