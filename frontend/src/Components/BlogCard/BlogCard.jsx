import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './BlogCard.css';
import CustomPrevArrow from '../../Components/CustomArrows/CustomPrevArrow'
import CustomNextArrow from '../../Components/CustomArrows/CustomNextArrow';

const BlogCard = ({ blog }) => {
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
    <div className="blog-card">
      <div className="blog-header">
        <h2 className="blog-title">{blog.title}</h2>
        <span className="blog-author">By {blog.author.username}</span>
      </div>
      {blog.images.length > 0 && (
        <div className="blog-image-slider">
          <Slider {...settings}>
            {blog.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Blog Slide ${index}`} className="blog-image" />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <p className="blog-summary">{blog.summary}</p>
      <div className="blog-tags">
        {blog.tags.map((tag, index) => <span key={index} className='blog-tag'>{tag}</span>)}
      </div>
      <Link to={`/blogs/${blog._id}`} className="read-more-link">Read More</Link>
    </div>
  );
};

export default BlogCard;
