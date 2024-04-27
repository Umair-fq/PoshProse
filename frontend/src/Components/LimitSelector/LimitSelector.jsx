import React from 'react';
import './LimitSelector.css';

const LimitSelector = ({ value, onChange }) => {
  return (
    <div className="limit-selector">
      <label htmlFor="limit" className="limit-label">Items per page:</label>
      <select id="limit" className="limit-select" value={value} onChange={onChange}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
    </div>
  );
};

export default LimitSelector;
