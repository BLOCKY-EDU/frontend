import * as Blockly from 'blockly';

/**
 * 🎨 색상 사각형이 보이는 드롭다운 필드
 */
export class ColourPreviewDropdown extends Blockly.FieldDropdown {
  getOptions() {
    return [
      ['하양', '#ffffff'],
      ['노랑', '#FFEE95'],
      ['하늘', '#C9E2F1'],
      ['핑크', '#FFCDD6'],
      ['회색', '#E0E0E0']
    ];
  }

  getText_() {
    const color = this.getValue();
    return String.fromCodePoint(0x25A0) + ' ' + color; // ■ #색상코드
  }

  updateTextNode_() {
    if (!this.textElement_) return;
    const color = this.getValue();
    this.textElement_.textContent = '';

    const colorSquare = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    colorSquare.setAttribute("width", "16");
    colorSquare.setAttribute("height", "16");
    colorSquare.setAttribute("fill", color);
    colorSquare.setAttribute("rx", "2");
    colorSquare.setAttribute("ry", "2");

    while (this.textElement_.firstChild) {
      this.textElement_.removeChild(this.textElement_.firstChild);
    }
    this.textElement_.appendChild(colorSquare);
  }
}

/**
 * 블록리 엔진에 필드를 등록
 */
export function registerCustomFields() {
  Blockly.fieldRegistry.register('field_colour_preview', ColourPreviewDropdown);
}