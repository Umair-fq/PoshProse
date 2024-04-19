import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditBlog.css';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';

const EditBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        tags: [],
        images: []
    });
    const [images, setImages] = useState([null, null, null]); // Ensure array has three elements
    const [loading, setLoading] = useState([false, false, false]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const availableTags = ["Technology", "Health", "Finance", "Education", "Lifestyle"]; // Pre-defined tags

    useEffect(() => {
        setIsDataLoaded(true);
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
            .then(res => {
                const { title, summary, content, tags, images } = res.data;
                setFormData({ title, summary, content, tags, images });
                // Populate the images array ensuring it always has three elements
                setImages([...(images || []), ...Array(3).fill(null)].slice(0, 3));
                setIsDataLoaded(false);
            })
            .catch(err => console.error('Fetch error:', err));
    }, [blogId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ?
                (checked ? [...prevState.tags, value] : prevState.tags.filter(tag => tag !== value)) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/blog/update/${blogId}`, {
            ...formData,
            images: images.filter(Boolean) // Filter out null values
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        }).then(() => {
            navigate('/');
        }).catch(err => {
            console.error('Update error:', err);
        });
    };

    const handleImageChange = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;
        setLoading(prev => prev.map((item, idx) => idx === index ? true : item));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', `${import.meta.env.VITE_PRESET_NAME}`);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData);
            setImages(prev => prev.map((img, idx) => idx === index ? response.data.secure_url : img));
            setLoading(prev => prev.map((item, idx) => idx === index ? false : item));
        } catch (error) {
            console.error('Upload failed:', error);
            setLoading(prev => prev.map((item, idx) => idx === index ? false : item));
        }
    };

    const handleDeleteImage = (index) => {
        setImages(prev => prev.map((img, idx) => idx === index ? null : img));
    };

    return (
        <>  
            {isDataLoaded ? (<LoadingIndicator />) : (
                <>
                <Navbar />
                <div className="add-blog-container">
                    <h1>Edit Blog</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Form fields for title, summary, and content */}
                        <div className="form-group">
                            <input type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <textarea name="summary" placeholder="Enter summary" rows="5" value={formData.summary} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <textarea name="content" placeholder="Enter content" rows="10" value={formData.content} onChange={handleChange}></textarea>
                        </div>
                        {/* Tags */}
                        {availableTags.map(tag => (
                            <label key={tag} className="tag-label">
                                <input type="checkbox" name="tags" value={tag} checked={formData.tags.includes(tag)} onChange={handleChange} />
                                {tag}
                            </label>
                        ))}
                        {/* Image Uploads */}
                        <div className="image-upload-row">
                            {images.map((image, index) => (
                                <div key={index} className="image-upload-container">
                                    {loading[index] ? (
                                        <div className="loading-container"><FontAwesomeIcon icon={faUpload} spin /></div>
                                    ) : (
                                        <>
                                            {image ? (
                                                <div className="image-container">
                                                    <img src={image} alt={`Uploaded ${index}`} />
                                                    <button className="delete-button" onClick={() => handleDeleteImage(index)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="image-upload-label">
                                                    <input type="file" onChange={(e) => handleImageChange(e, index)} accept="image/*" style={{ display: 'none' }} />
                                                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                                                </label>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="submit-btn">Update Blog</button>
                    </form>
                </div>
            </>
            )}
        </>
    );
};

export default EditBlog;
