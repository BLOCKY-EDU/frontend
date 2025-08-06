import * as Blockly from 'blockly';

export function registerNavigationBlocks() {
  Blockly.Blocks['navigation_button'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이동 버튼")
        .appendField(new Blockly.FieldTextInput("www.naver.com"), "LINK")
        .appendField("버튼 이름")
        .appendField(new Blockly.FieldTextInput("GO"), "LABEL");
      this.setColour("#D1B3FF");
      this.setTooltip("클릭 시 특정 링크로 이동하는 버튼입니다.");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    }
  };
}

export function getNavigationTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      {
        kind: "block",
        type: "navigation_button"
      }
    ]
  };
}

export function parseNavigationXmlToJSX(xmlText) {
  //  deep import 대신, 이 방식만! 
  const dom = parser.parseFromString(xml, 'text/xml');
  const block = dom.firstChild;

  const labelField = block.getElementsByTagName('field').namedItem('LABEL');
  const linkField = block.getElementsByTagName('field').namedItem('LINK');

  const label = labelField?.textContent || '이동';
  let rawHref = linkField?.textContent || '';

  rawHref = rawHref.trim();
  if (rawHref.startsWith('/')) rawHref = rawHref.slice(1);
  const href = /^https?:\/\//i.test(rawHref) ? rawHref : `https://${rawHref}`;

  return (
    <button
      key={`nav-btn-${Math.random()}`}
      type="button"
      onClick={e => {
        e.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
      }}
      style={{
        padding: '10px 16px',
        margin: '8px 0',
        borderRadius: 4,
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  );
}
