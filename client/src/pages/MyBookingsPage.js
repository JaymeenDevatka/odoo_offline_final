import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Divider, Chip } from '@mui/material';
import { format } from 'date-fns'; // Library to format dates

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to see your bookings.');
                    setLoading(false);
                    return;
                }
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
                setBookings(response.data);
            } catch (err) {
                setError('Failed to fetch your bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Bookings
                </Typography>
                <Paper elevation={3}>
                    {bookings.length === 0 ? (
                        <Typography sx={{ p: 3 }}>You have no bookings yet.</Typography>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {bookings.map((booking) => (
                                <React.Fragment key={booking.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primaryTypographyProps={{ variant: 'h6' }}
                                            primary={`${booking.Court.Facility.name} - ${booking.Court.name}`}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {format(new Date(booking.bookingStartTime), 'eeee, MMMM do, yyyy')}
                                                    </Typography>
                                                    <br />
                                                    {`Time: ${format(new Date(booking.bookingStartTime), 'p')} - ${format(new Date(booking.bookingEndTime), 'p')}`}
                                                </>
                                            }
                                        />
                                        <Chip label={booking.status} color={booking.status === 'Confirmed' ? 'success' : 'default'} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default MyBookingsPage;