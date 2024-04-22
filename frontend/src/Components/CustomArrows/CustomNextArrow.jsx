import React from 'react';

const CustomNextArrow = ({ onClick }) => {
  return (
    <div className="custom-arrow custom-next" onClick={onClick}>
      <i className="fas fa-chevron-right"></i>
    </div>
  );
};

export default CustomNextArrow;
