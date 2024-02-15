import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext';

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [userFavorites, setUserFavorites] = useState([])

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
    }

    const fetchFavorites = () => {
        axios.get(`http://localhost:8080/api/user/favBlogs`,
        {headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }}
        )
        .then((res) => {
            // console.log('data: ', res.data)
            setUserFavorites(res.data);
        })
        .catch(err => 
                console.error(err)
            )
    }

    useEffect(() => {
        if(user) {
            fetchFavorites();
        }
    }, [user])

  return (
    <>
        <UserContext.Provider value = {{ user, login, logout, userFavorites, setUserFavorites }}>
            {children}
        </UserContext.Provider>
    </>
  )
}

