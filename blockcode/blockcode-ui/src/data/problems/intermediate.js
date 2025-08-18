// src/data/problems/intermediate.js
import img1 from "../../assets/robot-icon.png";
import img2 from "../../assets/robot-icon.png";
import img3 from "../../assets/robot-icon.png";

export const INTERMEDIATE_PROBLEMS = [
    {
        id: 4, title: "숫자 목록을 써보자!", image: img1,
        answerXml: `
        <xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="230" y="70">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">숫자 목록 쓰는 법!</field>
        <next>
          <block type="list_numbered">
            <statement name="ITEMS">
              <block type="ordered_list_item">
                <field name="TEXT">상자를 먼저 배치한다</field>
                <next>
                  <block type="ordered_list_item">
                    <field name="TEXT">목록 탭 클릭!</field>
                    <next>
                      <block type="ordered_list_item">
                        <field name="TEXT">숫자 목록을 먼저 배치한다!</field>
                        <next>
                          <block type="ordered_list_item">
                            <field name="TEXT">숫자 목록 안에 숫자 목록 내용을 넣어서 쓴다</field>
                            <next>
                              <block type="ordered_list_item">
                                <field name="TEXT">실제 html 방식과 비슷하다~</field>
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
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>
        `,
        rules: {
            requiredSelectors: [
                "h1",
                "ol",
                "ol li",
                "ol li:nth-of-type(5)" // 최소 5개 확인
            ],
            requireTextAt: [
                { selector: "h1", text: "숫자 목록 쓰는 법!", mode: "equals" },
                { selector: "ol li:nth-of-type(1)", text: "상자를 먼저 배치한다", mode: "equals" },
                { selector: "ol li:nth-of-type(2)", text: "목록 탭 클릭!", mode: "equals" },
                { selector: "ol li:nth-of-type(3)", text: "숫자 목록을 먼저 배치한다!", mode: "equals" },
                { selector: "ol li:nth-of-type(4)", text: "숫자 목록 안에 숫자 목록 내용을 넣어서 쓴다", mode: "equals" },
                { selector: "ol li:nth-of-type(5)", text: "실제 html 방식과 비슷하다~", mode: "equals" }
            ]
        }

    },
    {
        id: 5, title: "체크리스트를 만들어보자!", image: img2,
        answerXml: `
        <xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="190" y="70">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">오늘의 귀여운 체크리스트</field>
        <next>
          <block type="checkbox_block">
            <field name="LABEL">화분에 물주기~</field>
            <next>
              <block type="checkbox_block">
                <field name="LABEL">토끼 인형 쓰담쓰담하기</field>
                <next>
                  <block type="checkbox_block">
                    <field name="LABEL">따뜻한 차 한 잔 마시기</field>
                    <next>
                      <block type="checkbox_block">
                        <field name="LABEL">방에 있는 먼지 요정 쫓아내기</field>
                        <next>
                          <block type="highlight_text">
                            <field name="HIGHLIGHT">오늘도 파이팅 !!</field>
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
    <statement name="STYLE">
      <block type="style_background">
        <field name="COLOR">#ffffcc</field>
      </block>
    </statement>
  </block>
</xml>
        `,
        rules: {
            requiredSelectors: [
                "h1",
                "input[type=\"checkbox\"]",
                "input[type=\"checkbox\"]:nth-of-type(4)" // 최소 4개 체크박스
            ],
            // 체크 항목 라벨은 어디에 들어가든 텍스트만 있으면 통과
            requireText: [
                "화분에 물주기~",
                "토끼 인형 쓰담쓰담하기",
                "따뜻한 차 한 잔 마시기",
                "방에 있는 먼지 요정 쫓아내기",
                "오늘도 파이팅 !!"
            ],
            // 배경색: 값은 검사하지 않고 prop 존재만 확인 (정규식으로 아무 값이나 허용)
            requireInlineStylesAt: [
                { selector: "div", prop: "background-color", value: ".*", mode: "regex" }
            ]
        }

    },
    {
        id: 6, title: "캐릭터를 소개해보자!", image: img3,
        answerXml: `
        <xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="230" y="-10">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">내 캐릭터 소개</field>
        <next>
          <block type="text_small_title">
            <field name="SMALL_TITLE">안녕! 나는 로키야</field>
            <next>
              <block type="list_bulleted">
                <statement name="ITEMS">
                  <block type="list_item">
                    <field name="TEXT">좋아하는 음식: 당근 케이크</field>
                    <next>
                      <block type="list_item">
                        <field name="TEXT">좋아하는 색: 파스텔 핑크</field>
                        <next>
                          <block type="list_item">
                            <field name="TEXT">취미: 낮잠 자기</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="text_small_title">
                    <field name="SMALL_TITLE">로키한테 듣고싶은 질문을 써줘!</field>
                    <next>
                      <block type="text_input">
                        <field name="PLACEHOLDER">질문을 여기에 써줘!</field>
                        <next>
                          <block type="normal_button">
                            <field name="LABEL">로키한테 질문 보내기</field>
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
    <statement name="STYLE">
      <block type="style_margin_side">
        <field name="SIDE">all</field>
        <field name="VALUE">16px</field>
        <next>
          <block type="style_padding_side">
            <field name="SIDE">all</field>
            <field name="VALUE">16px</field>
            <next>
              <block type="style_flex_column">
                <next>
                  <block type="style_background">
                    <field name="COLOR">#ffccff</field>
                    <next>
                      <block type="style_border_radius_side">
                        <field name="CORNER">all</field>
                        <field name="RADIUS">8px</field>
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
  </block>
</xml>
        `,
        rules: {
            requiredSelectors: [
                "h1",
                "ul",
                "ul li:nth-of-type(3)",        // 최소 3개 항목
                "input[type=\"text\"]",
                "button"
            ],
            requireTextAt: [
                { selector: "h1", text: "내 캐릭터 소개", mode: "equals" },
                // 소제목 1
                { selector: "h2, h3", text: "안녕! 나는 로키야", mode: "equals" },
                // 불릿 3개
                { selector: "ul li:nth-of-type(1)", text: "좋아하는 음식: 당근 케이크", mode: "equals" },
                { selector: "ul li:nth-of-type(2)", text: "좋아하는 색: 파스텔 핑크", mode: "equals" },
                { selector: "ul li:nth-of-type(3)", text: "취미: 낮잠 자기", mode: "equals" },
                // 소제목 2
                { selector: "h2, h3", text: "로키한테 듣고싶은 질문을 써줘!", mode: "equals" },
                // 버튼 라벨
                { selector: "button", text: "로키한테 질문 보내기", mode: "equals" }
            ],
            requireAttributes: [
                { selector: "input[type=\"text\"]", attr: "placeholder", value: "질문을 여기에 써줘!", mode: "equals" }
            ],
            // === 스타일: 값 미검사, 존재만 확인 ===
            requireInlineStylesAt: [
                // margin all
                { selector: "div", prop: "margin", value: ".*", mode: "regex" },
                // { selector: "div", prop: "margin-top", value: ".*", mode: "regex" },
                // { selector: "div", prop: "margin-right", value: ".*", mode: "regex" },
                // { selector: "div", prop: "margin-bottom", value: ".*", mode: "regex" },
                // { selector: "div", prop: "margin-left", value: ".*", mode: "regex" },
                // padding all
                { selector: "div", prop: "padding", value: ".*", mode: "regex" },
                // { selector: "div", prop: "padding-top", value: ".*", mode: "regex" },
                // { selector: "div", prop: "padding-right", value: ".*", mode: "regex" },
                // { selector: "div", prop: "padding-bottom", value: ".*", mode: "regex" },
                // { selector: "div", prop: "padding-left", value: ".*", mode: "regex" },
                // flex column
                { selector: "div", prop: "display", value: ".*", mode: "regex" },
                { selector: "div", prop: "flex-direction", value: ".*", mode: "regex" },
                // background & radius
                { selector: "div", prop: "background-color", value: ".*", mode: "regex" },
                { selector: "div", prop: "border-radius", value: ".*", mode: "regex" }
            ]
        }
    },
];
