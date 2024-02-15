import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './EditBlog.css'
import Navbar from '../../Components/Navbar/Navbar'
import { useNavigate, useParams } from 'react-router-dom'

const EditBlog = () => {
    const {blogId} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        tags: []
    })

    const availableTags = ["Technology", "Health", "Finance", "Education", "Lifestyle"] // pre-defined tags


    useEffect(() => {
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
        .then(res =>{
                const {title, summary, content, tags} = res.data;
                setFormData({ title, summary, content, tags}) // Assuming tags is an array
                }
            )
    }, [blogId])

    const handleChange = (e) => {
        // destructuring e.target object
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                tags: checked ? 
                [...prevState.tags, value] :
                prevState.tags.filter(tag => tag !== value)
            }))
        } else {
            // prevState argument represents the current state before the update
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/blog/update/${blogId}`, {
            title: formData.title,
            content: formData.content,
            summary: formData.summary,
            tags: formData.tags
        }, 
        {headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }}
        ).then(() => {
            navigate('/')
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <>
            <Navbar />
            <div className="add-blog-container">
            <h1>Add Blog</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <textarea name="summary" placeholder="Enter summary" rows="5" value={formData.summary} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <textarea name="content" placeholder="Enter content" rows="10" value={formData.content} onChange={handleChange}></textarea>
                </div>
                {/* <div className="form-group">
                    <input type="text" name="tags" placeholder="Enter tags separated by commas" value={formData.tags} onChange={handleChange} />
                </div> */}
                {
                    availableTags.map(tag => (
                        <label key={tag}>
                            <input type="checkbox" name = 'tags' value={tag} checked={formData.tags.includes(tag)} onChange={handleChange}/>
                            {tag}
                        </label>
                    ))
                }
                <div className="form-group">
                    <button type="submit" className="submit-btn">Update Blog</button>
                </div>
            </form>
        </div>
        </>
    );
}

export default EditBlog