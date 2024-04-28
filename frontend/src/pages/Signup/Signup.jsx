import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Make sure to update the CSS file based on the new styles provided below
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUpload, faTrashAlt} from '@fortawesome/free-solid-svg-icons';


const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // State for tracking uploading status of image
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/signup', {
            username,
            email,
            password,
            bio,
            profilePicture
        }).then((res) => {
            setMsg(res.data);
            // Clear form fields by resetting state variables
            setUsername('');
            setEmail('');
            setPassword('');
            setBio('');
            setProfilePicture(null)
            // navigate('/login')
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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        console.log('file: ', file)
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', `${import.meta.env.VITE_PRESET_NAME}`);
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData);
            setProfilePicture(response.data.secure_url);
            console.log('pic uploaded to cloudinary: ', profilePicture)
            setIsUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    return (
        <div className="signup-container">
            {error && <div className="error-message">{error}</div>}
            {msg && <div className='success_msg'>{msg}</div>}
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
                <div className="form-group">
                <div className="image-upload-container">
                    {profilePicture ? (
                        <div className="image-container">
                            <img src={profilePicture} alt="Profile" />
                            <button className="delete-button" onClick={() => setProfilePicture(null)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <label className="image-upload-label">
                                <input type="file" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                                <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                            </label>
                        </>
                    )}
                    {isUploading && (
                        <div className="loading-container">
                            <FontAwesomeIcon icon={faUpload} spin />
                        </div>
                    )}
                </div>
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
