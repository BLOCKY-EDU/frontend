import React, { useState } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';

export default function App() {
  const tabs = [
    { name: "화면", color: "#7EC8E3" },
    { name: "스타일", color: "#FFD966" },
    { name: "글쓰기", color: "#A7E57E" },
    { name: "버튼", color: "#FF9999" },
    { name: "사진", color: "#BCA0DC" },
    { name: "목록", color: "#F5B26B" },
    { name: "이동", color: "#79C2D0" },
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
          kind: "categoryToolbox",
          contents: [
            {
              kind: "category",
              name: "스타일",
              colour: "#FFD700",
              contents: [
                { kind: "block", type: "style_background" },
                { kind: "block", type: "style_width" },
                { kind: "block", type: "style_height" },
                { kind: "block", type: "style_text_align" }
              ]
            }
          ]
        };
      case "글쓰기":
        return {
          kind: "categoryToolbox",
          contents: [
            {
              kind: "category",
              name: "글쓰기",
              colour: "#00BFFF",
              contents: [
                { kind: "block", type: "text_title" },
                { kind: "block", type: "text_paragraph" },
                { kind: "block", type: "checkbox_block" }
              ]
            }
          ]
        };
      default:
        return {
          kind: "categoryToolbox",
          contents: []
        };
    }
  };

  return (
    <div className="app-container">
      {/* 헤더 */}
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

      {/* 본문 전체 박스 */}
      <main className="main-box">
        {/* 나의 화면 */}
        <section className="render-box">
          <div className="title-bar">나의 화면</div>
          <div className="rendered-content">{parseXmlToJSX(xmlText)}</div>
        </section>

        {/* Blockly 조립 화면 */}
        <section className="blockly-box">
          {/* 도구 책갈피 UI */}
          <div className="tab-bar">
            {tabs.map((tab) => (
              <div key={tab.name}>
                <button
                  onClick={() => setActiveTab(activeTab === tab.name ? null : tab.name)}
                  className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
                  style={{ backgroundColor: tab.color }}
                >
                  {tab.name}
                </button>

                {activeTab === tab.name && (
                  <div className="toolbox-panel">
                    <div className="toolset">
                      {tab.name === "스타일" && (
                        <>
                          <div className="tool-pill">바깥 여백</div>
                          <div className="tool-pill">배경 색상</div>
                          <div className="tool-pill">폭</div>
                          <div className="tool-pill">정렬</div>
                        </>
                      )}
                      {tab.name === "글쓰기" && (
                        <>
                          <div className="tool-pill">제목</div>
                          <div className="tool-pill">문단</div>
                          <div className="tool-pill">체크박스</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Blockly 에디터 */}
          <div className="blockly-wrapper">
            <BlocklyWorkspace
              toolboxConfiguration={getToolboxJson(activeTab)}
              initialXml=""
              className="blockly-editor"
              workspaceConfiguration={{
                grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                zoom: { controls: true, wheel: true },
              }}
              onXmlChange={(newXml) => setXmlText(newXml)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}