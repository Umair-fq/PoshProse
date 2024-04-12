import React from 'react';
import './LoadingIndicator.css'; // Make sure to create this CSS file

const LoadingIndicator = () => {
    return (
        <div className="loading-wrapper">
            <div className="loading-circle"></div>
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default LoadingIndicator;
