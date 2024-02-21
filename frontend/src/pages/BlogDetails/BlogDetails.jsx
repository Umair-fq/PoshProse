import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogDetails.css'; // Make sure to create and import this CSS file
import Navbar from '../../Components/Navbar/Navbar';
import { UserContext } from '../../Components/Context/UserContext';
import useFavorites from '../../Components/CustomHooks/UseFavorites';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // for non-favorite
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'; // for favorite
import CommentSection from '../../Components/Comment/CommentSection';
import LikeDisLike from '../../Components/LikeDisLike/LikeDisLike';


const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    // taking user from the global user defined by the context api
    const { user } = useContext(UserContext);
    const { blogId } = useParams();
    const navigate = useNavigate();

    const { toggleFavorite, isFavorite } = useFavorites();


    useEffect(() => {
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
            .then(res => setBlog(res.data))
            .catch(err => console.error(err));
    }, [blogId]);

    if (!blog) return <div className="loading">Loading...</div>;

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/api/blog/delete/${blogId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        })
        .then(() =>
                navigate('/')
        ).catch(err => console.error(err))
    }

    return (
        
        <>
            <Navbar />
            <article className="blog-detail">
            <header className="blog-header">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta">
                    <span className="blog-author">By {blog.author.username}</span> {/* Assuming you have the author's username */}
                    <span className="blog-date">{new Date(blog.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="blog-tags">
                    {blog.tags.map((tag, index) => <span key={index} className="blog-tag">{tag}</span>)}
                </div>
            </header>
            <section className="blog-content">
                {/* {console.log('blog id: ', blog.author._id)} */}
                {blog && user && blog.author._id === user._id && (
                    <>
                        <button className='edit-button' onClick={() => navigate(`/edit/${blogId}`)}>edit</button>
                        <button className='delete-button' onClick={handleDelete}>delete</button>
                    </>
                )}

            <FontAwesomeIcon 
                onClick={() => toggleFavorite(blog)}
                icon={isFavorite(blog._id) ? fasHeart : farHeart}
                className={`favorite-icon ${isFavorite(blog._id) ? 'favorited' : ''}`}
            />

            <LikeDisLike blogId={blog._id}/>
                
                {blog.summary && <p className="blog-summary">{blog.summary}</p>}
                <div dangerouslySetInnerHTML={{ __html: blog.content }}></div> {/* Assuming HTML content; sanitize in production */}
            </section>
            <CommentSection blogId={blog._id}/>
        </article>
        </>
    );
};

export default BlogDetail;
