// src/data/problems.js
import img1 from "../assets/robot-icon.png";
import img2 from "../assets/robot-icon.png";
import img3 from "../assets/robot-icon.png";
import img4 from "../assets/robot-icon.png";
import img5 from "../assets/robot-icon.png";
import img6 from "../assets/robot-icon.png";

// 초급 문제 (1~6)
export const BASIC_PROBLEMS = [
  { id: 1, title: "큰 제목을 화면에 넣어봐요!", image: img1, rules: { requiredSelectors: ["h1"], requireText: ["제목"] } },
  { id: 2, title: "로그인 화면을 만들어봐요!", image: img2, rules: { requiredSelectors: ['input[type="text"]', 'button[type="submit"]'], requireInlineStyles: ["background-color"] } },
  { id: 3, title: "카카오톡 화면을 만들어봐요!", image: img3 },
  { id: 4, title: "문제 4", image: img4 },
  { id: 5, title: "문제 5", image: img5 },
  { id: 6, title: "문제 6", image: img6 },
];

// 중급 문제 (7~12)
export const INTERMEDIATE_PROBLEMS = [
  { id: 7, title: "중급 문제 1", image: img1 },
  { id: 8, title: "중급 문제 2", image: img2 },
  { id: 9, title: "중급 문제 3", image: img3 },
  { id: 10, title: "중급 문제 4", image: img4 },
  { id: 11, title: "중급 문제 5", image: img5 },
  { id: 12, title: "중급 문제 6", image: img6 },
];

// 고급 문제 (13~18)
export const ADVANCED_PROBLEMS = [
  {
    id: 13, title: "고급 문제 121343", image: img1,
    answerXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="40" y="20">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">쿠키 레시피</field>
        <next>
          <block type="paragraph">
            <field name="TEXT">초코칩을 듬뿍 넣어보자!</field>
          </block>
        </next>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_background">
        <field name="COLOR">#FAFAFA</field>
      </block>
      <next>
        <block type="style_padding">
          <field name="VALUE">16</field>
        </block>
      </next>
    </statement>
  </block>
</xml>
    `,

    starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="40" y="20">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">쿠키 레시피</field>
        <next>
          <block type="paragraph">
            <field name="TEXT">초코칩을 듬뿍 넣어보자!</field>
          </block>
        </next>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_background">
        <field name="COLOR">#FAFAFA</field>
      </block>
    </statement>
  </block>
</xml>`,

    rules: {
      requiredSelectors: ['h1', 'p'],        // 제목/문단은 반드시 있어야 함
      forbiddenSelectors: ['iframe'],        // 금지 요소 예시
      requireText: ['쿠키', '초코칩'],       // 페이지 전체 텍스트에 포함되어야 함
      requireInlineStyles: ['background-color'], // 인라인 스타일에 이 속성이 1개 이상 존재
    },
  },
  { id: 14, title: "고급 문제 2", image: img2 },
  { id: 15, title: "고급 문제 3", image: img3 },
  { id: 16, title: "고급 문제 4", image: img4 },
  { id: 17, title: "고급 문제 5", image: img5 },
  { id: 18, title: "고급 문제 6", image: img6 },
];

// 모든 문제를 id로 찾을 수 있게 매핑
export const PROBLEM_BY_ID = Object.fromEntries(
  [...BASIC_PROBLEMS, ...INTERMEDIATE_PROBLEMS, ...ADVANCED_PROBLEMS].map(p => [String(p.id), p])
);
