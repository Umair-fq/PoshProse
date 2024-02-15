import React, { useEffect, useState } from 'react'
import TagsFilter from '../TagsFilter/TagsFilter';
import axios from 'axios'
import { Link } from 'react-router-dom';
import BlogCard from '../BlogCard/BlogCard';
import './BlogList.css'

const BlogList = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [blogs, setBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    // const avgTags = ['Education', 'Finance', 'Technology', 'Health', 'Lifestyle'];

    const handleTagToggle = (toggledTag) => {
        // set the state of selected tags
        setSelectedTags((prevState) => 
            prevState.includes(toggledTag) ?
                prevState.filter((tag) => tag !== toggledTag) :
                [...prevState, toggledTag]
        )
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedTags.length) {
                queryParams.append('tags', selectedTags.join(','));
            }
            try{
                const response = await axios.get(`http://localhost:8080/api/blog/bytags?${queryParams}`);
                setBlogs(response.data)
                // console.log("blogs: ",response.data)
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }}
            fetchBlogs();
        }, [selectedTags]
    )
  return (
    <>
        <TagsFilter
            availableTags={['Education', 'Finance', 'Technology', 'Health', 'Lifestyle']}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
        />
        {
            isLoading ? 
            (<div>Loading....</div>) : 
            (
                <div className="blog-list-container">
                    {blogs.map(blog => 
                        <BlogCard key={blog._id} blog={blog}/>
                        )}
                </div>
            )
        }
    </>
  )
}

export default BlogList