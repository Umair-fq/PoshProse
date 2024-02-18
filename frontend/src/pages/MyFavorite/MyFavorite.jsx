import React, { useContext } from 'react'
import { UserContext } from '../../Components/Context/UserContext'
import BlogCard from '../../Components/BlogCard/BlogCard';
import Navbar from '../../Components/Navbar/Navbar';
import './MyFavorite.css'
const MyFavorite = () => {
    const { userFavorites } = useContext(UserContext);
    // console.log('my fav: ', userFavorites)
  return (
    <>
        <Navbar />
        <div className="blog-list-container">
        {
            userFavorites.map(blog => 
                <BlogCard key={blog._id} blog={blog}/>
                )
        }
    </div>
    </>
  )
}

export default MyFavorite