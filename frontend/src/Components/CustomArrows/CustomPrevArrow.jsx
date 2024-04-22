import React from 'react';

const CustomPrevArrow = ({ onClick }) => {
  return (
    <div className="custom-arrow custom-prev" onClick={onClick}>
      <i className="fas fa-chevron-left"></i>
    </div>
  );
};

export default CustomPrevArrow;
