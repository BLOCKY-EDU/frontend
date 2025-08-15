// src/tabs/StyleTab.jsx
import * as Blockly from 'blockly';
import { registerCustomFields } from '../blocks/CustomFields';
import { FieldColour } from '@blockly/field-colour';

/* 필드 등록 (한 번만) */
registerCustomFields();

/**
 * 핵심 블록
 * - style_width / style_height : 자유 입력
 * - style_margin_side / style_padding_side : 방향 + 값
 * - style_border_radius_side : 코너(모두/좌상/우상/우하/좌하) + 값
 * - style_text_align : left/center/right
 * - style_shadow_custom : x/y/blur/color
 * + 기타 기존 유틸 블록 유지
 */
const styleBlocks = [
  { type: 'style_width', label: '너비(직접 입력)' },
  { type: 'style_height', label: '높이(직접 입력)' },
  { type: 'style_margin_side', label: '바깥 여백(margin)' },
  { type: 'style_padding_side', label: '안쪽 여백(padding)' },

  { type: 'style_border_radius_side', label: '둥근 모서리(코너별)' },
  { type: 'style_text_align', label: '텍스트 정렬' },
  { type: 'style_shadow_custom', label: '그림자(직접 설정)' },

  { type: 'style_justify_content', label: '가로 정렬(컨테이너)' },
  { type: 'style_align_items', label: '세로 정렬(컨테이너)' },
  { type: 'style_gap', label: '사이 간격(gap)' },

  { type: 'style_border_side', label: '테두리(방향별)' },

  // (선택) 고정 버전들 — 필요 없으면 툴박스에서 빼도 됨
  { type: 'style_margin', label: '바깥 여백(고정)', style: { margin: '20px' } },
  { type: 'style_padding', label: '안쪽 여백(고정)', style: { padding: '16px' } },
  { type: 'style_background', label: '배경 색상' },
  { type: 'style_text_center', label: '글 가운데 정렬' },
  { type: 'style_width_full', label: '너비(%)' },
  { type: 'style_font_size', label: '폰트 크기' },
  { type: 'style_font_family', label: '폰트' },
  { type: 'style_flex_row', label: '가로로 정렬' },
  { type: 'style_flex_column', label: '세로로 정렬' },
  { type: 'style_center_align', label: '가운데 정렬 (가로/세로)' },
  { type: 'style_border_radius', label: '둥근 모서리(고정)' },
  { type: 'style_border', label: '테두리 추가' },
  { type: 'style_shadow', label: '그림자 추가(고정)' },
];

export const STYLE_BLOCK_TYPES = styleBlocks.map(b => b.type);

/* 1) 블록 정의 */
export function registerStyleBlocks() {
  styleBlocks.forEach((def) => {
    Blockly.Blocks[def.type] = {
      init: function () {
        const blockType = this.type;
        this.appendDummyInput().appendField(def.label);

        // 너비/높이 자유 타이핑
        if (blockType === 'style_width') {
          this.appendDummyInput()
            .appendField('값')
            .appendField(new Blockly.FieldTextInput('auto'), 'WIDTH'); // e.g. 100%, 320px, auto
        }
        if (blockType === 'style_height') {
          this.appendDummyInput()
            .appendField('값')
            .appendField(new Blockly.FieldTextInput('auto'), 'HEIGHT'); // e.g. 240px, auto, fit-content
        }

        if (blockType === 'style_border_side') {
          const SIDE_OPTIONS = [
            ['모두', 'all'],
            ['왼쪽', 'left'],
            ['오른쪽', 'right'],
            ['위', 'top'],
            ['아래', 'bottom'],
          ];
          this.appendDummyInput()
            .appendField('방향')
            .appendField(new Blockly.FieldDropdown(SIDE_OPTIONS), 'SIDE')
            .appendField('굵기')
            .appendField(new Blockly.FieldTextInput('1px'), 'WIDTH')         // 1 / 1px / 0.1rem …
            .appendField('스타일')
            .appendField(new Blockly.FieldDropdown([
              ['실선', 'solid'],
              ['점선', 'dotted'],
              ['파선', 'dashed'],
              ['이중선', 'double'],
              ['없음', 'none'],
            ]), 'STYLE');

          this.appendDummyInput()
            .appendField('색상')
            .appendField(new FieldColour('#cccccc'), 'COLOR');
        }

        // margin / padding : 방향 + 값
        if (blockType === 'style_margin_side' || blockType === 'style_padding_side') {
          const SIDE_OPTIONS = [
            ['모두', 'all'],
            ['왼쪽', 'left'],
            ['오른쪽', 'right'],
            ['위', 'top'],
            ['아래', 'bottom'],
          ];
          this.appendDummyInput()
            .appendField('방향')
            .appendField(new Blockly.FieldDropdown(SIDE_OPTIONS), 'SIDE')
            .appendField('값')
            .appendField(new Blockly.FieldTextInput('16px'), 'VALUE'); // e.g. 8px, 1rem
        }

        // 둥근 모서리(코너별) : 코너 + 값
        if (blockType === 'style_border_radius_side') {
          const CORNER_OPTIONS = [
            ['모두', 'all'],
            ['왼쪽 위', 'tl'],
            ['오른쪽 위', 'tr'],
            ['오른쪽 아래', 'br'],
            ['왼쪽 아래', 'bl'],
          ];
          this.appendDummyInput()
            .appendField('코너')
            .appendField(new Blockly.FieldDropdown(CORNER_OPTIONS), 'CORNER')
            .appendField('값')
            .appendField(new Blockly.FieldTextInput('8px'), 'RADIUS'); // e.g. 8px, 1rem
        }

        // 텍스트 정렬
        if (blockType === 'style_text_align') {
          const ALIGN = [
            ['왼쪽', 'left'],
            ['가운데', 'center'],
            ['오른쪽', 'right'],
          ];
          this.appendDummyInput()
            .appendField('정렬')
            .appendField(new Blockly.FieldDropdown(ALIGN), 'ALIGN');
        }

        // 커스텀 그림자
        if (blockType === 'style_shadow_custom') {
          this.appendDummyInput()
            .appendField('X')
            .appendField(new Blockly.FieldTextInput('0'), 'X')
            .appendField('Y')
            .appendField(new Blockly.FieldTextInput('2px'), 'Y')
            .appendField('Blur')
            .appendField(new Blockly.FieldTextInput('4px'), 'BLUR');
          this.appendDummyInput()
            .appendField('색상')
            .appendField(new FieldColour('#000000'), 'COLOR'); // 불투명 검정 → 보통은 rgba 추천
        }

        // 배경색
        if (blockType === 'style_background') {
          this.appendDummyInput()
            .appendField('색상')
            .appendField(new FieldColour('#f5f5f5'), 'COLOR');
        }

        // 너비 퍼센트
        if (blockType === 'style_width_full') {
          this.appendDummyInput()
            .appendField('값')
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), 'PERCENT')
            .appendField('%');
        }

        // 폰트 크기
        if (blockType === 'style_font_size') {
          this.appendDummyInput()
            .appendField('크기')
            .appendField(new Blockly.FieldNumber(16, 8, 96, 1), 'SIZE')
            .appendField('px');
        }

        // 폰트 패밀리
        if (blockType === 'style_font_family') {
          this.appendDummyInput()
            .appendField('패밀리')
            .appendField(new Blockly.FieldDropdown([
              ['System(기본)', 'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Arial, sans-serif'],
              ['Serif(명조)', 'Georgia, "Times New Roman", serif'],
              ['Monospace(코드)', 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'],
              ['Nanum Gothic', '"Nanum Gothic", sans-serif'],
              ['Noto Serif KR', '"Noto Serif KR", serif'],
            ]), 'FAMILY');
        }

        // 가로 정렬(컨테이너) → justify-content
        if (blockType === 'style_justify_content') {
          this.appendDummyInput()
            .appendField('정렬')
            .appendField(new Blockly.FieldDropdown([
              ['왼쪽', 'flex-start'],
              ['가운데', 'center'],
              ['오른쪽', 'flex-end'],
              ['사이 고르게', 'space-between'],
              ['공간 균등', 'space-around'],
              ['균등', 'space-evenly'],
            ]), 'JUSTIFY');
        }

        // 세로 정렬(컨테이너) → align-items
        if (blockType === 'style_align_items') {
          this.appendDummyInput()
            .appendField('정렬')
            .appendField(new Blockly.FieldDropdown([
              ['위', 'flex-start'],
              ['가운데', 'center'],
              ['아래', 'flex-end'],
              ['늘리기', 'stretch'],
              ['문자 기준선', 'baseline'],
            ]), 'ALIGN');
        }

        // 사이 간격(gap)
        if (blockType === 'style_gap') {
          this.appendDummyInput()
            .appendField('간격')
            .appendField(new Blockly.FieldTextInput('8px'), 'GAP'); // 8 / 8px / 1rem 모두 허용
        }

        this.setPreviousStatement(true, STYLE_BLOCK_TYPES);
        this.setNextStatement(true, STYLE_BLOCK_TYPES);
        this.setColour('#FFEE95');
      }
    };
  });
}

/* 2) 툴박스 JSON */
export function getStyleTabToolbox() {
  return {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'style_width' },
      { kind: 'block', type: 'style_height' },
      { kind: 'block', type: 'style_margin_side' },
      { kind: 'block', type: 'style_padding_side' },

      { kind: 'block', type: 'style_border_radius_side' },
      { kind: 'block', type: 'style_text_align' },
      { kind: 'block', type: 'style_shadow_custom' },

      { kind: 'block', type: 'style_flex_row' },
      { kind: 'block', type: 'style_flex_column' },
      { kind: 'block', type: 'style_justify_content' },
      { kind: 'block', type: 'style_align_items' },
      { kind: 'block', type: 'style_gap' },

      { kind: 'block', type: 'style_border_side' },

      // 필요 시 유지
      // { kind: 'block', type: 'style_margin' },
      // { kind: 'block', type: 'style_padding' },
      { kind: 'block', type: 'style_background' },
      // { kind: 'block', type: 'style_text_center' },
      { kind: 'block', type: 'style_width_full' },
      { kind: 'block', type: 'style_font_size' },
      { kind: 'block', type: 'style_font_family' },
      { kind: 'block', type: 'style_flex_row' },
      { kind: 'block', type: 'style_flex_column' },
      // { kind: 'block', type: 'style_center_align' },
      // { kind: 'block', type: 'style_border_radius' },
      // { kind: 'block', type: 'style_border' },
      // { kind: 'block', type: 'style_shadow' },
    ],
  };
}

/* 3) style block → style object 변환 */
export function parseStyleStatementsToStyleObj(statements) {
  const styleObj = {};
  const blocks = statements ? statements.getElementsByTagName('block') : [];

  // 숫자만 오면 px 붙여주는 보정
  const normLen = (v) => {
    if (!v) return '';
    const s = String(v).trim();
    if (/(px|%|rem|em|vh|vw|auto|fit-content|min-content|max-content)$/i.test(s)) return s;
    if (/^-?\d+(\.\d+)?$/.test(s)) return s + 'px';
    return s;
  };
  // 그림자용: px 단위 보정 (auto 등 불가)
  const normPx = (v, fallback = '0px') => {
    const s = String(v ?? '').trim();
    if (!s) return fallback;
    if (/(px|rem|em|vh|vw)$/i.test(s)) return s;
    if (/^-?\d+(\.\d+)?$/.test(s)) return s + 'px';
    return fallback;
  };

  // 방향/코너 누적 버퍼 (longhand만 출력)
  const marginSides = { top: null, right: null, bottom: null, left: null, all: null };
  const paddingSides = { top: null, right: null, bottom: null, left: null, all: null };
  const radiusCorners = { tl: null, tr: null, br: null, bl: null, all: null };
  const borderSides = { top: null, right: null, bottom: null, left: null, all: null };

  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].getAttribute('type');

    switch (type) {
      /* width / height */
      case 'style_width': {
        const v = blocks[i].querySelector('field[name="WIDTH"]')?.textContent || '';
        const val = normLen(v);
        if (val && val !== 'auto') styleObj.width = val;
        break;
      }
      case 'style_height': {
        const v = blocks[i].querySelector('field[name="HEIGHT"]')?.textContent || '';
        const val = normLen(v);
        if (val && val !== 'auto') styleObj.height = val;
        break;
      }

      case 'style_border_side': {
        const side = blocks[i].querySelector('field[name="SIDE"]')?.textContent || 'all';
        const rawW = blocks[i].querySelector('field[name="WIDTH"]')?.textContent || '1px';
        const style = blocks[i].querySelector('field[name="STYLE"]')?.textContent || 'solid';
        const color = blocks[i].querySelector('field[name="COLOR"]')?.textContent || '#cccccc';

        const w = normPx(rawW, '1px');             // px 보정
        const value = `${w} ${style} ${color}`;

        if (side === 'all') borderSides.all = value;
        else if (['left', 'right', 'top', 'bottom'].includes(side)) borderSides[side] = value;
        break;
      }

      /* margin / padding (방향 + 값) */
      case 'style_margin_side':
      case 'style_padding_side': {
        const isMargin = (type === 'style_margin_side');
        const side = blocks[i].querySelector('field[name="SIDE"]')?.textContent || 'all';
        const raw = blocks[i].querySelector('field[name="VALUE"]')?.textContent || '';
        const val = normLen(raw);
        if (!val) break;

        const buf = isMargin ? marginSides : paddingSides;
        if (side === 'all') buf.all = val;
        else if (['left', 'right', 'top', 'bottom'].includes(side)) buf[side] = val;
        break;
      }

      // (옵션) 고정 margin/padding
      case 'style_margin':
        marginSides.all = '20px';
        break;
      case 'style_padding':
        paddingSides.all = '16px';
        break;

      /* 둥근 모서리(코너별) */
      case 'style_border_radius_side': {
        const corner = blocks[i].querySelector('field[name="CORNER"]')?.textContent || 'all';
        const raw = blocks[i].querySelector('field[name="RADIUS"]')?.textContent || '';
        const val = normLen(raw);
        if (!val) break;
        if (corner === 'all') radiusCorners.all = val;
        else if (['tl', 'tr', 'br', 'bl'].includes(corner)) radiusCorners[corner] = val;
        break;
      }
      // (옵션) 고정 전체 radius
      // case 'style_border_radius':
      //   radiusCorners.all = '8px';
      //   break;

      /* 텍스트 정렬 */
      case 'style_text_align': {
        const a = blocks[i].querySelector('field[name="ALIGN"]')?.textContent || 'left';
        styleObj.textAlign = a;
        break;
      }
      case 'style_text_center':
        styleObj.textAlign = 'center';
        break;

      case 'style_justify_content': {
        const val = blocks[i].querySelector('field[name="JUSTIFY"]')?.textContent || 'flex-start';
        styleObj.display = 'flex';                 // flex 컨테이너화
        styleObj.justifyContent = val;             // 가로축 정렬(행 기준)
        break;
      }

      case 'style_align_items': {
        const val = blocks[i].querySelector('field[name="ALIGN"]')?.textContent || 'stretch';
        styleObj.display = 'flex';                 // flex 컨테이너화
        styleObj.alignItems = val;                 // 세로축 정렬(행 기준)
        break;
      }

      case 'style_gap': {
        const raw = blocks[i].querySelector('field[name="GAP"]')?.textContent || '8px';
        styleObj.gap = normPx(raw, '8px');         // 자식 간 간격
        break;
      }

      /* 그림자 */
      case 'style_shadow_custom': {
        const x = normPx(blocks[i].querySelector('field[name="X"]')?.textContent, '0px');
        const y = normPx(blocks[i].querySelector('field[name="Y"]')?.textContent, '2px');
        const blur = normPx(blocks[i].querySelector('field[name="BLUR"]')?.textContent, '4px');
        const color = blocks[i].querySelector('field[name="COLOR"]')?.textContent || 'rgba(0,0,0,0.2)';
        styleObj.boxShadow = `${x} ${y} ${blur} ${color}`;
        break;
      }
      case 'style_shadow':
        styleObj.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';
        break;

      /* 기타 스타일 */
      case 'style_background': {
        const color = blocks[i].querySelector('field[name="COLOR"]')?.textContent || '#000000';
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
      case 'style_flex_row':
        styleObj.display = 'flex';
        styleObj.flexDirection = 'row';
        break;
      case 'style_flex_column':
        styleObj.display = 'flex';
        styleObj.flexDirection = 'column';
        break;
      case 'style_center_align':
        styleObj.display = 'flex';
        styleObj.justifyContent = 'center';
        styleObj.alignItems = 'center';
        break;
      case 'style_border':
        styleObj.border = '1px solid #ccc';
        break;
      default:
        break;
    }
  }

  // 최종 merge: longhand만 출력 (shorthand 사용 안 함)
  const applySides = (buf, kind) => {
    const map = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' };
    const any = buf.top || buf.right || buf.bottom || buf.left || buf.all;
    if (!any) return;
    for (const s of ['top', 'right', 'bottom', 'left']) {
      const val = buf[s] != null ? buf[s] : buf.all;
      if (val != null) styleObj[kind + map[s]] = val;
    }
  };
  applySides(marginSides, 'margin');
  applySides(paddingSides, 'padding');

  // 코너 radius 머지
  const cornerMap = {
    tl: 'borderTopLeftRadius',
    tr: 'borderTopRightRadius',
    br: 'borderBottomRightRadius',
    bl: 'borderBottomLeftRadius',
  };
  if (radiusCorners.tl || radiusCorners.tr || radiusCorners.br || radiusCorners.bl || radiusCorners.all) {
    for (const k of ['tl', 'tr', 'br', 'bl']) {
      const val = radiusCorners[k] != null ? radiusCorners[k] : radiusCorners.all;
      if (val != null) styleObj[cornerMap[k]] = val;
    }
  }

  // margin/padding 처럼 마지막에 merge
  {
    const map = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' };
    const any =
      borderSides.top || borderSides.right || borderSides.bottom || borderSides.left || borderSides.all;
    if (any) {
      for (const s of ['top', 'right', 'bottom', 'left']) {
        const val = borderSides[s] != null ? borderSides[s] : borderSides.all;
        if (val != null) styleObj['border' + map[s]] = val;
      }
    }
  }

  return styleObj;
}
