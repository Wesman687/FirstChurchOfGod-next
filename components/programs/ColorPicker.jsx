import React, { useState } from 'react';

export const ColorPicker = ({ onColorSelect, defaultColor }) => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#ff00ff', '#000000', '#FFFFFF', '#e05100', '#ffb647'];
  const [selectedColor, setSelectedColor] = useState(defaultColor); // Default color

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSelect(color); // Call the parent function to handle the color change
  };

  return (
    <div style={{ display: 'flex', gap: '15px', alignContent: 'center', justifyContent: 'center'}}>
      {colors.map((color) => (
        <div
          key={color}
          className='color-picker-container'
          onClick={() => handleColorClick(color)}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: color,
            cursor: 'pointer',
            border: selectedColor === color ? '2px solid red' : 'none', // Highlight selected color
          }}
        />
      ))}
    </div>
  );
};