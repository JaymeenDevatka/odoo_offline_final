import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import AddReviewForm from '../components/AddReviewForm';


// Import MUI components for a modern UI
import { Container, Typography, Box, Grid, Paper, List, ListItem, ListItemText, Button, CircularProgress, Alert, Rating } from '@mui/material';

const SingleVenuePage = () => {
    // Hooks for getting URL parameters and navigation
    const { id } = useParams();
    const navigate = useNavigate();

    // State management for the component
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false); // State to control the booking modal

    // Fetch venue data from the backend. useCallback ensures the function isn't recreated on every render.
    const fetchVenue = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/venues/${id}`);
            setVenue(response.data);
        } catch (err) {
            setError('Failed to fetch venue details. It may not be approved or does not exist.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    // This effect runs when the component mounts to fetch the initial data.
    useEffect(() => {
        fetchVenue();
    }, [fetchVenue]);

    const handleOpenModal = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    if (!venue) {
        return <Typography>Venue not found.</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>{venue.name}</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>{venue.address}</Typography>
                
                <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                    <Typography variant="h5" gutterBottom>About Venue</Typography>
                    <Typography>{venue.description}</Typography>
                </Paper>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>Available Courts</Typography>
                        <List>
                            {venue.Courts?.length > 0 ? (
                                venue.Courts.map(court => (
                                    <ListItem key={court.id} divider>
                                        <ListItemText 
                                            primary={`${court.name} - ${court.sportType}`}
                                            secondary={`₹${court.pricePerHour} per hour`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No courts listed for this venue.</Typography>
                            )}
                        </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" gutterBottom>Book Your Slot</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary" size="large" fullWidth onClick={handleOpenModal}>
                                Book Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* --- NEW Reviews Section --- */}
                <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                    <Typography variant="h5" gutterBottom>User Reviews</Typography>
                    {venue.Reviews && venue.Reviews.length > 0 ? (
                        <List>
                            {venue.Reviews.map(review => (
                                <ListItem key={review.id} alignItems="flex-start" divider>
                                    <ListItemText
                                        primary={<Rating value={review.rating} readOnly />}
                                        secondary={
                                            <>
                                                {review.comment}
                                                <Typography variant="caption" display="block" sx={{mt: 1}}>
                                                    <em>- {review.User?.fullName || 'Anonymous'}</em>
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No reviews yet. Be the first to leave one!</Typography>
                    )}
                </Paper>

                {/* Conditionally render the AddReviewForm if the user is logged in */}
                {localStorage.getItem('token') && (
                    <AddReviewForm facilityId={id} onReviewAdded={fetchVenue} />
                )}
            </Box>

            {/* Renders the Booking Modal but keeps it hidden until 'openModal' is true */}
            {venue && <BookingModal open={openModal} handleClose={handleCloseModal} courts={venue.Courts || []} />}
        </Container>
    );
};

export default SingleVenuePage;