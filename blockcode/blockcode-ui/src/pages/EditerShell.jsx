// src/pages/EditerShell.jsx
import * as Blockly from "blockly";
import "blockly/blocks";
import { Outlet } from "react-router-dom";

import { FieldColour } from "@blockly/field-colour";
Blockly.fieldRegistry.register("field_colour", FieldColour);

import React, { useState, useEffect, useRef, useMemo } from "react";
import { BlocklyWorkspace } from "react-blockly";
import { createPortal } from "react-dom";
import "../PlayPage/app.css";
import "./blockly-font.css";
import blockyLogo from "../assets/blocky-logo.png";
import "blockly/javascript";
import "blockly/msg/ko";

import { useParams, useNavigate } from "react-router-dom";
//import { PROBLEM_BY_ID } from "../data/problems.js";
import { PROBLEM_BY_ID, nextIdInSameLevel } from "../data/problems/index.js";
import { htmlFromLocal, gradeHtml } from "../utils/grader.js";

// === HTML 저장 도우미 ===
const CURRENT_HTML_KEY = 'blocky_workspace_html_current';
function saveCurrentHtmlFromRef(ref) {
  try {
    const el = ref?.current;
    if (!el) return;
    const html = el.innerHTML || '';
    localStorage.setItem(CURRENT_HTML_KEY, html);
  } catch (e) { }
}

import screenIcon from '../assets/icons/screen.png';
import styleIcon from '../assets/icons/style.png';
import textIcon from '../assets/icons/text.png';
import buttonIcon from '../assets/icons/button.png';
import imageIcon from '../assets/icons/image.png';
import listIcon from '../assets/icons/list.png';
import navIcon from '../assets/icons/nav.png';
import robotIcon from '../assets/robot-icon.png';
import { html as beautifyHtml } from 'js-beautify';

import { registerLayoutBlocks } from "../tabs/LayoutTab.jsx";
registerLayoutBlocks();

// 사람 친화 메시지 변환기
function modeK(mode) {
  if (mode === 'equals') return '정확히 같아야 해요';
  if (mode === 'includes') return '포함되어야 해요';
  if (mode === 'regex') return '정규식과 일치해야 해요';
  return '조건을 만족해야 해요';
}

// target 문자열만 있는 (메타 없는) 경우를 대비한 보조 파서
function extractQuoted(str = '') {
  const m = String(str).match(/"([^"]+)"/);
  return m ? m[1] : str;
}
function extractPropFromTarget(str = '') {
  const m = String(str).match(/"([^"]+)"/);
  return m ? m[1] : str;
}

function humanizeCheck(c) {
  const m = c.meta || {};
  switch (c.type) {
    case '필수 요소':
      return `${m.selector || c.target} 요소가 없어요. 해당 블록을 추가해보세요.`;

    case '금지 요소':
      return `${m.selector || c.target} 요소는 사용하면 안 돼요. 해당 블록을 제거해보세요.`;

    case '텍스트(전체)':
      return `화면 전체 텍스트에 "${m.text || extractQuoted(c.target)}"가 포함되어야 해요.`;

    case '스타일(전체)':
      return `어떤 요소든 인라인 style에 "${m.prop || extractPropFromTarget(c.target)}" 속성이 있어야 해요.`;

    case '텍스트(요소별)':
      return `${m.selector || '?'}의 텍스트가 "${m.text ?? extractQuoted(c.target)}"와 ${modeK(m.mode)}.`;

    case '금지 텍스트(요소별)':
      return `${m.selector || '?'} 안에 "${m.text ?? extractQuoted(c.target)}"가 들어가면 안 돼요.`;

    case '스타일(요소별)':
      return `${m.selector || '?'}의 인라인 스타일 "${m.prop}" 값이 "${m.value}"와 ${modeK(m.mode)}.`;

    case '속성':
      return `${m.selector || '?'}의 [${m.attr}] 속성이 "${m.value}"와 ${modeK(m.mode)}.`;

    default:
      // 안전한 폴백
      return `[${c.type}] ${c.target}`;
  }
}

function GradeFloat({ onGrade }) {
  const [injectionEl, setInjectionEl] = React.useState(null);

  React.useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (ws) setInjectionEl(ws.getInjectionDiv());
  }, []);

  if (!injectionEl) return null;

  return createPortal(
    <button
      onClick={onGrade}
      title="채점하기"
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        boxShadow: "0 8px 22px rgba(0,0,0,.2)",
        fontWeight: 800,
        cursor: "pointer",
        zIndex: 2000, // injection 내부에서도 가장 위
      }}
    >
      채점
    </button>,
    injectionEl
  );
}

function AlertModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 280,
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 20, fontSize: 18, color: "#333" }}>
          {message}
        </div>
        <button onClick={onClose} style={{ padding: "6px 20px" }}>
          확인
        </button>
      </div>
    </div>
  );
}

import {
  getWritingTabToolbox,
  registerWritingBlocks,
  parseWritingXmlToJSX,
} from "../tabs/WritingTab.jsx";
import {
  getImageTabToolbox,
  registerImageBlocks,
  parseImageXmlToJSX,
} from "../tabs/ImageTab.jsx";
import {
  getLayoutTabToolbox,
  parseLayoutXmlToJSX,
} from "../tabs/LayoutTab.jsx";
import {
  registerButtonBlocks,
  getButtonTabToolbox,
  parseButtonXmlToJSX,
} from "../tabs/ButtonTab.jsx";
import {
  registerStyleBlocks,
  getStyleTabToolbox,
} from "../tabs/StyleTab.jsx";
import {
  getListTabToolbox,
  registerListBlocks,
  parseListXmlToJSX,
} from "../tabs/ListTab.jsx";
import {
  registerNavigationBlocks,
  getNavigationTabToolbox,
  parseNavigationXmlToJSX,
} from "../tabs/NavigationTab.jsx";

// --- 등록 순서 중요할 수 있으므로 모아서 실행
registerStyleBlocks();
registerWritingBlocks();
registerImageBlocks();
registerButtonBlocks();
registerListBlocks();
registerNavigationBlocks();

// 드래그 플로팅 버튼 + 코드 팝업(실시간)
function CodeFloat({ renderRef, globalBackgroundColor }) {
  const [injectionEl, setInjectionEl] = useState(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeText, setCodeText] = useState("");
  const posRef = useRef({ x: null, y: null });
  const [, force] = useState(0);

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const BTN_SIZE = 36;
  const MARGIN = 8;

  const POPUP_MIN_W = 500;
  const POPUP_MIN_H = 240;
  const POPUP_MAX_W = 900;
  const POPUP_MAX_H = 600;
  const CLICK_TOLERANCE = 5;

  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (ws) setInjectionEl(ws.getInjectionDiv());
  }, []);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const getToolboxHeight = () => {
    if (!injectionEl) return 0;
    const tb = injectionEl.querySelector(".blocklyToolboxDiv");
    return tb ? tb.getBoundingClientRect().height : 0;
  };

  const ensureInitialPos = () => {
    if (!injectionEl) return { x: MARGIN, y: MARGIN };
    const rect = injectionEl.getBoundingClientRect();
    const toolboxH = getToolboxHeight();
    const scrollLeft = injectionEl.scrollLeft || 0;
    const scrollTop = injectionEl.scrollTop || 0;
    const x = rect.width - BTN_SIZE - MARGIN + scrollLeft;
    const y = toolboxH + MARGIN + scrollTop;
    if (posRef.current.x == null || posRef.current.y == null) {
      posRef.current = { x, y };
      force((v) => v + 1);
    }
    return posRef.current;
  };

  // 팝업 토글
  const togglePopup = () => setCodeOpen(open => !open);

  // 코드 팝업 열릴 때 실시간 innerHTML 반영
  useEffect(() => {
    if (!codeOpen) return;
    const updateCode = () => {
      const html = renderRef?.current?.innerHTML?.trim() || "";
      const hasBlocks = ws?.getAllBlocks(false).length > 0;
      // 여기서 예쁘게!
      let wrappedHtml = "";
      if (hasBlocks) {
        wrappedHtml = `<body style="background-color: ${globalBackgroundColor};">\n${html}\n</body>`;
      } else {
        wrappedHtml = "<!-- 렌더된 내용이 없습니다. -->";
      }
      const pretty = beautifyHtml(wrappedHtml, { indent_size: 2 });
      setCodeText(pretty);
    };
    const ws = Blockly.getMainWorkspace();
    ws && ws.addChangeListener(updateCode);
    updateCode();
    return () => { ws && ws.removeChangeListener(updateCode); };
  }, [codeOpen, renderRef, globalBackgroundColor]);

  const handleDown = (e) => {
    if (!injectionEl) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp, { passive: false, once: true });
  };

  const handleMove = (e) => {
    if (!draggingRef.current || !injectionEl) return;
    e.preventDefault();

    const rect = injectionEl.getBoundingClientRect();
    const toolboxH = getToolboxHeight();
    const scrollLeft = injectionEl.scrollLeft || 0;
    const scrollTop = injectionEl.scrollTop || 0;

    // 버튼 중심이 커서에 맞게
    let nx = e.clientX - rect.left + scrollLeft - BTN_SIZE / 2;
    let ny = e.clientY - rect.top + scrollTop - BTN_SIZE / 2;

    nx = clamp(nx, MARGIN + scrollLeft, rect.width - BTN_SIZE - MARGIN + scrollLeft);
    ny = clamp(ny, toolboxH + MARGIN + scrollTop, rect.height - BTN_SIZE - MARGIN + scrollTop);

    posRef.current = { x: nx, y: ny };
    force((v) => v + 1);
  };

  const handleUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    window.removeEventListener("pointermove", handleMove);

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= CLICK_TOLERANCE) togglePopup();

    // 버튼 위치 보정
    setTimeout(() => {
      if (!injectionEl) return;
      const rect = injectionEl.getBoundingClientRect();
      const toolboxH = getToolboxHeight();
      const scrollLeft = injectionEl.scrollLeft || 0;
      const scrollTop = injectionEl.scrollTop || 0;
      let { x, y } = posRef.current;
      x = clamp(x, MARGIN + scrollLeft, rect.width - BTN_SIZE - MARGIN + scrollLeft);
      y = clamp(y, toolboxH + MARGIN + scrollTop, rect.height - BTN_SIZE - MARGIN + scrollTop);
      posRef.current = { x, y };
      force(v => v + 1);
    }, 0);
  };

  // 리사이즈/스크롤 보정
  useEffect(() => {
    const onResizeOrScroll = () => {
      if (!injectionEl) return;
      const rect = injectionEl.getBoundingClientRect();
      const toolboxH = getToolboxHeight();
      const scrollLeft = injectionEl.scrollLeft || 0;
      const scrollTop = injectionEl.scrollTop || 0;
      const p = posRef.current;
      if (p.x == null || p.y == null) return;
      p.x = clamp(p.x, MARGIN + scrollLeft, rect.width - BTN_SIZE - MARGIN + scrollLeft);
      p.y = clamp(p.y, toolboxH + MARGIN + scrollTop, rect.height - BTN_SIZE - MARGIN + scrollTop);
      force((v) => v + 1);
    };
    window.addEventListener("resize", onResizeOrScroll);
    if (injectionEl) {
      injectionEl.addEventListener("scroll", onResizeOrScroll);
    }
    return () => {
      window.removeEventListener("resize", onResizeOrScroll);
      if (injectionEl) {
        injectionEl.removeEventListener("scroll", onResizeOrScroll);
      }
    };
  }, [injectionEl]);

  if (!injectionEl) return null;

  const p = ensureInitialPos();

  const getPopupPos = () => {
    const rect = injectionEl.getBoundingClientRect();
    const scrollLeft = injectionEl.scrollLeft || 0;
    const scrollTop = injectionEl.scrollTop || 0;
    let left = p.x;
    let top = p.y + BTN_SIZE + 8;
    let popupW = POPUP_MIN_W;
    let popupH = POPUP_MIN_H;
    // 최대값으로 clamp
    if (left + popupW > rect.width + scrollLeft - MARGIN) {
      left = rect.width + scrollLeft - popupW - MARGIN;
      if (left < MARGIN + scrollLeft) left = MARGIN + scrollLeft;
    }
    if (top + popupH > rect.height + scrollTop - MARGIN) {
      top = p.y - popupH - 8; // 위로 띄우기
      if (top < MARGIN + scrollTop) top = rect.height + scrollTop - popupH - MARGIN;
      if (top < MARGIN + scrollTop) top = MARGIN + scrollTop;
    }
    return { left, top };
  };

  const popupPos = getPopupPos();

  return createPortal(
    <>
      <button
        className={`floating-code-btn ${draggingRef.current ? "dragging" : ""}`}
        data-tip="코드 보기"
        title="코드 보기"
        onPointerDown={handleDown}
        style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          width: BTN_SIZE,
          height: BTN_SIZE,
          borderRadius: "50%",
          background: "#111",
          color: "#fff",
          border: "none",
          cursor: draggingRef.current ? "grabbing" : "grab",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {"</>"}
      </button>

      {codeOpen && (
        <div
          className="code-popup"
          style={{
            position: "absolute",
            left: popupPos.left,
            top: popupPos.top,
            zIndex: 1000,
            minWidth: POPUP_MIN_W,
            minHeight: POPUP_MIN_H,
            maxWidth: POPUP_MAX_W,
            maxHeight: POPUP_MAX_H,
            overflow: "auto",
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
          }}
        >
          <div className="code-popup-header">
            <span>HTML 코드</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigator.clipboard.writeText(codeText)}>
                복사
              </button>
            </div>
          </div>
          <pre className="code-popup-body">{codeText}</pre>
        </div>
      )}
    </>,
    injectionEl
  );
}

// 포탈 플로팅 버튼
function ExportXmlFloat() {
  const [inj, setInj] = React.useState(null);

  React.useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (ws) setInj(ws.getInjectionDiv());
  }, []);

  const onClick = (e) => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return alert('워크스페이스가 아직 없어요!');

    // ID 제거한 DOM 생성
    const dom = Blockly.Xml.workspaceToDom(ws, true);
    let xmlText = Blockly.Xml.domToPrettyText(dom);

    // 템플릿 리터럴 안전하게 (백틱 이스케이프)
    xmlText = xmlText.replace(/`/g, '\\`').replace(/\r\n/g, '\n');

    // Shift 누르고 클릭하면 answerXml으로 감싼 스니펫 복사
    const wrapForProblem = e.shiftKey;
    const payload = wrapForProblem
      ? `answerXml: \`\n${xmlText}\n\`,`
      : xmlText;

    navigator.clipboard?.writeText(payload);
    console.log('[Blockly XML] copied ➜\n', payload);
    alert(
      wrapForProblem
        ? '문제용 answerXml 포맷으로 복사했어요! (Shift+클릭)'
        : 'ID 제거된 XML을 클립보드에 복사했어요!'
    );
  };

  if (!inj) return null;

  return createPortal(
    <button
      onClick={onClick}
      title="XML 복사 (Shift+클릭: answerXml로 감싸서 복사)"
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        border: 'none',
        borderRadius: 8,
        padding: '8px 12px',
        fontWeight: 700,
        background: '#111',
        color: '#fff',
        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        zIndex: 2000,
      }}
    >
      XML 복사
    </button>,
    inj
  );
}


export default function EditorShell() {
  const exportXml = () => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return alert('워크스페이스가 아직 없어요!');
    const xmlText = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(ws));
    console.log('[Blockly XML]\n', xmlText);
    navigator.clipboard?.writeText(xmlText);
    alert('XML을 클립보드에 복사했어요!');
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEM_BY_ID?.[String(id)];

  // 채점 모달 상태
  const [gradeOpen, setGradeOpen] = React.useState(false);
  const [gradeResult, setGradeResult] = React.useState(null);

  const resetWorkspaceAndState = React.useCallback(() => {
    try {
      const ws = Blockly.getMainWorkspace();
      ws?.clear();                          // 블록 전부 삭제
    } catch { }
    setTabXmlMap({});                       // 탭별 저장 XML 초기화
    localStorage.setItem(CURRENT_HTML_KEY, ''); // 렌더 HTML 캐시 초기화
  }, []);

  const handleGlobalGrade = () => {
    if (!problem) return;
    const html = htmlFromLocal();
    const res = gradeHtml(html, problem.rules || {});
    setGradeResult(res);

    // 항상 모달로 이동
    setGradeOpen(true);
  };

  // 단계별 범위 (3문제씩)
  const STAGE_RANGES = {
    basic: [1, 3],
    intermediate: [4, 6],
    advanced: [7, 9],
  };

  // 현재 id 기준, 같은 단계 안에서만 다음 문제 id 반환 (없으면 null)
  // const nextIdInStage = React.useMemo(() => {
  //   const cur = Number(id);
  //   if (!Number.isFinite(cur)) return null;

  //   // 현재 단계 찾기
  //   let stage = null;
  //   for (const [name, [start, end]] of Object.entries(STAGE_RANGES)) {
  //     if (cur >= start && cur <= end) {
  //       stage = { name, start, end };
  //       break;
  //     }
  //   }
  //   if (!stage) return null;

  //   const candidate = cur + 1;
  //   if (candidate <= stage.end && PROBLEM_BY_ID[String(candidate)]) {
  //     return String(candidate);
  //   }
  //   return null;
  // }, [id]);

  const nextId = React.useMemo(() => nextIdInSameLevel(id), [id]);

  const tabs = [
    { name: "화면", color: "#B5D8FF", activeColor: "#A3D5FF", icon: screenIcon },
    { name: "스타일", color: "#B5D8FF", activeColor: "#D8B4F8", icon: styleIcon },
    { name: "글쓰기", color: "#B5D8FF", activeColor: "#FFA5A5", icon: textIcon },
    { name: "버튼", color: "#B5D8FF", activeColor: "#FFCDD6", icon: buttonIcon },
    { name: "사진", color: "#B5D8FF", activeColor: "#B0EACD", icon: imageIcon },
    { name: "목록", color: "#B5D8FF", activeColor: "#D8B4F8", icon: listIcon },
    { name: "이동", color: "#B5D8FF", activeColor: "#FFC8AB", icon: navIcon }
  ];

  const [globalBackgroundColor, setGlobalBackgroundColor] = useState("#ffffff");
  const [activeTab, setActiveTab] = useState("글쓰기");
  const [tabXmlMap, setTabXmlMap] = useState({});
  const workspaceRef = useRef(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertShown, setAlertShown] = useState(false);

  const renderRef = useRef(null);

  // 미션 바뀔 때 starterXml 로드
  React.useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    const starter = PROBLEM_BY_ID?.[id]?.starterXml;
    if (ws && starter) {
      try {
        ws.clear();
        Blockly.Xml.domToWorkspace(
          Blockly.utils.xml.textToDom(starter),
          ws
        );
      } catch (e) {
        console.error('[starterXml] load failed', e);
      }
    }
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) Blockly.svgResize(workspace);
    };
    window.addEventListener("resize", handleResize);
    setTimeout(() => handleResize(), 100);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const topBlocks = workspace.getTopBlocks(true);
      const hasBox = topBlocks.some((block) => block.type === "container_box");
      if (hasBox) {
        setAlertOpen(false);
        setAlertShown(false);
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
    if (
      [
        "text_title",
        "text_small_title",
        "small_content",
        "recipe_step",
        "toggle_input",
        "highlight_text",
        "paragraph",
      ].includes(type)
    ) {
      return parseWritingXmlToJSX(xmlText);
    } else if (
      [
        "normal_button",
        "submit_button",
        "text_input",
        "email_input",
        "checkbox_block",
        "select_box",
      ].includes(type)
    ) {
      return parseButtonXmlToJSX(xmlText);
    } else if (
      ["insert_image", "insert_video", "youtube_link"].includes(type)
    ) {
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

    // 배경 블록 감지
    const BG_TYPES = ["style_background", "background_color_block"];
    const bgBlock = topBlocks.find(
      (b) => BG_TYPES.includes(b.type) && !b.getParent()
    );

    if (bgBlock) {
      const colorField =
        bgBlock.getFieldValue?.("COLOR") ||
        bgBlock.getFieldValue?.("BG_COLOR");
      if (colorField && globalBackgroundColor !== colorField) {
        setGlobalBackgroundColor(colorField);
      }
    } else {
      if (globalBackgroundColor !== "#ffffff") {
        setGlobalBackgroundColor("#ffffff");
      }
    }

    // const boxBlocks = topBlocks.filter(
    //   (block) => block.type === "container_box"
    // );
    // if (boxBlocks.length === 0) {
    //   if (!alertOpen) setAlertOpen(true);
    //   if (alertMsg !== "상자 안에 블록을 넣어주세요.")
    //     setAlertMsg("상자 안에 블록을 넣어주세요.");
    //   return [];
    // }
    // if (alertOpen) setAlertOpen(false);

    topBlocks.sort(
      (a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y
    );

    const jsxList = [];
    const visited = new Set();

    topBlocks.forEach((block) => {
      if (
        (block.type === "list_item" || block.type === "ordered_list_item") &&
        !visited.has(block.id)
      ) {
        const group = [];
        let current = block;
        while (
          current &&
          !visited.has(current.id) &&
          current.type === block.type
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
              {group.map((content, i) => (
                <li key={i}>{content}</li>
              ))}
            </Tag>
          );
        }
      } else if (!visited.has(block.id)) {
        const jsx = parseXmlToJSX(block);
        if (jsx && typeof jsx === "object" && jsx.type && jsx.content) {
          // 이미 위에서 처리됨
        } else if (jsx) {
          jsxList.push(...(Array.isArray(jsx) ? jsx : [jsx]));
        }
      }
    });

    return jsxList.map((jsx, i) => <React.Fragment key={i}>{jsx}</React.Fragment>);
    // eslint-disable-next-line
  }, [tabXmlMap]);

  // ✅ HTML 자동 저장: jsxOutput/배경 변경 시 저장 (jsxOutput 선언 이후에 위치)
  useEffect(() => {
    saveCurrentHtmlFromRef(renderRef);
  }, [jsxOutput, globalBackgroundColor]);

  const handleTabChange = (newTab) => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      setTabXmlMap((prev) => ({ ...prev, [activeTab]: xml }));
    }
    setActiveTab(newTab);
  };

  const writingBlockTypes = [
    "text_title",
    "text_small_title",
    "small_content",
    "recipe_step",
    "checkbox_block",
    "toggle_input",
    "highlight_text",
    "normal_button",
    "submit_button",
    "text_input",
    "email_input",
    "select_box",
    "navigation_button",
  ];

  const handleWorkspaceChange = () => {
    const workspace = Blockly.getMainWorkspace();
    workspaceRef.current = workspace;
    if (workspace) {
      const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      if (tabXmlMap[activeTab] !== newXml) {
        setTabXmlMap((prev) => ({ ...prev, [activeTab]: newXml }));
      }

      const topBlocks = workspace.getTopBlocks(true);
      // const hasBox = topBlocks.some((block) => block.type === "container_box");
      // if (!hasBox && !alertShown) {
      //   let found = false;
      //   topBlocks.forEach((block) => {
      //     if (writingBlockTypes.includes(block.type)) {
      //       block.dispose();
      //       found = true;
      //     }
      //   });
      //   if (found) {
      //     setAlertMsg("상자 안에 블록을 넣어주세요.");
      //     setAlertOpen(true);
      //     setAlertShown(true);
      //   }
      // }
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
      case "목록":
        return getListTabToolbox();
      case "이동":
        return getNavigationTabToolbox();
      default:
        return { kind: "flyoutToolbox", contents: [] };
    }
  };

  return (
    <>
      <AlertModal
        open={alertOpen}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />

      <div id="editor-container" className="app-container">
        <main className="app-main-box">
          <div className="parent-container">
            <section className="app-render-box-editer">
              <div className="app-title-bar">나의 화면</div>
              <div
                className="app-render-content"
                ref={renderRef}
                style={{
                  backgroundColor: globalBackgroundColor,
                  minHeight: '100%',
                  borderBottomLeftRadius: '8px',   // 왼쪽 아래
                  borderBottomRightRadius: '8px',  // 오른쪽 아래
                  overflow: 'auto', // 스크롤바 자동 생성
                  maxHeight: '100%', // 부모 영역 안에서만 보이게
                  boxSizing: 'border-box', // padding 포함해서 크기 계산
                }}>
                {jsxOutput}
              </div>
            </section>

            <section className="app-my-mission-box">
              <div className="app-title-bar">나의 미션</div>
              <div className="app-render-mission-content">
                <Outlet />
              </div>
            </section>
          </div>

          <section className="app-tool-editor-area">
            <div className="app-tab-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`app-tab-btn ${activeTab === tab.name ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.name)}
                  style={{
                    backgroundColor: activeTab === tab.name ? tab.activeColor : tab.color,
                  }}
                >
                  <img src={tab.icon} alt={tab.name} style={{ width: 18, height: 18, marginRight: 2 }} />
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="app-blockly-box">
              <div className="app-blockly-wrapper">
                <BlocklyWorkspace
                  key="shared-workspace"
                  toolboxConfiguration={getToolboxJson(activeTab)}
                  className="app-blockly-editor"
                  workspaceConfiguration={{
                    toolboxPosition: "top",
                    horizontalLayout: true,
                    trashcan: true,
                    grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
                    zoom: { controls: true, wheel: true },
                    renderer: "zelos",
                    move: { scrollbars: true, drag: true, wheel: true },
                  }}
                  onWorkspaceChange={handleWorkspaceChange}
                />
                {/* 플로팅 코드 버튼 */}
                <CodeFloat renderRef={renderRef} globalBackgroundColor={globalBackgroundColor} />

                {/* 전역 채점 플로팅 버튼 */}
                <GradeFloat onGrade={handleGlobalGrade} />

                <ExportXmlFloat />

                {/* 로봇 아이콘 */}
                {/* <div className="app-robot-container" style={{ position: "absolute", bottom: 20, right: 30 }}>
                  <img src={robotIcon} alt="AI 도우미" className="app-robot-icon" style={{ width: 52, height: 52 }} />
                </div> */}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 채점 결과 모달 */}
      {gradeOpen && (
        <div
          onClick={() => setGradeOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520, maxWidth: "90vw",
              background: "#fff", borderRadius: 14, padding: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>
                채점 결과{problem ? ` — ${problem.title}` : ""}
              </h3>
              <button
                onClick={() => setGradeOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {gradeResult ? (() => {
              const passedAll = gradeResult.score === gradeResult.total;
              const fails = gradeResult.checks.filter(c => !c.pass);
              const passes = gradeResult.checks.filter(c => c.pass);

              return (
                <>
                  {/* 상단 배지 */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      marginBottom: 12,
                      background: passedAll ? '#ECFDF5' : '#FEF2F2',
                      color: passedAll ? '#065F46' : '#991B1B',
                      fontWeight: 700
                    }}
                  >
                    {passedAll ? '모든 채점 기준을 통과했습니다! 🎉' : '아직 통과하지 못한 항목이 있어요. 아래를 확인해보세요.'}
                  </div>

                  {/* 점수 */}
                  <div style={{ marginBottom: 10, fontWeight: 700 }}>
                    점수: {gradeResult.score} / {gradeResult.total}
                  </div>

                  {/* 미통과 항목 */}
                  {fails.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>미통과 항목</div>
                      <ul style={{ maxHeight: 200, overflow: 'auto', paddingLeft: 18, lineHeight: 1.7 }}>
                        {fails.map((c, i) => (
                          <li key={`f-${i}`} style={{ color: '#991B1B' }}>
                            ❌ {humanizeCheck(c)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 통과 항목 (선택) */}
                  {passes.length > 0 && (
                    <details style={{ marginTop: 6 }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 700, marginBottom: 6 }}>통과한 항목 보기</summary>
                      <ul style={{ maxHeight: 160, overflow: 'auto', paddingLeft: 18, lineHeight: 1.7 }}>
                        {passes.map((c, i) => (
                          <li key={`p-${i}`} style={{ color: '#065F46' }}>
                            ✅ {humanizeCheck(c)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* CTA 버튼 영역 */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                    {!passedAll ? (
                      <button onClick={() => setGradeOpen(false)} className="btn btn-primary">
                        다시 해보기
                      </button>
                    ) : (
                      <>
                        {nextId ? (
                          <button
                            onClick={() => {
                              setGradeOpen(false);
                              resetWorkspaceAndState();
                              navigate(`/mission/${nextId}`);
                            }}
                            className="btn btn-primary"
                          >
                            다음 문제 풀러가기 ▶
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setGradeOpen(false);
                              navigate('/mission');
                            }}
                            className="btn btn-primary"
                          >
                            문제 목록으로
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              );
            })() : (
              <div>채점 정보가 없습니다.</div>
            )}

          </div>
        </div>
      )}

    </>
  );
}