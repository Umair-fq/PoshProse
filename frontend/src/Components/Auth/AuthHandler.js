import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const AuthHandler = () => {
  const { login } = useContext(UserContext); // Assuming your context provides a login function
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');
    const username = queryParams.get('username');
    const id = queryParams.get('id'); // Retrieve the user's ID
    
    if (token && id) {
      // Update login function to include user ID if necessary
      login({ email, username, _id: id });
      localStorage.setItem('userToken', token); // Store the token
      navigate('/'); // Navigate to the home page or dashboard
    } else {
      navigate('/login'); // On failure or absence of token, redirect to login
    }
  }, [location, navigate, login]);

  return null; // This component does not render anything
};

export default AuthHandler;
