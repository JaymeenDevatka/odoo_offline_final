import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VenueCard from '../components/VenueCard'; 

// MUI Components
import { Container, Box, Typography, Button, Grid, Paper, Avatar, CircularProgress } from '@mui/material';

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
                const venuesWithPrice = response.data.map(v => ({ ...v, startingPrice: '150' }));
                setPopularVenues(venuesWithPrice);
            } catch (error) {
                console.error("Could not fetch popular venues", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularVenues();
    }, []);

    return (
        <Box sx={{ backgroundColor: '#f7f9fc' }}>
            {/* Hero Section */}
            <Box sx={{ pt: 12, pb: 12, textAlign: 'center', background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)', color: 'white' }}>
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>Find Your Game, Book Your Court</Typography>
                    <Typography variant="h5" component="p" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>The easiest way to discover and book sports facilities in your area.</Typography>
                    <Button variant="contained" size="large" onClick={() => navigate('/venues')} sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#e0e0e0' } }}>Find a Venue Now</Button>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">How It Works</Typography>
                <Grid container spacing={5} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4} textAlign="center"><Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}><SearchIcon fontSize="large" /></Avatar><Typography variant="h6" fontWeight="bold">1. Find</Typography><Typography>Search our extensive list of local venues by sport, location, or price.</Typography></Grid>
                    <Grid item xs={12} md={4} textAlign="center"><Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}><EventAvailableIcon fontSize="large" /></Avatar><Typography variant="h6" fontWeight="bold">2. Book</Typography><Typography>Select your desired date and time slot, and confirm your booking instantly.</Typography></Grid>
                    <Grid item xs={12} md={4} textAlign="center"><Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}><SportsScoreIcon fontSize="large" /></Avatar><Typography variant="h6" fontWeight="bold">3. Play</Typography><Typography>Show up at the venue with your confirmation and enjoy your game!</Typography></Grid>
                </Grid>
            </Container>

            {/* Popular Venues Section */}
            <Box sx={{ bgcolor: 'white', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">Popular Venues Near You</Typography>
                    {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress />
                    </Box> : <Grid container spacing={4} sx={{ mt: 4 }}>{popularVenues.map((venue) => (<Grid item key={venue.id} xs={12} sm={6} md={4}><VenueCard venue={venue} /></Grid>))}</Grid>}
                </Container>
            </Box>

            {/* Featured Sports Section */}
            <Box sx={{ py: 8 }}>
                <Container maxWidth="md">
                    <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">Any Sport, Any Time</Typography>
                    {/* 👇 This Grid was missing. It is now restored. 👇 */}
                    <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
                        <Grid item textAlign="center"><Paper elevation={2} sx={{p:3, minWidth: 120}}><SportsCricketIcon sx={{fontSize: 40}}/><Typography>Cricket</Typography></Paper></Grid>
                        <Grid item textAlign="center"><Paper elevation={2} sx={{p:3, minWidth: 120}}><SportsTennisIcon sx={{fontSize: 40}}/><Typography>Badminton</Typography></Paper></Grid>
                        <Grid item textAlign="center"><Paper elevation={2} sx={{p:3, minWidth: 120}}><SportsSoccerIcon sx={{fontSize: 40}}/><Typography>Football</Typography></Paper></Grid>
                        <Grid item textAlign="center"><Paper elevation={2} sx={{p:3, minWidth: 120}}><SportsTennisIcon sx={{fontSize: 40}}/><Typography>Tennis</Typography></Paper></Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Final Call-to-Action Section */}
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">Ready to Get in the Game?</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>Join thousands of players and hundreds of facilities on QuickCourt today.</Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/register')}>Sign Up for Free</Button>
            </Container>
        </Box>
    );
};

export default LandingPage;