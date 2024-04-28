import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../../Components/BlogCard/BlogCard';
import './MyBlogs.css';
import Navbar from '../../Components/Navbar/Navbar';
import LimitSelector from '../../Components/LimitSelector/LimitSelector';
import Pagination from '../../Components/Pagination/Pagination';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';
import BackButton from '../../Components/BackButton/BackButton';
import TagsFilter from '../../Components/TagsFilter/TagsFilter';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pageCount, setPageCount] = useState(1);


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
            const response = await axios.get(`http://localhost:8080/api/blog/myblogs?${queryParams.toString()}`,
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
        });
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


    const handleTagToggle = (toggledTag) => {
        setSelectedTags((prevState) =>
            prevState.includes(toggledTag) ?
                prevState.filter((tag) => tag !== toggledTag) :
                [...prevState, toggledTag]
        );
    };

    const handlePageClick = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
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
            <div className="myblogs-container">
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <div className="content-layout">
                        <div className="blog-cards">
                            {blogs.length > 0 ? 
                                blogs.map(blog => (<BlogCard key={blog._id} blog={blog}/>))
                                :
                                <div className="no-blogs">You have not posted any blogs.</div>
                            }
                        </div>
                        <div className="controls">
                            <LimitSelector value={limit} onChange={handleLimitChange} />
                            <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default MyBlogs;
