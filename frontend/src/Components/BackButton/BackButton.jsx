import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; // Ensure you have this CSS file in the same folder

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button className="back-button" onClick={() => navigate(-1)}>
            &#8592; Back
        </button>
    );
};

export default BackButton;
