import React, { useContext, useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../Components/Context/UserContext';
import GoogleButton from 'react-google-button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/login', {
            email,
            password,
        }).then(response => {
            login(response.data.user);
            localStorage.setItem('userToken', response.data.accessToken);
            navigate('/');
        }).catch(error => {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        });
    };

    const handleSignIn = () => {
         window.location.href = 'http://localhost:8080/auth/google'
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h1 className="login-title">Login to Your Account</h1>
                {error && <div className="login-error">{error}</div>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" id="email" name="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='button' onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <div className="google-button-container">
                        <GoogleButton onClick={handleSignIn} />
                    </div>
                    <div className="redirect-section">
                        <span>Not Registered?</span> <Link to="/signup">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
