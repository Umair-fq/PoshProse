import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './CommentSection.css'
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
const CommentSection = ({ blogId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();


    const fetchComments = () => {
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
            .then(res => setComments(res.data.comments))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        // Fetch comments when component mounts
        fetchComments();
    }, [blogId]); // Dependency array ensures this effect runs when blogId changes

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(
            `http://localhost:8080/api/blog/addComment/${blogId}`,
            { comment },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            }
        )
            .then(() => {
                // After successfully adding comment, fetch updated comments
                fetchComments();
                setComment(''); // Clear comment input field
            })
            .catch(err => console.error(err));
    };

    const handleToggleOptionsMenu = (index) => {
        const updatedComments = [...comments];
        updatedComments[index].optionsMenu = !updatedComments[index].optionsMenu;
        setComments(updatedComments)
    }

    const handleDelete = (index) => {
        axios.delete(`http://localhost:8080/api/blog/${blogId}/delete/${index}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        })
        .then(() => {
            // Remove the deleted comment from the state
            const updatedComments = [...comments];
            updatedComments.splice(index, 1);
            setComments(updatedComments);
        })
        .catch(err => console.error(err))
    }
    
    

    return (
        <div className='comment-section'>
            <h2 className="section-title">Comments</h2>
            <div className="comment-input">
                <textarea
                    name="comment"
                    id="comment"
                    cols="30"
                    rows="10"
                    placeholder='Enter your comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="comment-textarea"
                ></textarea>
                <button onClick={handleSubmit} className="comment-button">Add</button>
            </div>
            <div className="comments-list">
                {comments.map((comment, index) => (
                    <div key={index} className='comment'>
                        <div className="comment-user-info">
                            <img src={comment.author.avatar} alt="User Avatar" className="user-avatar" />
                            <span className="username">{comment.author.username}</span>
                            <span>{new Date(comment.date).toLocaleDateString()}</span>
                            {user && user._id === comment.author._id && (
                                <div className={`options-menu ${comment.optionsMenu ? 'active' : ''}`}>
                                    <button className="options-button" onClick={() => handleToggleOptionsMenu(index)}>&#8942;</button>
                                    <div className="options-dropdown">
                                        <button onClick={() => navigate(`/${blogId}/editComment/${index}`)}>Edit</button>
                                        <button onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
