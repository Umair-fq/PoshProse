import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Components/Context/UserContext';
import BlogCard from '../../Components/BlogCard/BlogCard';
import Navbar from '../../Components/Navbar/Navbar';
import LimitSelector from '../../Components/LimitSelector/LimitSelector';
import Pagination from '../../Components/Pagination/Pagination';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';
import BackButton from '../../Components/BackButton/BackButton';
import TagsFilter from '../../Components/TagsFilter/TagsFilter';
import './MyFavorite.css';

const MyFavorite = () => {
    const { userFavorites } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [visibleBlogs, setVisibleBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        const filteredBlogs = userFavorites.filter(blog => {
            if (selectedTags.length === 0) return true; // If no tags selected, return all blogs
            return selectedTags.some(tag => blog.tags.includes(tag)); // Checks if any selected tag is in the blog's tags
        });

        setVisibleBlogs(filteredBlogs.slice(startIndex, endIndex));
        setIsLoading(false);  
    }, [userFavorites, currentPage, limit, selectedTags]);

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
                            <Pagination pageCount={Math.ceil(userFavorites.length / limit)} handlePageClick={handlePageClick} currentPage={currentPage}/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default MyFavorite;
