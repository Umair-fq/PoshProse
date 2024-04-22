import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BlogCard from '../../Components/BlogCard/BlogCard'
import './MyBlogs.css'
import Navbar from '../../Components/Navbar/Navbar'
import BlogList from '../../Components/BlogList/BlogList'
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator'
const MyBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/blog/myblogs', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(res => {
            setBlogs(res.data)
            setLoading(false);
        })
        .catch(err => 
            console.error(err)
        )
    }, [])
  return (
    <>
        <Navbar />
        {
            loading ? (<LoadingIndicator />) : 
                    (<> 
                        <div className='blog-list-container'>
                            {blogs ? 
                                blogs.map(blog => 
                                    (<BlogCard key={blog._id} blog={blog}/>)
                                )
                                :
                                <div>You have not posted any blog</div>
                            }
                        </div>
                    </>
                    )
        }
    </>
  )
}

export default MyBlogs