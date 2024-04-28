import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './SearchResult.css'
import BlogCard from '../BlogCard/BlogCard';
import BackButton from '../BackButton/BackButton';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import Navbar from '../Navbar/Navbar';
import LimitSelector from '../LimitSelector/LimitSelector';
import Pagination from '../Pagination/Pagination';
import TagsFilter from '../TagsFilter/TagsFilter';

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [visibleBlogs, setVisibleBlogs] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const query = useQuery();
    const searchQuery = query.get("query");

    useEffect(() => {
        setIsLoading(true);
        fetchBlogs();
    }, [searchQuery]);

    const fetchBlogs = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/blog/search`, {
                    params: { query: searchQuery },
                });
                setBlogs(response.data);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setIsLoading(false);
            }
        };

    useEffect(() => {
        setIsLoading(true)
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const filteredBlogs = blogs.filter(blog => {
            if (selectedTags.length === 0) return true; // If no tags selected, return all blogs
            return selectedTags.some(tag => blog.tags.includes(tag)); // Checks if any selected tag is in the blog's tags
        });
        setVisibleBlogs(filteredBlogs.slice(startIndex, endIndex))
        setIsLoading(false)
    }, [blogs, currentPage, limit, selectedTags]);

    const handlePageClick = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
    };

    const handleTagToggle = (toggledTag) => {
        setSelectedTags((prevState) =>
            prevState.includes(toggledTag) ?
                prevState.filter((tag) => tag !== toggledTag) :
                [...prevState, toggledTag]
        );
    };

    return (
        <>
            <Navbar />
            <TagsFilter
                availableTags={['Education', 'Finance', 'Technology', 'Health', 'Lifestyle']}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
            />
            <div className="back-button-container">
                <BackButton />
            </div>
            <div className="favorites-container">
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <div className="content-layout">
                        <div className="blog-cards">
                            {visibleBlogs.map(blog => 
                                <BlogCard key={blog._id} blog={blog}/>
                            )}
                        </div>
                        <div className="controls">
                            <LimitSelector value={limit} onChange={handleLimitChange} />
                            <Pagination pageCount={Math.ceil(blogs.length / limit)} handlePageClick={handlePageClick} currentPage={currentPage}/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;
