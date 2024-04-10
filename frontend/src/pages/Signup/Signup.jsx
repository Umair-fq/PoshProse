import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Make sure to update the CSS file based on the new styles provided below
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/signup', {
            username,
            email,
            password,
            bio
        }).then(() => {
            navigate('/login')
            // console.log('Signup Success', response.data);
        }).catch(error => {
            // console.error('Signup Error', error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred. Please try again.')
            }
        });
    };

    return (
        <div className="signup-container">
            {error && <div className="error-message">{error}</div>}
            <h1 className="signup-title">Signup</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" id="username" name="username" placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <input type="email" id="email" name="email" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <input type = {showPassword ? "text": "password"} id="password" name="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"/>
                    <button type='button' onClick={() => setShowPassword(!showPassword)} className="show-password-button">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>

                </div>
                <div className="form-group">
                    <textarea name="bio" id="bio" placeholder='Write your bio' value={bio} onChange={(e) => setBio(e.target.value)} className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
                <div className="login-redirect">
                    Already Registered?
                    <Link to="/login"><button className="btn btn-secondary">Login</button></Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
