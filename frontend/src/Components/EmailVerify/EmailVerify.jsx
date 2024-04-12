import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import successIcon from '../../assets/success.png';
import './EmailVerify.css';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const EmailVerify = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            setIsLoading(true);
            // Extract the query parameters
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('token');
            const id = searchParams.get('id');

            if (!token || !id) {
                console.log('Token or ID missing from the URL.');
                setMessage('Token or ID missing from the URL');
                return;
            }

            try {
                const url = `http://localhost:8080/verify/${token}/${id}`; // Construct the request URL
                const response = await axios.get(url);
                setMessage(response.data.message); // Display backend provided message
                setIsLoading(false); // Verification process completed, stop loading
            } catch (error) {
                setMessage(error.response.data.message || "Failed to verify email.");
            }
        };

        verifyEmailUrl();
    }, [location.search]); // React to changes in the query string

    return (
        <>
            {
                isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <>
                        <h1>{message}</h1>
                        {message === "Email verified successfully!" ? (
                            <div className="container">
                                <img src={successIcon} alt='Success' className='success_img' />
                                <h1>Email verified Successfully</h1>
                                <Link to='/login'>
                                    <button className="green_btn">Login</button>
                                </Link>
                            </div>
                        ) : (
                            <h1>Verification Failed</h1>
                        )}
                    </>
                )
            }
        </>
    );
};

export default EmailVerify;
