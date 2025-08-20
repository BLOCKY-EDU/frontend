// src/data/problems/advanced.js
import img1 from "../../assets/robot-icon.png";
import img2 from "../../assets/robot-icon.png";
import img3 from "../../assets/robot-icon.png";

export const ADVANCED_PROBLEMS = [
  {
    id: 13,
    title: "광고 홈페이지를 만들어보자!",
    image: img1,
    imageHints: ["/images/bakery_banner.png"],
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
      requiredSelectors: [
        "h3", "button", "img", 'input[type="text"]', "p", "ul", "li"
      ],
      requireTextAt: [
        { selector: "h3", text: "Welcome to my bakery!", mode: "includes" },
        { selector: "button", text: "로그인", mode: "includes" },
        { selector: "button", text: "회원가입", mode: "includes" }
      ],
      requireText: [
        "아이들이 안심하고 먹을 수 있는 빵만 만듭니다",
        "최고급 재료, 당일 제작, 당일 배송",
        "프레첼", "바게트", "에그타르트", "초코 쿠키"
      ],
      requireInlineStyles: [
        "display", "align-items", "justify-content", "background-color",
        "padding", "box-shadow", "height", "gap"
      ],
      requireInlineStylesAt: [
        // 헤더 컨테이너 배경
        // { selector: "body", prop: "background-color", value: "#ffffcc", mode: "includes" },
        // 헤더 패딩
        { selector: "div", prop: "padding", value: "16px", mode: "includes" },
        // 헤더 정렬
        { selector: "div", prop: "align-items", value: "center", mode: "includes" },
        { selector: "div", prop: "box-shadow", value: "#c0c0c0", mode: "includes" },
        { selector: "div", prop: "justify-content", value: "center", mode: "includes" },
        { selector: "div", prop: "height", value: "200px", mode: "includes" },
        { selector: "div", prop: "margin-top", value: ".*", mode: "includes" },
        // { selector: "div", prop: "gap", value: ".*", mode: "includes" },
        { selector: "div", prop: "gap", value: ".*", mode: "includes" }
      ],
      requireAttributesAt: [
        { selector: "img", attr: "src", value: "/images/bakery_banner.png", mode: "includes" },
        { selector: 'input[type="text"]', attr: "placeholder", value: "먹고 싶은 빵을 검색해 보세요", mode: "equals" }
      ],
    }
  },

  {
    id: 14, title: "로그인 화면을 만들어보자!",
    image: img2,
    imageHints: ["/images/blocky-logo.png"],
    answerXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="30" y="50">
    <statement name="CONTENT">
      <block type="insert_image">
        <field name="SRC">/images/blocky-logo.png</field>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_width">
        <field name="WIDTH">200</field>
      </block>
    </statement>
    <next>
      <block type="container_box">
        <statement name="CONTENT">
          <block type="text_small_title">
            <field name="SMALL_TITLE">아이디</field>
            <next>
              <block type="text_input">
                <field name="PLACEHOLDER">아이디를 입력해 주세요!</field>
              </block>
            </next>
          </block>
        </statement>
        <statement name="STYLE">
          <block type="style_background">
            <field name="COLOR">#ffffcc</field>
          </block>
        </statement>
        <next>
          <block type="container_box">
            <statement name="CONTENT">
              <block type="text_small_title">
                <field name="SMALL_TITLE">비밀번호</field>
                <next>
                  <block type="text_input">
                    <field name="PLACEHOLDER">비밀번호를 입력해 주세요!</field>
                  </block>
                </next>
              </block>
            </statement>
            <statement name="STYLE">
              <block type="style_background">
                <field name="COLOR">#ccffff</field>
              </block>
            </statement>
            <next>
              <block type="container_box">
                <statement name="CONTENT">
                  <block type="normal_button">
                    <field name="LABEL">회원이 아니신가요?</field>
                    <next>
                      <block type="normal_button">
                        <field name="LABEL">로그인하기</field>
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
</xml>
    `,
    rules: {
      // 핵심 요소만 확인 (너무 빡빡 X)
      requiredSelectors: [
        "img", "h3", 'input[type="text"]', "button" // h3(라벨), 텍스트 인풋, 버튼
      ],

      // 텍스트가 특정 요소 안에 대략 포함되면 통과
      requireTextAt: [
        { selector: "h3", text: "아이디", mode: "includes" },
        { selector: "h3", text: "비밀번호", mode: "includes" },
        { selector: "button", text: "로그인", mode: "includes" } // "로그인하기" 등 허용
      ],

      // 페이지 전체에 포함돼 있으면 통과(오타 방지용으로 최소화)
      requireText: [
        "회원이 아니신가요?"
      ],

      // 스타일 존재 여부만 확인(값은 느슨하게)
      requireInlineStyles: [
        "width", "background-color", "gap"
      ],
      requireInlineStylesAt: [
        // 로고 컨테이너의 width 200 (px 붙임 보정 허용)
        { selector: "div", prop: "width", value: "200", mode: "includes" },
        // 영역들의 배경색이 실제 들어갔는지만 확인 (색상 값 느슨)
        { selector: "div", prop: "background-color", value: ".*", mode: "includes" },
        // 버튼 묶음 간격
        { selector: "div", prop: "gap", value: ".*", mode: "includes" }
      ],

      // 로고 이미지 경로는 포함 매칭으로 (쿼리스트링 허용)
      requireAttributesAt: [
        { selector: "img", attr: "src", value: "/images/blocky-logo.png", mode: "includes" },
        { selector: 'input[type="text"]', attr: "placeholder", value: "아이디를 입력해 주세요!", mode: "includes" },
        { selector: 'input[type="text"]', attr: "placeholder", value: "비밀번호를 입력해 주세요!", mode: "includes" }
      ],
    }
  },
  {
    id: 15, title: "채팅 화면을 만들어보자!", image: img3,
    answerXml: `
    <xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="150" y="50">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">~ 토끼와 곰돌이와의 채팅 ~</field>
        <next>
          <block type="container_box">
            <statement name="CONTENT">
              <block type="text_small_title">
                <field name="SMALL_TITLE">오늘 날씨가 완전 솜사탕 같아</field>
                <next>
                  <block type="text_small_title">
                    <field name="SMALL_TITLE">산책나가고 싶은데 같이 갈래?</field>
                  </block>
                </next>
              </block>
            </statement>
            <statement name="STYLE">
              <block type="style_background">
                <field name="COLOR">#ffcc99</field>
                <next>
                  <block type="style_border_radius_side">
                    <field name="CORNER">tl</field>
                    <field name="RADIUS">20</field>
                    <next>
                      <block type="style_border_radius_side">
                        <field name="CORNER">tr</field>
                        <field name="RADIUS">20</field>
                        <next>
                          <block type="style_border_radius_side">
                            <field name="CORNER">br</field>
                            <field name="RADIUS">20</field>
                            <next>
                              <block type="style_margin_side">
                                <field name="SIDE">all</field>
                                <field name="VALUE">16px</field>
                                <next>
                                  <block type="style_padding_side">
                                    <field name="SIDE">all</field>
                                    <field name="VALUE">16px</field>
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
            <next>
              <block type="container_box">
                <statement name="CONTENT">
                  <block type="text_small_title">
                    <field name="SMALL_TITLE">오~ 좋아</field>
                    <next>
                      <block type="text_small_title">
                        <field name="SMALL_TITLE">그럼 우리 여기서 만나자!</field>
                        <next>
                          <block type="navigation_button">
                            <field name="LINK">https://naver.me/x67yo13I</field>
                            <field name="LABEL">솜사탕 지도(누르면 이동됩니다)</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <statement name="STYLE">
                  <block type="style_background">
                    <field name="COLOR">#ffcccc</field>
                    <next>
                      <block type="style_margin_side">
                        <field name="SIDE">all</field>
                        <field name="VALUE">16px</field>
                        <next>
                          <block type="style_padding_side">
                            <field name="SIDE">all</field>
                            <field name="VALUE">16px</field>
                            <next>
                              <block type="style_border_radius_side">
                                <field name="CORNER">tl</field>
                                <field name="RADIUS">20</field>
                                <next>
                                  <block type="style_border_radius_side">
                                    <field name="CORNER">tr</field>
                                    <field name="RADIUS">20</field>
                                    <next>
                                      <block type="style_border_radius_side">
                                        <field name="CORNER">bl</field>
                                        <field name="RADIUS">20</field>
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
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_margin_side">
        <field name="SIDE">all</field>
        <field name="VALUE">20</field>
      </block>
    </statement>
  </block>
</xml>
    `,

    rules: {
      requiredSelectors: [
        "h1", "h3", "a" // 제목, 말풍선 텍스트, 이동 링크
      ],

      // 말풍선 텍스트는 '포함' 기준으로만 (엄격 X)
      requireTextAt: [
        { selector: "h1", text: "채팅", mode: "includes" },
        { selector: "h3", text: "솜사탕", mode: "includes" },   // 예: "오늘 날씨가 완전 솜사탕 같아"
        { selector: "h3", text: "만나자", mode: "includes" }    // 예: "그럼 우리 여기서 만나자!"
      ],

      // 전체에 한 번이라도 나오면 OK (너무 빡빡하게 매칭하지 않기)
      requireText: [
        "산책", "지도"
      ],

      // 스타일은 존재만 검사 (값은 느슨)
      requireInlineStyles: [
        "background-color", "border-radius", "padding", "margin"
      ],
      requireInlineStylesAt: [
        { selector: "div", prop: "background-color", value: ".*", mode: "includes" },
        { selector: "div", prop: "border-top-left-radius", value: ".*", mode: "includes" },
        { selector: "div", prop: "border-top-right-radius", value: ".*", mode: "includes" },
        // 말풍선 여백/패딩
        { selector: "div", prop: "padding", value: ".*", mode: "includes" },
        { selector: "div", prop: "margin", value: ".*", mode: "includes" }
      ],

      // 이동 버튼(링크) — href는 도메인 포함 매칭만
      requireAttributesAt: [
        { selector: "a", attr: "href", value: "naver.me", mode: "includes" },
        { selector: "a", attr: "href", value: "https://naver.me/x67yo13I", mode: "includes" }
      ],
    }
  },
];
