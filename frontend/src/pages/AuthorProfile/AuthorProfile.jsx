import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import BackButton from '../../Components/BackButton/BackButton';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AuthorProfile.css';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';
import profileIcon from '../../assets/profileicon.gif'; // Import the default profile icon

const AuthorProfile = () => {
    const [author, setAuthor] = useState(null);
    const { authorId } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/blog/author/${authorId}`)
            .then(response => {
                setAuthor(response.data);
                console.log('data ', response.data);
            })
            .catch(err => console.error(err));
    }, [authorId]);

    return (
        <>
            <Navbar />
            <BackButton />
            {
                author ? (
                    <>
                        {
                            author.user.isPublicProfile ? (
                                <div className="profile-container">
                                    <div className="profile-header">
                                        <div className="profile-image-container">
                                            <img
                                                src={author.user.profilePicture ? author.user.profilePicture : profileIcon}
                                                alt="Profile"
                                                className="profile-image"
                                            />
                                        </div>
                                        <>
                                            <h1>{author.user.username}</h1>
                                            <p>{author.user.bio}</p>
                                        </>
                                    </div>
                                </div>
                            ) : (
                                <h1>Author profile is private</h1>
                            )
                        }
                    </>
                ) : (
                    <>
                        <LoadingIndicator />
                    </>
                )
            }
        </>
    );
};

export default AuthorProfile;
