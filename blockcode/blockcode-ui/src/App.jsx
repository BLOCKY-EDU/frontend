/* App.jsx */
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { getListTabToolbox, registerListBlocks, parseListXmlToJSX } from './tabs/ListTab.jsx';
import { getNavigationTabToolbox, registerNavigationBlocks, parseNavigationXmlToJSX } from './tabs/NavigationTab.jsx';

registerStyleBlocks();
registerWritingBlocks();
registerImageBlocks();
registerLayoutBlocks();
registerButtonBlocks();
registerListBlocks();
registerNavigationBlocks();

export default function App() {
  const tabs = [
    { name: "화면", color: "#B5D8FF" },
    { name: "스타일", color: "#B5D8FF" },
    { name: "글쓰기", color: "#B5D8FF" },
    { name: "버튼", color: "#B5D8FF" },
    { name: "사진", color: "#B5D8FF" },
    { name: "목록", color: "#B5D8FF" },
    { name: "이동", color: "#B5D8FF" }
  ];

  const [activeTab, setActiveTab] = useState("글쓰기");
  const [tabXmlMap, setTabXmlMap] = useState({});
  const workspaceRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', handleResize);
    setTimeout(() => handleResize(), 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      setTabXmlMap(prev => ({ ...prev, [activeTab]: xml }));
    }
  }, [activeTab]);

  const parseXmlToJSX = (xml, tabName) => {
    switch (tabName) {
      case "화면": return parseLayoutXmlToJSX(xml);
      case "버튼": return parseButtonXmlToJSX(xml);
      case "스타일": return null; // 스타일은 자체적으로 렌더링하지 않음
      case "글쓰기": return parseWritingXmlToJSX(xml);
      case "사진": return parseImageXmlToJSX(xml);
      case "목록": return parseListXmlToJSX(xml);
      case "이동": return parseNavigationXmlToJSX(xml);
      default: return null;
    }
  };

  const getToolboxJson = (tab) => {
    switch (tab) {
      case "화면": return getLayoutTabToolbox();
      case "버튼": return getButtonTabToolbox();
      case "스타일": return getStyleTabToolbox();
      case "글쓰기": return getWritingTabToolbox();
      case "사진": return getImageTabToolbox();
      case "목록": return getListTabToolbox();
      case "이동": return getNavigationTabToolbox();
      default: return { kind: "flyoutToolbox", contents: [] };
    }
  };

  const jsxOutput = useMemo(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return [];

    const xmlDom = Blockly.Xml.workspaceToDom(workspace);
    const blockNodes = Array.from(xmlDom.childNodes).filter(node => node.nodeName === 'block');

    const jsxList = [];

    blockNodes.forEach((blockNode, index) => {
      const type = blockNode.getAttribute('type');
      const blockXml = new XMLSerializer().serializeToString(blockNode);

      let jsx = null;

      if (["text_title", "text_small_title", "small_content", "recipe_step", "checkbox_block", "toggle_input", "highlight_text"].includes(type)) {
        jsx = parseWritingXmlToJSX(blockXml);
      } else if (["normal_button", "submit_button", "text_input", "email_input", "select_box"].includes(type)) {
        jsx = parseButtonXmlToJSX(blockXml);
      } else if (["insert_image", "insert_video", "youtube_link"].includes(type)) {
        jsx = parseImageXmlToJSX(blockXml);
      } else if (["list_item"].includes(type)) {
        jsx = parseListXmlToJSX(blockXml);
      } else if (["navigation_button"].includes(type)) {
        jsx = parseNavigationXmlToJSX(blockXml);
      } else if (["container_box"].includes(type)) {
        jsx = parseLayoutXmlToJSX(blockXml);
      }

      if (jsx) {
        if (Array.isArray(jsx)) jsxList.push(...jsx);
        else jsxList.push(jsx);
      }
    });

    return jsxList.map((jsx, i) => (
      <React.Fragment key={i}>{jsx}</React.Fragment>
    ));
  }, [tabXmlMap]);

  const handleTabChange = (newTab) => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      setTabXmlMap(prev => ({ ...prev, [activeTab]: xml }));
    }
    setActiveTab(newTab);
  };

  const handleWorkspaceChange = () => {
    const workspace = Blockly.getMainWorkspace();
    workspaceRef.current = workspace;
    if (workspace) {
      const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      const dom = Blockly.Xml.workspaceToDom(workspace);
      const blocks = Array.from(dom.children);
      if (tabXmlMap[activeTab] !== newXml) {
        setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
      }
    }
  };

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
                key="shared-workspace"
                toolboxConfiguration={getToolboxJson(activeTab)}
                className="blockly-editor"
                workspaceConfiguration={{
                  toolboxPosition: 'top',
                  horizontalLayout: true, // 여기건들면 툴 내려오는거
                  trashcan: true,
                  grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                  zoom: { controls: true, wheel: true },
                  renderer: "zelos",
                  move: { scrollbars: true, drag: true, wheel: true }
                }}
                onWorkspaceChange={handleWorkspaceChange}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
