import React, { useCallback, useEffect, useState } from 'react';
import TagsFilter from '../TagsFilter/TagsFilter';
import axios from 'axios';
import BlogCard from '../BlogCard/BlogCard';
import './BlogList.css';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import LimitSelector from '../LimitSelector/LimitSelector';
import Pagination from '../Pagination/Pagination';

const BlogList = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pageCount, setPageCount] = useState(1);

    const handleTagToggle = (toggledTag) => {
        setSelectedTags((prevState) =>
            prevState.includes(toggledTag) ?
                prevState.filter((tag) => tag !== toggledTag) :
                [...prevState, toggledTag]
        );
    };

    const fetchBlogs = useCallback(async () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
            page: currentPage,
            limit
        });

        if (selectedTags.length > 0) {
            queryParams.set('tags', selectedTags.join(','));
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/blog/bytags?${queryParams.toString()}`);
            setBlogs(response.data.blogs);
            setPageCount(response.data.pageCount);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedTags, currentPage, limit]);

    useEffect(() => {
        fetchBlogs();
    }, [selectedTags, currentPage, limit, fetchBlogs]);

    const handlePageClick = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value)); // Update the limit state
    };

    return (
        <>
            <TagsFilter
                availableTags={['Education', 'Finance', 'Technology', 'Health', 'Lifestyle']}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
            />
            <div className="blogs-container">
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <>  <div className="content-layout">
                            <div className="blog-cards">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog._id} blog={blog} />
                                ))}
                            </div>
                            <div className="controls">
                                <LimitSelector value={limit} onChange={handleLimitChange} />
                                <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default BlogList;
