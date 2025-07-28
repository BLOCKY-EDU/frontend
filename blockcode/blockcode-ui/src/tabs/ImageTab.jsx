// ImageTab.jsx
import React from 'react';
import * as Blockly from 'blockly';

export function registerImageBlocks() {
  Blockly.Blocks['insert_image'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("이미지 넣기")
        //에시 이미지 없을 때
        // .appendField(new Blockly.FieldTextInput("주소 입력"), "SRC");
        //예시 이미지 링크 
        .appendField(new Blockly.FieldTextInput("https://fastly.picsum.photos/id/177/300/300.jpg?hmac=iqXyonsAi67PWRf_09YhPkmp81Thf9Pch6MNvOkGiGo"),"SRC");
      this.setColour("#91D8C6");
    }
  };

  Blockly.Blocks['insert_video'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("영상 넣기")
        //예시 영상 없는 코드
        // .appendField(new Blockly.FieldTextInput("주소 입력"), "SRC");
        //예시 영상 
        .appendField(new Blockly.FieldTextInput("https://www.w3schools.com/html/mov_bbb.mp4"), "SRC");

      this.setColour("#91D8C6");
    }
  };

  Blockly.Blocks['youtube_link'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("유튜브 연결")
        .appendField(new Blockly.FieldTextInput("주소 입력"), "SRC");
      this.setColour("#91D8C6");
    }
  };
}

export function getImageTabToolbox() {
  return {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "insert_image" },
      { kind: "block", type: "insert_video" },
      { kind: "block", type: "youtube_link" }
    ]
  };
}

export function parseImageXmlToJSX(xml) {
  if (!xml) return null;
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, 'text/xml');
  const blocks = dom.getElementsByTagName('block');

  const output = [];
  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].getAttribute('type');
    const src = blocks[i].getElementsByTagName('field')[0]?.textContent;

    if (type === 'insert_image') {
      output.push(<img key={`img-${i}`} src={src} alt="image" style={{ maxWidth: '100%', marginBottom: 10 }} />);
    } else if (type === 'insert_video') {
      output.push(<video key={`vid-${i}`} src={src} controls style={{ maxWidth: '100%', marginBottom: 10 }} />);
    } else if (type === 'youtube_link') {
        let url = src;
        const match = src.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const videoId = match ? match[1] : null;
      
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId}`;
        }
      
        output.push(
          <iframe
            key={`yt-${i}`}
            width="100%"
            height="315"
            src={url}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ marginBottom: 10 }}
          />
        );
            
    }
  }
  return output;
}
