import React from 'react';
import './TagsFilter.css'; // Ensure you link the CSS file correctly

const TagsFilter = ({ availableTags, selectedTags, onTagToggle }) => {
  return (
    <div className="tags-filter-container">
      {availableTags.map(tag => (
        <div key={tag} className="tag-item">
          <input
            id={tag}
            type="checkbox"
            checked={selectedTags.includes(tag)}
            onChange={() => onTagToggle(tag)}
            className="tag-checkbox"
          />
          <label htmlFor={tag} className="tag-label">{tag}</label>
        </div>
      ))}
    </div>
  );
};

export default TagsFilter;
