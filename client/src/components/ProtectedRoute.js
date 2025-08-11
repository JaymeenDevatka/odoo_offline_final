import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check for the token in localStorage
    const token = localStorage.getItem('token');
    
    // For now, we just check if a token exists.
    // Later, you could decode it to check the user's role.
    if (!token) {
        // If no token, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If a token exists, render the component that was passed in
    return children;
};

export default ProtectedRoute;