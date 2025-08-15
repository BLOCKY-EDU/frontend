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
  <block type="container_box" x="32" y="20">
    <statement name="STYLE">
      <block type="style_padding_side">
        <field name="SIDE">all</field>
        <field name="VALUE">12px</field>
        <next>
          <block type="style_background">
            <field name="COLOR">#FAFAFA</field>
          </block>
        </next>
      </block>
    </statement>

    <statement name="CONTENT">
      <!-- ① 네비게이션 바 -->
      <block type="container_box">
        <statement name="STYLE">
          <block type="style_height">
            <field name="HEIGHT">60px</field>
            <next>
              <block type="style_background">
                <field name="COLOR">#0EA5E9</field>
                <next>
                  <block type="style_flex_row">
                    <next>
                      <block type="style_justify_content">
                        <field name="JUSTIFY">space-between</field>
                        <next>
                          <block type="style_align_items">
                            <field name="ALIGN">center</field>
                            <next>
                              <block type="style_padding_side">
                                <field name="SIDE">all</field>
                                <field name="VALUE">12px</field>
                              </block>
                            </next>
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

        <statement name="CONTENT">
          <!-- 좌: 타이틀 -->
          <block type="text_title">
            <field name="TITLE">Blocky Mall</field>
          </block>

          <!-- 우: 로그인 / 회원가입 -->
          <next>
            <block type="container_box">
              <statement name="STYLE">
                <block type="style_flex_row">
                  <next>
                    <block type="style_gap">
                      <field name="GAP">8px</field>
                    </block>
                  </next>
                </block>
              </statement>
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
            </block>
          </next>
        </statement>

        <!-- ② 배너 (네비 다음 형제) -->
        <next>
          <block type="container_box">
            <statement name="STYLE">
              <block type="style_margin_side">
                <field name="SIDE">top</field>
                <field name="VALUE">12px</field>
              </block>
            </statement>
            <statement name="CONTENT">
              <block type="insert_image">
                <field name="SRC">https://picsum.photos/seed/blockymall/640/220</field>
              </block>
            </statement>

            <!-- ③ 검색 영역 (배너 다음 형제) -->
            <next>
              <block type="container_box">
                <statement name="STYLE">
                  <block type="style_margin_side">
                    <field name="SIDE">top</field>
                    <field name="VALUE">12px</field>
                    <next>
                      <block type="style_flex_row">
                        <next>
                          <block type="style_justify_content">
                            <field name="JUSTIFY">center</field>
                            <next>
                              <block type="style_gap">
                                <field name="GAP">8px</field>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <statement name="CONTENT">
                  <block type="text_input">
                    <field name="PLACEHOLDER">무엇이든 검색해 보세요!</field>
                    <next>
                      <block type="submit_button">
                        <field name="LABEL">검색</field>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>
  `,
    rules: {
      // 필수 요소: 타이틀(H1), 배너 이미지, 검색창+제출버튼
      requiredSelectors: [
        "h1",
        "img",
        'input[type="text"]',
        'button[type="submit"]'
      ],
      // 텍스트 체크 (normal_button은 type이 없으니 텍스트로 확인)
      requireText: ["Blocky Mall", "로그인", "회원가입", "검색"],
      // 인라인 스타일 사용 (레이아웃 핵심)
      requireInlineStyles: [
        "display",          // flex 사용
        "justify-content",  // 좌우 정렬
        "align-items",      // 수직 정렬
        "gap",              // 버튼/검색 간격
        "height",           // 네비바 높이
        "background-color"  // 네비바 배경
      ],
      // 좀 더 빡빡한 값 확인
      requireInlineStylesAt: [
        { selector: "div", prop: "height", value: "60px", mode: "includes" },
        { selector: "div", prop: "background-color", value: "#0EA5E9", mode: "includes" },
        { selector: "div", prop: "justify-content", value: "space-between", mode: "includes" }, // 네비
        { selector: "div", prop: "justify-content", value: "center", mode: "includes" },        // 검색영역
        { selector: "div", prop: "gap", value: "8px", mode: "includes" }
      ],
      forbiddenSelectors: ["iframe"]
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
