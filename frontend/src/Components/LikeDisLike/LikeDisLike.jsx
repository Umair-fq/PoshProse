import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import './LikeDisLike.css'; // Import CSS file for styling

const LikeDisLike = ({ blogId }) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeColor, setLikeColor] = useState('');
    const [dislikeColor, setDislikeColor] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    const { user } = useContext(UserContext);

    const fetchLikesAndDislikes = () => {
        try {
            axios.get(`http://localhost:8080/api/blog/${blogId}`)
                .then((res) => {
                    if (res.data.likes?.length > 0) {
                        setLikeCount(res.data.likes.length);
                    }
                    if (res.data.dislikes?.length > 0) {
                        setDislikeCount(res.data.dislikes.length);
                    }
                    if (res.data.likes?.includes(user._id)) {
                        setLiked(true);
                    }
                    if (res.data.dislikes?.includes(user._id)) {
                        setDisliked(true);
                    }
                })
                .catch(error => console.error('Error in fetching blog: ', error));
        } catch (error) {
            console.error('Error in fetching blog: ', error);
        }
    };
    
    useEffect(() => {
        // Fetch likes and dislikes when component mounts
        fetchLikesAndDislikes();
    }, [blogId, user]); // Update when blogId or user changes

    useEffect(() => {
        // Set initial button colors
        setLikeColor(liked ? 'green' : '');
        setDislikeColor(disliked ? 'red' : '');
    }, [liked, disliked]);

    const handleLike = () => {
        axios.put(`http://localhost:8080/api/blog/like/${blogId}`, {
            likes: user._id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
            .then(() => {
                setLiked(!liked);
                setDisliked(false); // If user liked, remove dislike
                setLikeColor(liked ? '' : 'green'); // Toggle button color
                setDislikeColor(''); // Reset dislike button color
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                setDislikeCount(disliked ? dislikeCount - 1 : dislikeCount);
            })
            .catch(err => console.error(err));
    };

    const handleDislike = () => {
        axios.put(`http://localhost:8080/api/blog/dislike/${blogId}`, {
            disLikes: user._id // Corrected property name to "disLikes"
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
            .then(() => {
                setLiked(false); // If user disliked, remove like
                setDisliked(!disliked);
                setLikeColor(''); // Reset like button color
                setDislikeColor(disliked ? '' : 'red'); // Toggle button color
                setLikeCount(liked ? likeCount - 1 : likeCount);
                setDislikeCount(disliked ? dislikeCount - 1 : dislikeCount + 1);
            })
            .catch(err => console.error(err));
    };
    

    return (
        <div className="like-dislike-container">
            <button className={`like-dislike-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
                <FontAwesomeIcon icon={faThumbsUp} className="like-dislike-icon" />
                <span className="like-dislike-count">{likeCount}</span> 
            </button>
            <button className={`like-dislike-button ${disliked ? 'disliked' : ''}`} onClick={handleDislike}>
                <FontAwesomeIcon icon={faThumbsDown} className="like-dislike-icon" />
                <span className="like-dislike-count">{dislikeCount}</span> 
            </button>
        </div>
    );
};

export default LikeDisLike;
