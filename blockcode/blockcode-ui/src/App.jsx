import React, { useState, useEffect } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/msg/ko';

import { getWritingTabToolbox, registerWritingBlocks, parseWritingXmlToJSX } from './tabs/WritingTab';
import { getImageTabToolbox, registerImageBlocks, parseImageXmlToJSX } from './tabs/ImageTab';
import { registerLayoutBlocks, getLayoutTabToolbox, parseLayoutXmlToJSX } from './tabs/LayoutTab.jsx';
import { registerButtonBlocks, getButtonTabToolbox, parseButtonXmlToJSX } from './tabs/ButtonTab.jsx';
import { registerStyleBlocks, getStyleTabToolbox } from './tabs/StyleTab.jsx';

registerStyleBlocks();
registerWritingBlocks();
registerImageBlocks();
registerLayoutBlocks();
registerButtonBlocks();

export default function App() {
  const tabs = [
    { name: "화면", color: "#C9E2F1" },
    { name: "스타일", color: "#FFEE95" },
    { name: "글쓰기", color: "#FFCCCB" },
    { name: "버튼", color: "#F4B6C2" },
    { name: "사진", color: "#C9E2F1" },
    { name: "목록", color: "#B5D8FF" },
    { name: "이동", color: "#FFCC99" }
  ];

  const [activeTab, setActiveTab] = useState("글쓰기");
  const [tabXmlMap, setTabXmlMap] = useState({});
  const [jsxOutput, setJsxOutput] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', handleResize);
    setTimeout(() => handleResize(), 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const parseXmlToJSX = (xml, tabName) => {
    switch (tabName) {
      case "화면":
        return parseLayoutXmlToJSX(xml); 
      case "버튼":
        return parseButtonXmlToJSX(xml);
      case "스타일":
        return parseButtonXmlToJSX(xml); // 필요 시 스타일용 따로 만들기
      case "글쓰기":
        return parseWritingXmlToJSX(xml);
      case "사진":
        return parseImageXmlToJSX(xml);
      default:
        return null;
    }
  };

  const getToolboxJson = (tab) => {
    switch (tab) {
      case "화면":
        return getLayoutTabToolbox();
      case "버튼":
        return getButtonTabToolbox();
      case "스타일":
        return getStyleTabToolbox();
      case "글쓰기":
        return getWritingTabToolbox();
      case "사진":
        return getImageTabToolbox();
      default:
        return { kind: "flyoutToolbox", contents: [] };
    }
  };

  const handleTabChange = (newTab) => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      setTabXmlMap(prev => ({ ...prev, [activeTab]: xml }));
    }
    setActiveTab(newTab);
  };

  const handleXmlChange = (newXml) => {
    setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
  };

  useEffect(() => {
    const jsxList = Object.entries(tabXmlMap).map(([tab, xml]) => parseXmlToJSX(xml, tab));
    setJsxOutput(jsxList);
  }, [tabXmlMap]);

  const initialXml = tabXmlMap[activeTab] || "";

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
          <div className="rendered-content">
            {jsxOutput.map((jsx, idx) => (
              <React.Fragment key={idx}>{jsx}</React.Fragment>
            ))}
          </div>
        </section>

        <section className="tool-editor-area">
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.name)}
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
                initialXml={initialXml}
                className="blockly-editor"
                workspaceConfiguration={{
                  toolboxPosition: 'top',
                  trashcan: true,
                  grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                  zoom: { controls: true, wheel: true },
                  renderer: "zelos",
                  horizontalLayout: true,
                  move: { scrollbars: true, drag: true, wheel: true }
                }}
                onXmlChange={handleXmlChange}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}