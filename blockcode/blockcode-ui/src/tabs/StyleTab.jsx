import * as Blockly from 'blockly';
import { registerCustomFields } from '../blocks/CustomFields';
import { FieldColour } from '@blockly/field-colour';

/* 필드 등록 (한 번만) */
registerCustomFields();

const styleBlocks = [
  { type: 'style_margin', label: '바깥 여백', style: { margin: '20px' } },
  { type: 'style_padding', label: '안쪽 여백', style: { padding: '16px' } },
  { type: 'style_background', label: '배경 색상', style: null, hasColor: true },
  { type: 'style_text_center', label: '글 가운데 정렬', style: { textAlign: 'center' } },
  { type: 'style_width_full', label: '너비(%)', style: { width: '100%' } },
  { type: 'style_font_size', label: '폰트 크기', style: null }, // 추가
  { type: 'style_font_family', label: '폰트', style: null }, // 추가
  { type: 'style_flex_row', label: '가로로 나누기', style: { display: 'flex', flexDirection: 'row' } },
  { type: 'style_flex_column', label: '세로로 나누기', style: { display: 'flex', flexDirection: 'column' } },
  { type: 'style_center_align', label: '가운데 정렬 (가로/세로)', style: { justifyContent: 'center', alignItems: 'center' } },
  { type: 'style_border_radius', label: '둥근 모서리', style: { borderRadius: '8px', overflow: 'hidden' } },
  { type: 'style_border', label: '테두리 추가', style: { border: '1px solid #ccc' } },
  { type: 'style_shadow', label: '그림자 추가', style: { boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' } }
];

export const STYLE_BLOCK_TYPES = styleBlocks.map(b => b.type);

/* 1. 스타일 블록 정의 */
export function registerStyleBlocks() {
  styleBlocks.forEach(block => {
    Blockly.Blocks[block.type] = {
      init: function () {
        this.appendDummyInput().appendField(block.label);

        // 배경색 - 컬러피커
        if (block.type === 'style_background') {
          this.appendDummyInput()
            .appendField('색상 선택')
            .appendField(new FieldColour('#f5f5f5'), 'COLOR');
        }

        // 너비 퍼센트
        if (block.type === 'style_width_full') {
          this.appendDummyInput()
            .appendField('값')
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), 'PERCENT')
            .appendField('%');
        }

        // 폰트 크기
        if (block.type === 'style_font_size') {
          this.appendDummyInput()
            .appendField('크기')
            .appendField(new Blockly.FieldNumber(16, 8, 96, 1), 'SIZE')
            .appendField('px');
        }

        // 폰트 패밀리
        if (block.type === 'style_font_family') {
          this.appendDummyInput()
            .appendField('패밀리')
            .appendField(new Blockly.FieldDropdown([
              ['System(기본)', 'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Arial, sans-serif'],
              ['Serif(명조)', 'Georgia, "Times New Roman", serif'],
              ['Monospace(코드)', 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'],
              ['Nanum Gothic', '"Nanum Gothic", sans-serif'],
              ['Noto Serif KR', '"Noto Serif KR", serif']
            ]), 'FAMILY');
        }

        this.setPreviousStatement(true, STYLE_BLOCK_TYPES);
        this.setNextStatement(true, STYLE_BLOCK_TYPES);
        this.setColour('#FFEE95');
      }
    };
  });
}

/* 2. 툴박스 JSON */
export function getStyleTabToolbox() {
  return {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'style_margin' },
      { kind: 'block', type: 'style_padding' },
      { kind: 'block', type: 'style_background' },
      { kind: 'block', type: 'style_text_center' },
      { kind: 'block', type: 'style_width_full' },
      { kind: 'block', type: 'style_font_size' }, // 추가
      { kind: 'block', type: 'style_font_family' }, // 추가
      { kind: 'block', type: 'style_flex_row' },
      { kind: 'block', type: 'style_flex_column' },
      { kind: 'block', type: 'style_center_align' },
      { kind: 'block', type: 'style_border_radius' },
      { kind: 'block', type: 'style_border' },
      { kind: 'block', type: 'style_shadow' }
    ]
  };
}

/* 3. style block → style object 변환 */
export function parseStyleStatementsToStyleObj(statements) {
  const styleObj = {};
  const blocks = statements ? statements.getElementsByTagName('block') : [];

  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].getAttribute('type');

    switch (type) {
      case 'style_background': {
        const f =
          blocks[i].querySelector('field[name="COLOR"]') ||
          blocks[i].getElementsByTagName('field')[0];
        const color = f?.textContent || '#000000';
        styleObj.backgroundColor = color;
        break;
      }
      case 'style_width_full': {
        const f = blocks[i].querySelector('field[name="PERCENT"]');
        const v = Math.max(0, Math.min(100, Number(f ? f.textContent : '100')));
        styleObj.width = `${v}%`;
        break;
      }
      case 'style_font_size': {
        const f = blocks[i].querySelector('field[name="SIZE"]');
        const px = Math.max(8, Math.min(96, Number(f ? f.textContent : '16')));
        styleObj.fontSize = `${px}px`;
        styleObj.lineHeight = `${Math.round(px * 1.4)}px`;
        break;
      }
      case 'style_font_family': {
        const f = blocks[i].querySelector('field[name="FAMILY"]');
        if (f) styleObj.fontFamily = f.textContent;
        break;
      }
      case 'style_margin':
        styleObj.margin = '20px';
        break;
      case 'style_padding':
        styleObj.padding = '16px';
        break;
      case 'style_text_center':
        styleObj.textAlign = 'center';
        break;
      case 'style_flex_row':
        styleObj.display = 'flex';
        styleObj.flexDirection = 'row';
        break;
      case 'style_flex_column':
        styleObj.display = 'flex';
        styleObj.flexDirection = 'column';
        break;
      case 'style_center_align':
        styleObj.justifyContent = 'center';
        styleObj.alignItems = 'center';
        break;
      case 'style_border_radius':
        styleObj.borderRadius = '8px';
        styleObj.overflow = 'hidden';
        break;
      case 'style_border':
        styleObj.border = '1px solid #ccc';
        break;
      case 'style_shadow':
        styleObj.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';
        break;
      default:
        break;
    }
  }

  return styleObj;
}