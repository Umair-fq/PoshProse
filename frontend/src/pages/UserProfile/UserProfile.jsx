import React, { useContext, useState } from 'react';
import { UserContext } from '../../Components/Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import BackButton from '../../Components/BackButton/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import profileIcon from '../../assets/profileicon.gif'
import './UserProfile.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, setUser, login} = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || profileIcon);
    const [username, setUsername] = useState(user.username || '');
    const [bio, setBio] = useState(user.bio || '');
    const [isPublicProfile, setIsPublicProfile] = useState(user.isPublicProfile);
    const [isUploading, setIsUploading] = useState(false); // State for tracking uploading status of image
    const navigate = useNavigate();

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', `${import.meta.env.VITE_PRESET_NAME}`);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData);
            setProfilePicture(response.data.secure_url);
            setIsUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    const handleDeleteImage = () => {
        setProfilePicture(profileIcon);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.patch(`http://localhost:8080/update/userprofile/${user._id}`, {
            username, 
            bio, 
            profilePicture, 
            isPublicProfile
        },
        {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        })
        .then((res) => {
            setUser(res.data.user)
            setEditMode(false);
        })
        .catch(err => {
            console.error('Update error:', err);
        });
    };

    return (
        <>
            <Navbar />
            <BackButton />
            <div className="profile-container">
                <div className="profile-visibility">
                    {editMode ? (
                        <div className="profile-toggle">
                            <input type="checkbox" id="toggle" checked={isPublicProfile} onChange={() => setIsPublicProfile(!isPublicProfile)}/>
                            <label htmlFor="toggle">Public</label>
                        </div>
                    ) : (
                        <p className={isPublicProfile ? 'public' : 'private'}>{isPublicProfile ? 'Public Profile' : 'Private Profile'}</p>
                    )}
                </div>
                <div className="profile-header">
                    <div className="profile-image-container">
                        <img src={profilePicture} alt="Profile" className="profile-image"/>
                        {editMode && (
                            <>
                                <label className="image-upload-label">
                                    <input type="file" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                                </label>
                                <button className="delete-button" onClick={handleDeleteImage}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                                {isUploading && (
                                    <div className="loading-container">
                                        <FontAwesomeIcon icon={faUpload} spin />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {editMode ? (
                        <>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="text-input"/>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bio-input"/>
                        </>
                    ) : (
                        <>
                            <h1>{username}</h1>
                            <p>{bio}</p>
                        </>
                    )}
                    <button onClick={editMode ? handleSubmit : () => setEditMode(!editMode)} className="edit-button">
                        {editMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
