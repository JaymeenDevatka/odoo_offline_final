import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VenueCard from '../components/VenueCard';

import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Avatar,
    CircularProgress
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const LandingPage = () => {
    const navigate = useNavigate();
    const [popularVenues, setPopularVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularVenues = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/venues/popular');
                const venuesWithPrice = response.data.map(v => ({
                    ...v,
                    startingPrice: '150',
                    sportTypes: 'Badminton,Tennis'
                }));
                setPopularVenues(venuesWithPrice);
            } catch (error) {
                console.error("Could not fetch popular venues", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularVenues();
    }, []);

    const handleSportSearch = (sport) => {
        navigate(`/venues?sportType=${encodeURIComponent(sport)}`);
    };

    return (
        <Box sx={{ backgroundColor: '#111' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 14,
                    pb: 14,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #000, #333)',
                    color: '#eee'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1 }}>
                        Find Your Game, Book Your Court
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ mb: 4, color: 'rgba(238,238,238,0.85)' }}
                    >
                        The easiest way to discover and book sports facilities in your area.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/venues')}
                        sx={{
                            background: '#333',
                            color: '#eee',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: '30px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                            '&:hover': {
                                backgroundColor: '#444',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Find a Venue Now
                    </Button>
                </Container>
            </Box>

            {/* How It Works */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" align="center" fontWeight="bold" color="#eee">
                    How It Works
                </Typography>
                <Grid container spacing={5} sx={{ mt: 5 }}>
                    {[
                        {
                            icon: <SearchIcon fontSize="large" />,
                            title: 'Find',
                            text: 'Search our extensive list of local venues by sport, location, or price.'
                        },
                        {
                            icon: <EventAvailableIcon fontSize="large" />,
                            title: 'Book',
                            text: 'Select your desired date and time slot, and confirm instantly.'
                        },
                        {
                            icon: <SportsScoreIcon fontSize="large" />,
                            title: 'Play',
                            text: 'Show up at the venue and enjoy your game!'
                        }
                    ].map((step, idx) => (
                        <Grid key={idx} item xs={12} md={4} textAlign="center">
                            <Avatar
                                sx={{
                                    bgcolor: '#333',
                                    color: '#eee',
                                    width: 70,
                                    height: 70,
                                    mx: 'auto',
                                    mb: 2,
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                }}
                            >
                                {step.icon}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="#eee">
                                {idx + 1}. {step.title}
                            </Typography>
                            <Typography color="#aaa">{step.text}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Popular Venues */}
            <Box sx={{ bgcolor: '#222', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" fontWeight="bold" color="#eee">
                        Popular Venues Near You
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress sx={{ color: '#eee' }} />
                        </Box>
                    ) : (
                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {popularVenues.map((venue) => (
                                <Grid item key={venue.id} xs={12} sm={6} md={4}>
                                    <VenueCard venue={venue} darkMode />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* Featured Sports */}
            <Box sx={{ py: 8, background: '#1a1a1a' }}>
                <Container maxWidth="md">
                    <Typography variant="h4" align="center" fontWeight="bold" color="#eee">
                        Any Sport, Any Time
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
                        {[
                            { icon: <SportsCricketIcon sx={{ fontSize: 40, color: '#eee' }} />, label: 'Cricket' },
                            { icon: <SportsTennisIcon sx={{ fontSize: 40, color: '#eee' }} />, label: 'Badminton' },
                            { icon: <SportsSoccerIcon sx={{ fontSize: 40, color: '#eee' }} />, label: 'Football' },
                            { icon: <SportsTennisIcon sx={{ fontSize: 40, color: '#eee' }} />, label: 'Tennis' }
                        ].map((sport, idx) => (
                            <Grid key={idx} item textAlign="center">
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        minWidth: 120,
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        bgcolor: '#333',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
                                        }
                                    }}
                                    onClick={() => handleSportSearch(sport.label)}
                                >
                                    {sport.icon}
                                    <Typography sx={{ mt: 1, color: '#eee' }}>{sport.label}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Final CTA */}
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="#eee">
                    Ready to Get in the Game?
                </Typography>
                <Typography variant="h6" color="#aaa" sx={{ mb: 4 }}>
                    Join thousands of players and hundreds of facilities on QuickCourt today.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                        background: 'linear-gradient(90deg, #333, #555)',
                        px: 5,
                        py: 1.5,
                        borderRadius: '30px',
                        fontWeight: 600,
                        color: '#eee',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #555, #333)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.7)'
                        }
                    }}
                >
                    Sign Up for Free
                </Button>
            </Container>
        </Box>
    );
};

export default LandingPage;