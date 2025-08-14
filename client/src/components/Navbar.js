import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
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
  Divider,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  SportsTennis,
  AccountCircle,
  Dashboard,
  ExitToApp,
  Menu as MenuIcon,
  Notifications,
  Bookmark
} from '@mui/icons-material';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(3); // Mock notification count
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');
    const [scrolled, setScrolled] = useState(false);

    // Color scheme
    const colors = {
        primary: '#6C5CE7',
        secondary: '#00CEFF',
        accent: '#FF7675',
        background: '#0F0E17',
        text: '#FFFFFE',
        lightText: '#A7A9BE'
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: scrolled ? 'rgba(15, 14, 23, 0.95)' : 'rgba(15, 14, 23, 0.8)',
                backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
                borderBottom: scrolled ? `1px solid ${colors.primary}30` : '1px solid transparent',
                transition: 'all 0.3s ease',
                py: scrolled ? 0 : 1,
            }}
        >
            <Toolbar sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
            }}>
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Typography
                        variant="h5"
                        component={RouterLink}
                        to="/"
                        sx={{
                            fontWeight: 700,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none',
                            letterSpacing: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <SportsTennis fontSize="large" />
                        QuickCourt
                    </Typography>
                </motion.div>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        ml: 4
                    }}>
                        <Button
                            component={RouterLink}
                            to="/venues"
                            sx={{
                                color: colors.text,
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                position: 'relative',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '0%',
                                    height: '2px',
                                    bottom: 0,
                                    left: 0,
                                    backgroundColor: colors.primary,
                                    transition: 'width 0.3s ease'
                                },
                                '&:hover:after': {
                                    width: '100%'
                                },
                                '&:hover': { 
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            Browse Venues
                        </Button>

                        {user && (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/my-bookings"
                                    sx={{
                                        color: colors.text,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        position: 'relative',
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '0%',
                                            height: '2px',
                                            bottom: 0,
                                            left: 0,
                                            backgroundColor: colors.primary,
                                            transition: 'width 0.3s ease'
                                        },
                                        '&:hover:after': {
                                            width: '100%'
                                        },
                                        '&:hover': { 
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    My Bookings
                                </Button>

                                <IconButton
                                    component={RouterLink}
                                    to="/notifications"
                                    sx={{ 
                                        color: colors.text,
                                        position: 'relative',
                                        '&:hover': {
                                            backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                        }
                                    }}
                                >
                                    <Badge 
                                        badgeContent={notifications} 
                                        color="error"
                                        overlap="circular"
                                    >
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                            </>
                        )}
                    </Box>
                )}

                {/* User Actions */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    ml: 'auto'
                }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            onClick={toggleMobileMenu}
                            sx={{
                                color: colors.text,
                                '&:hover': {
                                    backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {user ? (
                        <>
                            {!isMobile && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                        <Avatar
                                            sx={{
                                                width: 40, 
                                                height: 40,
                                                bgcolor: colors.primary,
                                                color: colors.text,
                                                fontWeight: 600,
                                                border: `2px solid ${colors.secondary}`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'rotate(15deg)'
                                                }
                                            }}
                                        >
                                            {user.fullName ? user.fullName.charAt(0) : 'U'}
                                        </Avatar>
                                    </IconButton>
                                </motion.div>
                            )}
                            
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5, 
                                        borderRadius: '12px',
                                        bgcolor: '#222', 
                                        color: colors.text,
                                        boxShadow: `0 8px 24px ${colors.primary}20`,
                                        minWidth: 200,
                                        overflow: 'visible',
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: '#222',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        }
                                    },
                                }}
                            >
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/profile" 
                                    onClick={handleMenuClose}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                        }
                                    }}
                                >
                                    <AccountCircle sx={{ mr: 1.5, color: colors.lightText }} />
                                    My Profile
                                </MenuItem>
                                <MenuItem 
                                    component={RouterLink} 
                                    to={getDashboardPath()} 
                                    onClick={handleMenuClose}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                        }
                                    }}
                                >
                                    <Dashboard sx={{ mr: 1.5, color: colors.lightText }} />
                                    {user.role === 'user' ? 'My Bookings' : 'Dashboard'}
                                </MenuItem>
                                <Divider sx={{ my: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                <MenuItem 
                                    onClick={handleLogout} 
                                    sx={{ 
                                        color: colors.accent,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 118, 117, 0.1)'
                                        }
                                    }}
                                >
                                    <ExitToApp sx={{ mr: 1.5 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        !isMobile && (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        color: colors.text, 
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/register"
                                        sx={{
                                            textTransform: 'none', 
                                            borderRadius: '12px',
                                            background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                                            fontWeight: 600,
                                            boxShadow: `0 4px 14px ${colors.primary}40`,
                                            px: 3,
                                            '&:hover': {
                                                background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
                                            },
                                        }}
                                    >
                                        Register
                                    </Button>
                                </motion.div>
                            </>
                        )
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobile && mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            overflow: 'hidden',
                            borderTop: `1px solid ${colors.primary}20`
                        }}
                    >
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                fullWidth
                                component={RouterLink}
                                to="/venues"
                                onClick={toggleMobileMenu}
                                sx={{
                                    justifyContent: 'flex-start',
                                    color: colors.text,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    py: 1.5
                                }}
                            >
                                Browse Venues
                            </Button>

                            {user ? (
                                <>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to="/my-bookings"
                                        onClick={toggleMobileMenu}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.text,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        My Bookings
                                    </Button>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to="/notifications"
                                        onClick={toggleMobileMenu}
                                        startIcon={<Notifications />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.text,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        Notifications
                                        {notifications > 0 && (
                                            <Box sx={{ 
                                                ml: 'auto',
                                                backgroundColor: colors.accent,
                                                color: colors.text,
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem'
                                            }}>
                                                {notifications}
                                            </Box>
                                        )}
                                    </Button>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to="/profile"
                                        onClick={toggleMobileMenu}
                                        startIcon={<AccountCircle />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.text,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        My Profile
                                    </Button>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to={getDashboardPath()}
                                        onClick={toggleMobileMenu}
                                        startIcon={<Dashboard />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.text,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        {user.role === 'user' ? 'My Bookings' : 'Dashboard'}
                                    </Button>
                                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            handleLogout();
                                            toggleMobileMenu();
                                        }}
                                        startIcon={<ExitToApp />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.accent,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        fullWidth
                                        component={RouterLink}
                                        to="/login"
                                        onClick={toggleMobileMenu}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: colors.text,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            py: 1.5
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%' }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            component={RouterLink}
                                            to="/register"
                                            onClick={toggleMobileMenu}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                                                fontWeight: 600,
                                                py: 1.5,
                                                mt: 1
                                            }}
                                        >
                                            Register
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppBar>
    );
};

export default Navbar;