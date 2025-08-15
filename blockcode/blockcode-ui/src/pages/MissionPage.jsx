import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROBLEM_BY_ID } from "../data/problems";
import { htmlFromLocal, gradeHtml } from "../utils/grader";
import "./MissionPage.css";

import * as Blockly from "blockly";
import { parseLayoutXmlToJSX } from "../tabs/LayoutTab";
import { parseWritingXmlToJSX } from "../tabs/WritingTab";
import { parseButtonXmlToJSX } from "../tabs/ButtonTab";
import { parseImageXmlToJSX } from "../tabs/ImageTab";
import { parseListXmlToJSX } from "../tabs/ListTab";
import { parseNavigationXmlToJSX } from "../tabs/NavigationTab";

const WRITING_TYPES = new Set([
  "text_title", "text_small_title", "small_content", "recipe_step",
  "toggle_input", "highlight_text", "paragraph",
]);
const BUTTON_TYPES = new Set([
  "normal_button", "submit_button", "text_input", "email_input", "checkbox_block", "select_box",
]);
const IMAGE_TYPES = new Set(["insert_image", "insert_video", "youtube_link"]);
const LIST_TYPES = new Set(["list_item", "ordered_list_item", "list_bulleted", "list_numbered"]);
const NAV_TYPES = new Set(["navigation_button"]);

function dispatchXmlToJSX(xmlOrDom) {
  const xmlText = typeof xmlOrDom === 'string' ? xmlOrDom : Blockly.Xml.domToText(xmlOrDom);
  const root = Blockly.utils.xml.textToDom(xmlText.startsWith('<xml') ? xmlText : `<xml>${xmlText}</xml>`);
  // 👇 네임스페이스/공백 노드 이슈 대비: 최상위 block만 선별
  const blocks = Array.from(root.getElementsByTagName('block')).filter(b => b.parentNode === root);
  const out = [];

  // 폴백: 최상위 block이 하나도 안 잡히면 통째로 레이아웃 파서에 넘겨보기
  if (blocks.length === 0) {
    console.warn('[answerXml] no top-level <block> found; fallback to parseLayoutXmlToJSX');
    const jsx = parseLayoutXmlToJSX(xmlText);
    return Array.isArray(jsx) ? jsx : (jsx ? [jsx] : []);
  }

  for (const b of blocks) {
    const type = b.getAttribute('type');
    const one = Blockly.Xml.domToText(b);
    // console.log('[answerXml] block type:', type);
    if (type === 'container_box') {
      const jsx = parseLayoutXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    } else if (WRITING_TYPES.has(type)) {
      const jsx = parseWritingXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    } else if (BUTTON_TYPES.has(type)) {
      const jsx = parseButtonXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    } else if (IMAGE_TYPES.has(type)) {
      const jsx = parseImageXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    } else if (LIST_TYPES.has(type)) {
      const jsx = parseListXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    } else if (NAV_TYPES.has(type)) {
      const jsx = parseNavigationXmlToJSX(one);
      Array.isArray(jsx) ? out.push(...jsx) : out.push(jsx);
    }
  }
  return out;
}

export default function MissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEM_BY_ID[id];

  if (!problem) return <div>존재하지 않는 문제입니다. (id={id})</div>;

  const [grade, setGrade] = React.useState(null);
  const [showAnswer, setShowAnswer] = React.useState(true);

  const handleGrade = () => {
    const html = htmlFromLocal();
    const res = gradeHtml(html, problem.rules || {});
    setGrade(res);
  };

  const answerPreview = React.useMemo(() => {
    // 1) answerHtml이 있으면 그대로 사용
    if (problem.answerHtml) {
      return <div dangerouslySetInnerHTML={{ __html: problem.answerHtml }} />;
    }
    // 2) answerXml이 있으면 파서로 렌더
    if (problem.answerXml) {
      return <div className="answer-from-xml">{dispatchXmlToJSX(problem.answerXml)}</div>;
    }
    // 3) 없으면 이미지 fallback
    if (problem.image) {
      return <img src={problem.image} alt={problem.title} style={{ width: 240, borderRadius: 12 }} />;
    }
    return null;
  }, [problem]);

  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="app-tab-btn active" style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          나의 미션 — “{problem.title}”
        </div>
        <button className="app-tab-btn" onClick={() => navigate(-1)}>문제 목록으로</button>
      </div> */}
      {showAnswer && (
        <div className="answer-panel__body">
          {answerPreview}
        </div>
      )}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* 정답 예시 박스 */}
        {/* <div className="answer-panel">
          <div className="answer-panel__header">
            정답 예시
            <button className="answer-toggle" onClick={() => setShowAnswer(v => !v)}>
              {showAnswer ? '숨기기' : '보기'}
            </button>
          </div>
          {showAnswer && (
            <div className="answer-panel__body">
              {answerPreview}
            </div>
          )}
        </div> */}



        {/* <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 8 }}>문제 {id}</h2>
          <p style={{ fontWeight: 600 }}>{problem.title}</p>
          <p style={{ marginTop: 8, color: "#4b5563" }}>우측 블록을 조립해 상단 “나의 화면”과 같이 만들면 성공!</p>
        </div> */}

        {/* <div style={{ marginTop: 16, padding: 12 }}>
          <button className="missionpage-check-btn" onClick={handleGrade}>채점하기</button>
          {grade && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>점수: {grade.score} / {grade.total}</div>
              <ul style={{ lineHeight: 1.7 }}>
                {grade.checks.map((c, idx) => (
                  <li key={idx}>{c.pass ? '✅' : '❌'} [{c.type}] {c.target}</li>
                ))}
              </ul>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

