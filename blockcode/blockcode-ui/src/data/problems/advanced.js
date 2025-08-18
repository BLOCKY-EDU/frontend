// src/data/problems/advanced.js
import img1 from "../../assets/robot-icon.png";
import img2 from "../../assets/robot-icon.png";
import img3 from "../../assets/robot-icon.png";

export const ADVANCED_PROBLEMS = [
  {
    id: 13,
    title: "광고 홈페이지를 만들어보자!",
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
        "display","align-items","justify-content","background-color",
        "padding","box-shadow","height","gap"
      ],
      requireInlineStylesAt: [
        { selector: "div", prop: "padding", value: ".*", mode: "includes" },
        { selector: "div", prop: "align-items", value: "center", mode: "includes" },
        { selector: "div", prop: "box-shadow", value: "#c0c0c0", mode: "includes" },
        { selector: "div", prop: "justify-content", value: "center", mode: "includes" },
        { selector: "div", prop: "height", value: "200px", mode: "includes" },
        { selector: "div", prop: "margin-top", value: ".*", mode: "includes" },
        { selector: "div", prop: "gap", value: ".*", mode: "includes" },
        { selector: "div", prop: "gap", value: ".*", mode: "includes" }
      ],
      requireAttributesAt: [
        { selector: "img", attr: "src", value: "/images/", mode: "includes" },
        { selector: 'input[type="text"]', attr: "placeholder", value: "먹고 싶은 빵을 검색해 보세요", mode: "equals" }
      ],
    }
  },

  { id: 14, title: "고급 문제 2", image: img2 },
  { id: 15, title: "고급 문제 3", image: img3 },
];
