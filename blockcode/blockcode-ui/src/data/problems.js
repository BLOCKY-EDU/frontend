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
  // { id: 4, title: "문제 4", image: img4 },
  // { id: 5, title: "문제 5", image: img5 },
  // { id: 6, title: "문제 6", image: img6 },
];

// 중급 문제 (7~12)
export const INTERMEDIATE_PROBLEMS = [
  { id: 7, title: "중급 문제 1", image: img1 },
  { id: 8, title: "중급 문제 2", image: img2 },
  { id: 9, title: "중급 문제 3", image: img3 },
  // { id: 10, title: "중급 문제 4", image: img4 },
  // { id: 11, title: "중급 문제 5", image: img5 },
  // { id: 12, title: "중급 문제 6", image: img6 },
];

// 고급 문제 (13~18)
export const ADVANCED_PROBLEMS = [
  {
    id: 13,
    title: "고급 — 네비바 + 배너 + 검색창 만들기",
    image: img1,
    answerXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="150" y="70">
    <statement name="CONTENT">
      <block type="container_box">
        <statement name="CONTENT">
          <block type="text_small_title">
            <field name="SMALL_TITLE">Welcome to my bakery!</field>
          </block>
        </statement>
        <statement name="STYLE">
          <block type="style_font_family">
            <field name="FAMILY">Georgia, "Times New Roman", serif</field>
          </block>
        </statement>
        <next>
          <block type="container_box">
            <statement name="CONTENT">
              <block type="normal_button">
                <field name="LABEL">로그인</field>
                <next>
                  <block type="normal_button">
                    <field name="LABEL">회원가입</field>
                  </block>
                </next>
              </block>
            </statement>
            <statement name="STYLE">
              <block type="style_margin_side">
                <field name="SIDE">left</field>
                <field name="VALUE">30</field>
                <next>
                  <block type="style_flex_row">
                    <next>
                      <block type="style_gap">
                        <field name="GAP">8px</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_flex_row">
        <next>
          <block type="style_background">
            <field name="COLOR">#ffffcc</field>
            <next>
              <block type="style_align_items">
                <field name="ALIGN">center</field>
                <next>
                  <block type="style_padding_side">
                    <field name="SIDE">all</field>
                    <field name="VALUE">16px</field>
                    <next>
                      <block type="style_shadow_custom">
                        <field name="X">0</field>
                        <field name="Y">0</field>
                        <field name="BLUR">4px</field>
                        <field name="COLOR">#c0c0c0</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
    <next>
      <block type="container_box">
        <statement name="CONTENT">
          <block type="insert_image">
            <field name="SRC">/images/bakery_banner.png</field>
          </block>
        </statement>
        <statement name="STYLE">
          <block type="style_flex_row">
            <next>
              <block type="style_justify_content">
                <field name="JUSTIFY">center</field>
                <next>
                  <block type="style_height">
                    <field name="HEIGHT">200</field>
                    <next>
                      <block type="style_margin_side">
                        <field name="SIDE">top</field>
                        <field name="VALUE">10</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
        <next>
          <block type="container_box">
            <statement name="CONTENT">
              <block type="paragraph">
                <field name="TEXT">아이들이 안심하고 먹을 수 있는 빵만 만듭니다.</field>
                <next>
                  <block type="text_small_title">
                    <field name="SMALL_TITLE">최고급 재료, 당일 제작, 당일 배송</field>
                    <next>
                      <block type="text_input">
                        <field name="PLACEHOLDER">먹고 싶은 빵을 검색해 보세요</field>
                        <next>
                          <block type="container_box">
                            <statement name="CONTENT">
                              <block type="list_bulleted">
                                <statement name="ITEMS">
                                  <block type="list_item">
                                    <field name="TEXT">프레첼</field>
                                    <next>
                                      <block type="list_item">
                                        <field name="TEXT">바게트</field>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                                <next>
                                  <block type="list_bulleted">
                                    <statement name="ITEMS">
                                      <block type="list_item">
                                        <field name="TEXT">에그타르트</field>
                                        <next>
                                          <block type="list_item">
                                            <field name="TEXT">초코 쿠키</field>
                                          </block>
                                        </next>
                                      </block>
                                    </statement>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <statement name="STYLE">
                              <block type="style_flex_row">
                                <next>
                                  <block type="style_gap">
                                    <field name="GAP">20</field>
                                  </block>
                                </next>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <statement name="STYLE">
              <block type="style_flex_column">
                <next>
                  <block type="style_align_items">
                    <field name="ALIGN">center</field>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`,

    rules: {
      // 1) 핵심 요소 존재
      requiredSelectors: [
        "h3",                 // 사이트 타이틀(작은 제목)
        "button",             // 로그인/회원가입(일반 버튼)
        "img",                // 배너 이미지
        'input[type="text"]', // 검색창
        "p",                  // 소개 문단
        "ul", "li"            // 목록
      ],

      // 2) 텍스트 검사 (요소별)
      requireTextAt: [
        { selector: "h3", text: "Welcome to my bakery!", mode: "includes" },
        { selector: "button", text: "로그인", mode: "includes" },
        { selector: "button", text: "회원가입", mode: "includes" }
      ],

      // 3) 텍스트 검사 (화면 전체)
      requireText: [
        "아이들이 안심하고 먹을 수 있는 빵만 만듭니다",
        "최고급 재료, 당일 제작, 당일 배송",
        "프레첼", "바게트", "에그타르트", "초코 쿠키"
      ],

      // 4) 인라인 스타일이 실제로 쓰였는지(속성 이름만 확인)
      requireInlineStyles: [
        "display",           // flex 사용
        "align-items",       // 수직 정렬
        "justify-content",   // 가운데 정렬
        "background-color",  // 배경색
        "padding",           // 패딩
        "box-shadow",        // 그림자
        "height",            // 배너 높이
        "gap"                // 간격(헤더/리스트)
      ],

      // 5) 특정 값까지 확인(빡빡)
      requireInlineStylesAt: [
        // 헤더 컨테이너 배경
        { selector: "body", prop: "background-color", value: "#ffffcc", mode: "includes" },
        // 헤더 패딩
        { selector: "div", prop: "padding", value: "16px", mode: "includes" },
        // 헤더 정렬
        { selector: "div", prop: "align-items", value: "center", mode: "includes" },
        // 헤더 그림자 색상(커스텀 쉐도우)
        { selector: "div", prop: "box-shadow", value: "#c0c0c0", mode: "includes" },

        // 배너 영역
        { selector: "div", prop: "justify-content", value: "center", mode: "includes" },
        { selector: "div", prop: "height", value: "200px", mode: "includes" },
        { selector: "div", prop: "margin-top", value: "10px", mode: "includes" },

        // 간격(gap) — 헤더 버튼/리스트 컨테이너
        { selector: "div", prop: "gap", value: "8px", mode: "includes" },
        { selector: "div", prop: "gap", value: "20px", mode: "includes" }
      ],

      // 6) 속성 검사 (가능하면 사용)
      requireAttributesAt: [
        // 내부 이미지 경로 사용 유도
        { selector: "img", attr: "src", value: "/images/", mode: "includes" },
        // 검색창 placeholder 정확히 일치
        { selector: 'input[type="text"]', attr: "placeholder", value: "먹고 싶은 빵을 검색해 보세요", mode: "equals" }
      ],

      // 7) 금지 요소
      //forbiddenSelectors: ["iframe"]
    }
  },

  { id: 14, title: "고급 문제 2", image: img2 },
  { id: 15, title: "고급 문제 3", image: img3 },
  // { id: 16, title: "고급 문제 4", image: img4 },
  // { id: 17, title: "고급 문제 5", image: img5 },
  // { id: 18, title: "고급 문제 6", image: img6 },
];

// 모든 문제를 id로 찾을 수 있게 매핑
export const PROBLEM_BY_ID = Object.fromEntries(
  [...BASIC_PROBLEMS, ...INTERMEDIATE_PROBLEMS, ...ADVANCED_PROBLEMS].map(p => [String(p.id), p])
);
