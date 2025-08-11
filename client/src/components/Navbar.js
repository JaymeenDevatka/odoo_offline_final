import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Fade,
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        handleMenuClose();
        navigate('/login');
    };

    const getDashboardPath = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'owner': return '/owner/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/my-bookings';
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h5"
                    component={RouterLink}
                    to="/"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ff6a00, #ee0979)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        letterSpacing: 1,
                    }}
                >
                    QuickCourt
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/venues"
                        sx={{
                            color: '#fff',
                            textTransform: 'none',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            '&:hover': { color: '#ff6a00', backgroundColor: 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        Browse Venues
                    </Button>

                    {user ? (
                        <>
                            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                <Avatar
                                    sx={{
                                        width: 36, height: 36,
                                        bgcolor: '#333',
                                        color: '#fff',
                                        fontWeight: 600,
                                        border: '2px solid #ff6a00'
                                    }}
                                >
                                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                TransitionComponent={Fade}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5, borderRadius: 2,
                                        bgcolor: '#222', color: '#fff',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>My Profile</MenuItem>
                                <MenuItem component={RouterLink} to={getDashboardPath()} onClick={handleMenuClose}>
                                    {user.role === 'user' ? 'My Bookings' : 'Dashboard'}
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: '#ff6a00' }}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    color: '#fff', textTransform: 'none',
                                    fontWeight: 500,
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to="/register"
                                sx={{
                                    textTransform: 'none', borderRadius: '30px',
                                    background: 'linear-gradient(90deg, #ff6a00, #ee0979)',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #ee0979, #ff6a00)',
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
