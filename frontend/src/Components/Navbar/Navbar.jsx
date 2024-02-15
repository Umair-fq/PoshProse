import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.webp'; // Adjust the path as necessary
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../Context/UserContext';
// import axios from 'axios';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const { logout } = useContext(UserContext);

    const links = [
        {name: "Home", link: "/"},
        {name: "My Blogs", link: "/myblogs"},
        {name: "Favorites", link: "/favorites"},
        // {name: "Blogs", link: "/blogs"},
        {name: "Create Blog", link: "/create"},
    ]

    const handleSearch = async (e) => {
        e.preventDefault();
        // setIsSearching(true);
        try {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleLogout = () => {
        // Logic for handling logout
        // console.log("Logout clicked"); // Implement logout functionality
        localStorage.removeItem('userToken');
        logout();
        navigate('/login')
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <ul className="navbar-links">
                {links.map((linkItem) => (
                    <li key={linkItem.name}>
                        <Link to = {linkItem.link}>{linkItem.name}</Link>
                    </li>
                ))}
            </ul>
            <div className="navbar-actions">
                <form onSubmit={handleSearch} className="search-bar">
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search Blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-icon">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </form>
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
