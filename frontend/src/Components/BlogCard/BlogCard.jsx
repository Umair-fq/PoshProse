import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css'; // Update the path if necessary
import axios from 'axios';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <div className="blog-header">
        <h2 className="blog-title">{blog.title}</h2>
        <span className="blog-author">By {blog.author.username}</span>
      </div>
      <p className="blog-summary">{blog.summary}</p>
      {/* <button onClick={handleAddToFav}>Add to Fav</button>
      <button onClick={handleRemoveFavorites}>Remove from fav</button> */}
      <div className="blog-tags">
        {blog.tags.map((tag, index) => 
            <span key={index} className='blog-tag'>{tag}</span>
        )}
      </div>
      <Link to={`/blogs/${blog._id}`} className="read-more-link">Read More</Link>
    </div>
  );
};

export default BlogCard;
