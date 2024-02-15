import React, { useState } from 'react'
import axios from 'axios'
import './AddBlog.css'
import Navbar from '../../Components/Navbar/Navbar'
import { useNavigate } from 'react-router-dom'

const AddBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        tags: []
    })

    const availableTags = ["Technology", "Health", "Finance", "Education", "Lifestyle"] // pre-defined tags
    const navigate = useNavigate();

    const handleChange = (e) => {
        // destructuring e.target object
        const { name, value, type, checked } = e.target;
        if(type === 'checkbox') {
                setFormData(prevState => ({
                    ...prevState,
                    tags: checked
                    ? [...prevState.tags, value]
                    : prevState.tags.filter(tag => tag !== value)
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
        console.log(formData.tags)
        // console.log(localStorage.getItem('token'))
        axios.post('http://localhost:8080/api/blog/create', {
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
            // console.log(`res: ${res.data}`)
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
                    <button type="submit" className="submit-btn">Add</button>
                </div>
            </form>
        </div>
        </>
    );
}

export default AddBlog