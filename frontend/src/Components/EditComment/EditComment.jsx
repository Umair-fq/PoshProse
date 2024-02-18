import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditComment = () => {
    const {blogId, index} = useParams();
    const [comment, setComment] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
            .then(res => {
                setComment(res.data.comments[index].comment)
            })
            .catch(err => console.error(err));

    }, [blogId, index])

    const handleSubmit = () => {
        axios.put(`http://localhost:8080/api/blog/${blogId}/editComment/${index}`, 
        {
            comment: comment
        }, 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        }).then(
            navigate(`/blogs/${blogId}`)
        ).catch(err => 
                console.error(err)
            )
    }
  return (
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
                <button onClick={handleSubmit} className="comment-button">Save</button>
    </div>
  )
}

export default EditComment