/* App.jsx */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';
import 'blockly/blocks';
import 'blockly/javascript';
import 'blockly/msg/ko';

import screenIcon from './assets/icons/screen.png';
import styleIcon from './assets/icons/style.png';
import textIcon from './assets/icons/text.png';
import buttonIcon from './assets/icons/button.png';
import imageIcon from './assets/icons/image.png';
import listIcon from './assets/icons/list.png';
import navIcon from './assets/icons/nav.png';
import trashcanSVG from './assets/trashcan.svg';
import robotIcon from './assets/robot-icon.png';   // ✅ 추가: 로봇 아이콘 import

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

/* ✅ 휴지통 아이콘 커스텀 */
const overrideTrashcanIcon = () => {
  const origCreateDom = Blockly.Trashcan.prototype.createDom;
  Blockly.Trashcan.prototype.createDom = function () {
    const group = origCreateDom.call(this);
    if (!this.svgGroup_) return group;

    while (this.svgGroup_.firstChild) {
      this.svgGroup_.removeChild(this.svgGroup_.firstChild);
    }

    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', trashcanSVG);
    img.setAttribute('width', 40);
    img.setAttribute('height', 40);
    img.setAttribute('x', 0);
    img.setAttribute('y', 0);

    this.svgGroup_.appendChild(img);
    return group;
  };
};

overrideTrashcanIcon();

export default function App() {
  const tabs = [
    { name: "화면", color: "#B5D8FF", activeColor: "#A0C4FF", icon: screenIcon },
    { name: "스타일", color: "#B5D8FF", activeColor: "#FFD700", icon: styleIcon },
    { name: "글쓰기", color: "#B5D8FF", activeColor: "#FFB3B3", icon: textIcon },
    { name: "버튼", color: "#B5D8FF", activeColor: "#90EE90", icon: buttonIcon },
    { name: "사진", color: "#B5D8FF", activeColor: "#FFA07A", icon: imageIcon },
    { name: "목록", color: "#B5D8FF", activeColor: "#FFB6C1", icon: listIcon },
    { name: "이동", color: "#B5D8FF", activeColor: "#87CEEB", icon: navIcon }
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

  const parseXmlToJSX = (block) => {
    const xml = Blockly.Xml.blockToDom(block);
    const xmlText = Blockly.Xml.domToText(xml);
    const type = block.type;

    if (type === "list_bulleted" || type === "list_numbered") {
      return parseListXmlToJSX(xmlText);
    }
    if (["text_title", "text_small_title", "small_content", "recipe_step", "checkbox_block", "toggle_input", "highlight_text"].includes(type)) {
      return parseWritingXmlToJSX(xmlText);
    } else if (["normal_button", "submit_button", "text_input", "email_input", "select_box"].includes(type)) {
      return parseButtonXmlToJSX(xmlText);
    } else if (["insert_image", "insert_video", "youtube_link"].includes(type)) {
      return parseImageXmlToJSX(xmlText);
    } else if (["list_item", "ordered_list_item"].includes(type)) {
      return parseListXmlToJSX(xmlText);
    } else if (["navigation_button"].includes(type)) {
      return parseNavigationXmlToJSX(xmlText);
    } else if (["container_box"].includes(type)) {
      return parseLayoutXmlToJSX(xmlText);
    }
    return null;
  };

  const jsxOutput = useMemo(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return [];
    const topBlocks = workspace.getTopBlocks(true);
    topBlocks.sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);

    const jsxList = [];
    const visited = new Set();

    topBlocks.forEach((block) => {
      if ((block.type === "list_item" || block.type === "ordered_list_item") && !visited.has(block.id)) {
        const group = [];
        let current = block;
        while (current && !visited.has(current.id) && (current.type === block.type)) {
          const parsed = parseListXmlToJSX(
            Blockly.Xml.domToText(Blockly.Xml.blockToDom(current))
          );
          if (parsed) group.push(parsed.content);
          visited.add(current.id);
          current = current.getNextBlock();
        }
        if (group.length > 0) {
          const Tag = block.type === "ordered_list_item" ? "ol" : "ul";
          jsxList.push(<Tag key={block.id}>{group.map((content, i) => <li key={i}>{content}</li>)}</Tag>);
        }
      } else if (!visited.has(block.id)) {
        const jsx = parseXmlToJSX(block);
        if (jsx && typeof jsx === 'object' && jsx.type && jsx.content) {
        } else if (jsx) {
          jsxList.push(...(Array.isArray(jsx) ? jsx : [jsx]));
        }
      }
    });
    return jsxList.map((jsx, i) => <React.Fragment key={i}>{jsx}</React.Fragment>);
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
      if (tabXmlMap[activeTab] !== newXml) {
        setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
      }
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
            {jsxOutput}
          </div>
        </section>
        <section className="tool-editor-area">
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`tab-btn ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.name)}
                style={{ backgroundColor: activeTab === tab.name ? tab.activeColor : tab.color }}
              >
                <img src={tab.icon} alt={tab.name} style={{ width: 18, height: 18, marginRight: 6 }} />
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
                  horizontalLayout: true,
                  trashcan: true,
                  grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                  zoom: { controls: true, wheel: true },
                  renderer: "zelos",
                  move: { scrollbars: true, drag: true, wheel: true }
                }}
                onWorkspaceChange={handleWorkspaceChange}
              />
            </div>
            {/* ✅ 로봇 아이콘 추가 */}
            <div className="robot-container">
              <img src={robotIcon} alt="AI 도우미" className="robot-icon" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
