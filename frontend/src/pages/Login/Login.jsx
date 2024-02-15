import React, { useContext, useState } from 'react';
import axios from 'axios';
import './Login.css'; // Make sure to update the CSS file based on the new styles provided below
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../Components/Context/UserContext';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const {login} = useContext(UserContext);


    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/user/login', {
            email,
            password,
        }).then(response => {
            // console.log("invoked")
            login(response.data.user)
            // console.log(response.data.user)
            localStorage.setItem('userToken', response.data.accessToken);
            navigate('/')
        }).catch(error => {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred. Please try again.')
            }
            // console.error('Login Error', error);
        });
    };

    return (
        <div className="signup-container">
            <h1 className="signup-title">Login</h1>
            {/* Display error message if it exists */}
            {error && <div className="error-message">{error}</div>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" id="email" name="email" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <input type = {showPassword ? "text": "password"} id="password" name="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"/>
                    <button type='button' onClick={() => setShowPassword(!showPassword)} className="show-password-button">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>

                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="login-redirect">
                    Not Registered?
                    <Link to="/signup"><button className="btn btn-secondary">Signup</button></Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
