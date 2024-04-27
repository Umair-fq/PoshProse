// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BlogCard from '../../Components/BlogCard/BlogCard';
// import './MyBlogs.css';
// import Navbar from '../../Components/Navbar/Navbar';
// import LimitSelector from '../../Components/LimitSelector/LimitSelector';
// import Pagination from '../../Components/Pagination/Pagination';
// import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';

// const MyBlogs = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [limit, setLimit] = useState(5);
//     const [pageCount, setPageCount] = useState(1);

//     useEffect(() => {
//         setLoading(true);
//         axios.get(`http://localhost:8080/api/blog/myblogs?page=${currentPage}&limit=${limit}`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('userToken')}`
//             }
//         })
//         .then(res => {
//             setBlogs(res.data.blogs);
//             setPageCount(res.data.pageCount);
//             setLoading(false);
//         })
//         .catch(err => 
//             console.error(err)
//         );
//     }, [currentPage, limit]);

//     const handlePageClick = (selectedItem) => {
//         setCurrentPage(selectedItem.selected + 1);
//     };

//     const handleLimitChange = (e) => {
//         setLimit(parseInt(e.target.value));
//     };

//     return (
//         <>
//             <Navbar />
//             {loading ? (
//                 <LoadingIndicator />
//             ) : (
//                 <>
//                     <div className='blog-list-container'>
//                         {blogs ? 
//                             blogs.map(blog => 
//                                 (<BlogCard key={blog._id} blog={blog}/>)
//                             )
//                             :
//                             <div>You have not posted any blog</div>
//                         }
//                     </div>
//                     <div className="pagination-controls">
//                         <LimitSelector value={limit} onChange={handleLimitChange} />
//                         <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
//                     </div>
//                 </>
//             )}
//         </>
//     );
// }

// export default MyBlogs;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../../Components/BlogCard/BlogCard';
import './MyBlogs.css';
import Navbar from '../../Components/Navbar/Navbar';
import LimitSelector from '../../Components/LimitSelector/LimitSelector';
import Pagination from '../../Components/Pagination/Pagination';
import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator';
import BackButton from '../../Components/BackButton/BackButton';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/blog/myblogs?page=${currentPage}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(res => {
            setBlogs(res.data.blogs);
            setPageCount(res.data.pageCount);
            setLoading(false);
        })
        .catch(err => 
            console.error(err)
        );
    }, [currentPage, limit]);

    const handlePageClick = (selectedItem) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
    };

    return (
        <>
            {/* <Navbar />
            <BackButton/>
            {loading ? (
                <LoadingIndicator />
            ) : (
                <div className="my-blogs-container">
                    <div className='blog-list'>
                        {blogs.length > 0 ? 
                            blogs.map(blog => (<BlogCard key={blog._id} blog={blog}/>))
                            :
                            <div className="no-blogs">You have not posted any blogs.</div>
                        }
                    </div>
                    <div className="pagination-controls">
                        <LimitSelector value={limit} onChange={handleLimitChange} />
                        <Pagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
                    </div>
                </div>
            )} */}

            <Navbar />
            <div className="back-button-container">
                <BackButton />
            </div>
            <div className="myblogs-container">
                {loading ? (
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
