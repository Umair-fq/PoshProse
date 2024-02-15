// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AllBlogs.css'; // Import CSS for styling
// import { Link } from 'react-router-dom';
// import Navbar from '../../Components/Navbar/Navbar';

// const AllBlogs = () => {
//     const [blogs, setBlogs] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:8080/api/blog/all')
//             .then(res => {
//                 setBlogs(res.data);
//             })
//             .catch(err => {
//                 console.error(err);
//             });
//     }, []);

//     return (
//         <>
//             <Navbar />
//             <div className="blogs-container">
//             {blogs.length > 0 ?
//                 blogs.map((blog, index) => (
//                     <Link to={`/blogs/${blog._id}`} key={blog._id} className='blog-link'>
//                         <div className="blog-card">
//                             <h2 className="blog-title">{blog.title}</h2>
//                             <p>By {blog.author.username}</p> {/* Displaying author's username */}
//                             <p className="blog-summary">{blog.summary}</p>
//                         <div className="blog-info">
//                             <span className="blog-date">{new Date(blog.publishDate).toDateString()}</span>
//                             <div className="blog-tags">{blog.tags.map((tag, index) => (
//   <span key={index} className="blog-tag">{tag}</span>
// ))}
// </div>
//                         </div>
//                         </div>
//                     </Link>
//                 ))
//                 :
//                 "No blogs found"
//             }
//         </div>

//         </>
//     );
// };

// export default AllBlogs;
