// src/data/problems/basic.js
import img1 from "../../assets/robot-icon.png";
import img2 from "../../assets/robot-icon.png";
import img3 from "../../assets/robot-icon.png";

export const BASIC_PROBLEMS = [
    {
        id: 1, title: "큰 제목(h1)을 활용해 보자!", image: img1,
        answerXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="170" y="110">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">BLOCKY에 오신 걸 환영해요</field>
      </block>
    </statement>
  </block>
</xml>
    `,
        rules: {
            requiredSelectors: ["h1"],
            requireTextAt: [
                { selector: "h1", text: "BLOCKY에 오신 걸 환영해요", mode: "equals" }
            ]
        }
    },
    {
        id: 2, title: "바깥 여백에 대해 알아보자!", image: img2,
        answerXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="230" y="50">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">바깥 여백에 대해 알아보자!</field>
      </block>
    </statement>
    <statement name="STYLE">
      <block type="style_margin_side">
        <field name="SIDE">all</field>
        <field name="VALUE">16px</field>
      </block>
    </statement>
  </block>
</xml>
    `,
        rules: {
            requiredSelectors: ["h1"],
            requireTextAt: [
                { selector: "h1", text: "바깥 여백에 대해 알아보자!", mode: "equals" }
            ],
            requireInlineStylesAt: [
                // { selector: "div", prop: "margin-top", value: "16px", mode: "includes" },
                // { selector: "div", prop: "margin-right", value: "16px", mode: "includes" },
                // { selector: "div", prop: "margin-bottom", value: "16px", mode: "includes" },
                // { selector: "div", prop: "margin-left", value: "16px", mode: "includes" }
                { selector: "div", prop: "margin", value: "16px", mode: "includes" }
            ]
        }
    },
    {
        id: 3, title: "버튼을 만들어보자!", image: img3,
        answerXml: `
        <xml xmlns="https://developers.google.com/blockly/xml">
  <block type="container_box" x="250" y="70">
    <statement name="CONTENT">
      <block type="text_title">
        <field name="TITLE">버튼을 만들어보자!</field>
        <next>
          <block type="normal_button">
            <field name="LABEL">버튼 1</field>
            <next>
              <block type="normal_button">
                <field name="LABEL">버튼 2</field>
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
            requiredSelectors: ["h1", "button", "button:nth-of-type(2)"],
            requireTextAt: [
                { selector: "h1", text: "버튼을 만들어보자!", mode: "equals" },
                { selector: "button", text: "버튼 1", mode: "equals" },
                { selector: "button", text: "버튼 2", mode: "equals" }
            ]
        }
    },
];
