import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import './BlogDetails.css'; // Make sure to create and import this CSS file
import Navbar from '../../Components/Navbar/Navbar';
import { UserContext } from '../../Components/Context/UserContext';
import useFavorites from '../../Components/CustomHooks/UseFavorites';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // for non-favorite
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'; // for favorite
import CommentSection from '../../Components/Comment/CommentSection';
import LikeDisLike from '../../Components/LikeDisLike/LikeDisLike';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';
import CustomPrevArrow from '../../Components/CustomArrows/CustomPrevArrow'
import CustomNextArrow from '../../Components/CustomArrows/CustomNextArrow';
import BackButton from '../../Components/BackButton/BackButton';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true)
    // taking user from the global user defined by the context api
    const { user } = useContext(UserContext);
    const { blogId } = useParams();
    const navigate = useNavigate();

    const { toggleFavorite, isFavorite } = useFavorites();


    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/blog/${blogId}`)
            .then(res => {
                setBlog(res.data)
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [blogId]);

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/api/blog/delete/${blogId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        })
        .then(() =>
                navigate('/')
        ).catch(err => console.error(err))
    }

    // Inside BlogCard.jsx and BlogDetail.jsx
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  arrows: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />
};

    return (
        
        <>
            <Navbar />
            <BackButton />
            {
                loading ? <LoadingIndicator /> : (
                    <>
                        <article className="blog-detail">
                        <header className="blog-header">
                            <h1 className="blog-title">{blog.title}</h1>
                            <div className="blog-meta">
                                {/* <span className="blog-author">By {blog.author.username}</span> */}
                                <button onClick={() => navigate(`/author/${blog.author._id}`)} style={{ background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                   By {blog.author.username}
                                </button>
                                <span className="blog-date">{new Date(blog.publishDate).toLocaleDateString()}</span>
                            </div>
                            <div className="blog-tags">
                                {blog.tags.map((tag, index) => <span key={index} className="blog-tag">{tag}</span>)}
                            </div>
                        </header>

                        <div className="image-slider">
                            <Slider {...settings}>
                                {blog.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto' }} />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        <section className="blog-content">
                            {/* {console.log('blog id: ', blog.author._id)} */}
                            {blog && user && blog.author._id === user._id && (
                                <>
                                    <button className='edit-button' onClick={() => navigate(`/edit/${blogId}`)}>edit</button>
                                    <button className='delete-btn' onClick={handleDelete}>delete</button>
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
                )
            }
        </>
    );
};

export default BlogDetail;
