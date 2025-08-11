import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

const Navbar = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);
        } else {
            setUser(null);
        }
    }, [location]); // Re-run this effect every time the page/route changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const renderDashboardLink = () => {
        if (!user) return null;
        switch (user.role) {
            case 'owner':
                return <Button color="inherit" component={RouterLink} to="/owner/dashboard">My Dashboard</Button>;
            case 'admin':
                return <Button color="inherit" component={RouterLink} to="/admin/dashboard">Admin Panel</Button>;
            default:
                return <Button color="inherit" component={RouterLink} to="/my-bookings">My Bookings</Button>;
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    QuickCourt
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/venues">Browse Venues</Button>
                    {user ? (
                        <>
                            {renderDashboardLink()}
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;