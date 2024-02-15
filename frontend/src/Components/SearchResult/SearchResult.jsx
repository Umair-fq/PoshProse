import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './SearchResult.css'
import BlogCard from '../BlogCard/BlogCard';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const searchQuery = query.get("query");

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/blog/search`, {
                    params: { query: searchQuery },
                });
                setBlogs(response.data);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [searchQuery]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Search Results for {searchQuery}</h2>
            {blogs.length > 0 ? (
                <div>
                    {blogs.map(blog => (
                        <BlogCard key={blog._id} blog={blog}/>
                    ))}
                </div>
            ) : (
                <p>No blogs found.</p>
            )}
        </div>
    );
};

export default SearchResults;
