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
import logo from "../assets/blocky-logo.png";
import div_ex from "../assets/div-example.png";
import bg_ex from "../assets/bg-color-example.png";
import code_ex from "../assets/code-example.png";
import check_ex from "../assets/check-example.png";
function TutorialModal({ onClose }) {
    // 이 pages 배열에 img:이미지 이런 식으로 튜토리얼 페이지별 이미지 삽입 가능
    const pages = [
        { title: "환영합니다!", content: "블록을 조합해 미션과 같은 화면을 만드세요!"},
        { title: "스타일 적용", content: "상자 블록의 아래 칸에 스타일 블록을 집어넣어 다양한 스타일을 적용해보세요!" ,img:div_ex },
        { title: "배경색 변경", content: "스타일 블록은 항상 상자의 밑에 넣어야 적용되지만, 배경 색상 블록은 단독으로 전체 배경색 변경이 가능합니다.", img:bg_ex },
        { title: "코드 확인", content: "상단 '</>' 버튼을 눌러 블록을 코드로 바꾸어 확인할 수 있어요!" , img:code_ex },
        { title: "정답 확인", content: "하단 '채점' 버튼을 눌러 결과를 확인할 수 있습니다." , img:check_ex},
        { title: "완료!", content: "이제 직접 블록을 조합해보세요!" },
    ];

    const [page, setPage] = React.useState(0);

    const handleNext = () => {
        if (page < pages.length - 1) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleSkip = () => {
        localStorage.setItem("tutorial_seen", "true");
        onClose();
    };

    const handleFinish = () => {
        localStorage.setItem("tutorial_seen", "true");
        onClose();
    };

    return (
        <div className="tutorial-backdrop">
            <div className="tutorial-modal">
                <h2>{pages[page].title}</h2>
                {pages[page].img && <img src={pages[page].img} alt="" style={{ maxWidth: "100%" }} />}
                <p>{pages[page].content}</p>
                <div className="tutorial-controls">
                    {/* 이전 버튼: 첫 페이지가 아닐 때만 */}
                    {page > 0 && <button onClick={handlePrev}>이전</button>}

                    {page < pages.length - 1 && (
                        <>
                            <button onClick={handleNext}>다음</button>
                            <button onClick={handleSkip}>건너뛰기</button>
                        </>
                    )}

                    {page === pages.length - 1 && (
                        <button onClick={handleFinish}>시작하기</button>
                    )}
                </div>
            </div>
        </div>
    );
}

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
    const [showTutorial, setShowTutorial] = React.useState(false);

    React.useEffect(() => {
        const seen = localStorage.getItem("tutorial_seen");
        if (!seen) {
            setShowTutorial(true);
        }
    }, []);
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
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
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

