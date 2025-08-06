import * as Blockly from 'blockly';
import 'blockly/blocks';

import { FieldColour } from '@blockly/field-colour';
Blockly.fieldRegistry.register('field_colour', FieldColour);


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import './App.css';
import blockyLogo from './assets/blocky-logo.png';
import 'blockly/javascript';
import 'blockly/msg/ko';

import { registerLayoutBlocks } from './tabs/LayoutTab';
registerLayoutBlocks();

import NavBar from './components/NavBar'; // navbar


function AlertModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', padding: 24, borderRadius: 8, minWidth: 280,
          boxShadow: '0 4px 32px rgba(0,0,0,0.2)', textAlign: 'center'
        }}
        onClick={e => e.stopPropagation()} // 팝업 안 클릭은 전파 막기
      >
        <div style={{ marginBottom: 20, fontSize: 18, color: '#333' }}>{message}</div>
        <button onClick={onClose} style={{ padding: '6px 20px' }}>확인</button>
      </div>
    </div>
  );
}


import { getWritingTabToolbox, registerWritingBlocks, parseWritingXmlToJSX } from './tabs/WritingTab';
import { getImageTabToolbox, registerImageBlocks, parseImageXmlToJSX } from './tabs/ImageTab';
import { getLayoutTabToolbox, parseLayoutXmlToJSX } from './tabs/LayoutTab.jsx';
import { registerButtonBlocks, getButtonTabToolbox, parseButtonXmlToJSX } from './tabs/ButtonTab.jsx';
import { registerStyleBlocks, getStyleTabToolbox } from './tabs/StyleTab.jsx';
import { getListTabToolbox, registerListBlocks, parseListXmlToJSX } from './tabs/ListTab.jsx';
import {registerNavigationBlocks, getNavigationTabToolbox, parseNavigationXmlToJSX} from './tabs/NavigationTab';

registerStyleBlocks();
registerWritingBlocks();
registerImageBlocks();
// registerLayoutBlocks();
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
  
  
  const [globalBackgroundColor, setGlobalBackgroundColor] = useState("#ffffff");

  const [activeTab, setActiveTab] = useState("글쓰기");
  const [tabXmlMap, setTabXmlMap] = useState({});
  const workspaceRef = useRef(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertShown, setAlertShown] = useState(false); 

  useEffect(() => {
    const handleResize = () => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) Blockly.svgResize(workspace);
    };
    window.addEventListener('resize', handleResize);
    setTimeout(() => handleResize(), 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   const workspace = Blockly.getMainWorkspace();
  //   if (workspace) {
  //     const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
  //     setTabXmlMap(prev => ({ ...prev, [activeTab]: xml }));
  //   }
  // }, [activeTab]);


  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const topBlocks = workspace.getTopBlocks(true);
      const hasBox = topBlocks.some(block => block.type === 'container_box');
      if (hasBox) {
        setAlertOpen(false);
        setAlertShown(false); // 다시 상자 빼면 안내 다시 가능!
      }
    }
  }, [tabXmlMap]);
  
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
  
    // 배경색 블록 처리
    const bgBlock = topBlocks.find(b => b.type === "background_color_block");
    if (bgBlock) {
      const colorField = bgBlock.getFieldValue("COLOR");
      if (colorField && globalBackgroundColor !== colorField) {
        setGlobalBackgroundColor(colorField);
      }
    }


    // 상자 블록만 필터
    const boxBlocks = topBlocks.filter(block => block.type === "container_box");
  
    // 1. 상자가 없으면 모달 열기
    if (boxBlocks.length === 0) {
      if (!alertOpen) setAlertOpen(true);   // 모달 켜기
      if (alertMsg !== "상자 안에 블록을 넣어주세요.") setAlertMsg("상자 안에 블록을 넣어주세요.");
      return [];
    }
  
    // 2. 상자가 있으면 모달 끄기
    if (alertOpen) setAlertOpen(false);
  
    // 3. 상자 안이 비었으면 모달 열기
    // let showEmptyBoxAlert = false;
    // boxBlocks.forEach(box => {
    //   const contentBlock = box.getInputTargetBlock("CONTENT");
    //   if (!contentBlock) showEmptyBoxAlert = true;
    // });
    // if (showEmptyBoxAlert) {
    //   if (!alertOpen) setAlertOpen(true);
    //   if (alertMsg !== "상자 안에 블록을 넣어주세요.") setAlertMsg("상자 안에 블록을 넣어주세요.");
    //   return [];
    // }
  
    // 4. 상자와 콘텐츠가 있으면 정상 렌더
    topBlocks.sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);

    const jsxList = [];
    const visited = new Set();

    topBlocks.forEach((block) => {
      if (
        (block.type === "list_item" || block.type === "ordered_list_item") &&
        !visited.has(block.id)
      ) {
        // 같은 타입끼리 묶어서 ul/ol로 렌더
        const group = [];
        let current = block;
        while (
          current &&
          !visited.has(current.id) &&
          (current.type === block.type)
        ) {
          const parsed = parseListXmlToJSX(
            Blockly.Xml.domToText(Blockly.Xml.blockToDom(current))
          );
          if (parsed) group.push(parsed.content);
          visited.add(current.id);
          current = current.getNextBlock();
        }

        if (group.length > 0) {
          const Tag = block.type === "ordered_list_item" ? "ol" : "ul";
          jsxList.push(
            <Tag key={block.id}>
              {group.map((content, i) => <li key={i}>{content}</li>)}
            </Tag>
          );
        }
      } else if (!visited.has(block.id)) {
        const jsx = parseXmlToJSX(block);
        if (jsx && typeof jsx === 'object' && jsx.type && jsx.content) {
          // 이미 위에서 처리됨
        } else if (jsx) {
          jsxList.push(...(Array.isArray(jsx) ? jsx : [jsx]));
        }
      }
    });

    return jsxList.map((jsx, i) => <React.Fragment key={i}>{jsx}</React.Fragment>);
    // eslint-disable-next-line
  }, [tabXmlMap]);



  const handleTabChange = (newTab) => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      setTabXmlMap(prev => ({ ...prev, [activeTab]: xml }));
    }
    setActiveTab(newTab);
  };


  const writingBlockTypes = [
    "text_title", "text_small_title", "small_content",
    "recipe_step", "checkbox_block", "toggle_input", "highlight_text",
    "normal_button", "submit_button", "text_input", "email_input", "select_box","navigation_button"
  ];
  // const handleWorkspaceChange = () => {
  //   const workspace = Blockly.getMainWorkspace();
  //   workspaceRef.current = workspace;
  //   if (workspace) {
  //     const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
  //     if (tabXmlMap[activeTab] !== newXml) {
  //       setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
  //     }
  //   }
  // };



//   const handleWorkspaceChange = () => {
//   const workspace = Blockly.getMainWorkspace();
//   workspaceRef.current = workspace;
//   if (workspace) {
//     const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
//     if (tabXmlMap[activeTab] !== newXml) {
//       setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
//     }

//     // ---- 팝업 로직 추가 ----
//     const topBlocks = workspace.getTopBlocks(true);
//     const hasBox = topBlocks.some(block => block.type === 'container_box');
//     // const writingBlockTypes = [
//     //   "text_title", "text_small_title", "small_content",
//     //   "recipe_step", "checkbox_block", "toggle_input", "highlight_text"
//     // ];

//     const writingBlockTypes = [
//       "text_title", "text_small_title", "small_content",
//       "recipe_step", "checkbox_block", "toggle_input", "highlight_text",
//       "normal_button", "submit_button", "text_input", "email_input", "select_box"
//     ];
    
//     const hasWriting = topBlocks.some(block => writingBlockTypes.includes(block.type));

//     // 상자가 없는데 글쓰기 블록이 존재하면 팝업!
//     if (!hasBox && hasWriting) {
//       setAlertOpen(true);

//       // 팝업 뜬 직후 블록도 제거
//       // (이건 UX에 따라 선택. 아래 한 줄을 주석 해제하면 팝업 후 블록을 자동 제거)
//       writingBlockTypes.forEach(type => topBlocks.filter(b => b.type === type).forEach(b => b.dispose()));
//     }
//   }
// };


const handleWorkspaceChange = () => {
  const workspace = Blockly.getMainWorkspace();
  workspaceRef.current = workspace;
  if (workspace) {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    console.log("실시간 워크스페이스 XML", newXml);

    if (tabXmlMap[activeTab] !== newXml) {
      setTabXmlMap(prev => ({ ...prev, [activeTab]: newXml }));
    }

    const topBlocks = workspace.getTopBlocks(true);
    const hasBox = topBlocks.some(block => block.type === 'container_box');
    // 드래그된 글쓰기/버튼 블록이 상자 밖에 있는지 체크
    if (!hasBox && !alertShown) {
      let found = false;
      topBlocks.forEach(block => {
        if (writingBlockTypes.includes(block.type)) {
          block.dispose(); // workspace에서 제거
          found = true;
        }
      });
      if (found) {
        setAlertMsg("상자 안에 블록을 넣어주세요.");
        setAlertOpen(true);
        setAlertShown(true); // 한번만!
      }
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
    <>  <AlertModal open={alertOpen} message={alertMsg} onClose={() => setAlertOpen(false)} />

    <div className="app-container">
      {/* <header className="header">
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
      </header> */}
      <NavBar />
      <main className="main-box">
        <section className="render-box">
          <div className="title-bar">나의 화면</div>
          <div className="rendered-content"  style={{ backgroundColor: globalBackgroundColor }}>
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
          </div>
        </section>
      </main>
    </div>

    </>
  );
}

  


