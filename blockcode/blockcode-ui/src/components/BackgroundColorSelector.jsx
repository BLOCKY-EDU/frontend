import React from 'react';

const colorOptions = [
  { label: '화이트', value: '#ffffff' },
  { label: '연노랑', value: '#FFF9C4' },
  { label: '연핑크', value: '#F8BBD0' },
  { label: '연민트', value: '#B2EBF2' },
  { label: '연보라', value: '#E1BEE7' },
];

export default function BackgroundColorSelector({ selectedColor, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      {colorOptions.map((color) => (
        <button
          key={color.value}
          onClick={() => onChange(color.value)}
          style={{
            backgroundColor: color.value,
            width: 40,
            height: 40,
             borderRadius: '50%',
            border: selectedColor === color.value ? '3px solid #000' : '1px solid #ccc',
            cursor: 'pointer',
          }}
          title={color.label}
        />
      ))}
    </div>
  );
}
