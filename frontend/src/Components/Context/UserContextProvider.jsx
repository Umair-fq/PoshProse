import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userFavorites, setUserFavorites] = useState([]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setUserFavorites([]); // Clear favorites when user logs out
    };

    const fetchFavorites = () => {
        axios.get(`http://localhost:8080/favBlogs`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        })
        .then((res) => {
            setUserFavorites(res.data);
        })
        .catch(err => {
            if (err.response && err.response.status === 404) {
                console.warn('No favorites found or user not found');
                setUserFavorites([]); // Set userFavorites to an empty array if no favorites are found
            }
        });
    };
    

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, login, logout, userFavorites, setUserFavorites }}>
            {children}
        </UserContext.Provider>
    );
};
