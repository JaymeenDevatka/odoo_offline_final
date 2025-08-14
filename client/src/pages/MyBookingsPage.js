import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Chip, Button, Grid, Tabs, Tab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { format, isFuture, isPast } from 'date-fns';
import { toast } from 'react-toastify';

// Create a dark theme consistent with the rest of the app
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ff6a00' },
        background: { paper: '#1a1a1a', default: '#121212' },
    },
});

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
            setBookings(response.data);
        } catch (err) {
            setError('Failed to fetch your bookings.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, config);
                toast.success(response.data.message);
                fetchBookings();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to cancel booking.');
            }
        }
    };

    const statusConfig = {
        Confirmed: { color: 'success' },
        Pending: { color: 'warning' },
        Cancelled: { color: 'error' },
        Rejected: { color: 'error' },
        Completed: { color: 'info' },
    };

    const upcomingBookings = bookings.filter(b => b.status === 'Confirmed' && isFuture(new Date(b.bookingStartTime)));
    const pendingBookings = bookings.filter(b => b.status === 'Pending' && isFuture(new Date(b.bookingStartTime)));
    const pastBookings = bookings.filter(b => isPast(new Date(b.bookingStartTime)) || ['Cancelled', 'Rejected', 'Completed'].includes(b.status));

    const renderBookingList = (bookingList) => (
        <Grid container spacing={2} sx={{mt: 2, p: 2}}>
            {bookingList.length === 0 ? (
                <Grid item xs={12}><Typography sx={{p:3, textAlign: 'center', color: 'text.secondary'}}>No bookings in this category.</Typography></Grid>
            ) : (
                bookingList.map(booking => (
                    <Grid item xs={12} key={booking.id}>
                        <Paper 
                            elevation={3} 
                            sx={{
                                p: 2, 
                                borderRadius: 2, 
                                borderLeft: `4px solid ${darkTheme.palette[statusConfig[booking.status]?.color || 'grey']?.main}`
                            }}
                        >
                            <Grid container alignItems="center">
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h6" fontWeight="bold">{booking.Court.Facility.name} - {booking.Court.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{format(new Date(booking.bookingStartTime), 'eeee, MMMM do, yyyy')}</Typography>
                                    <Typography variant="body2" color="text.secondary">{format(new Date(booking.bookingStartTime), 'p')} - {format(new Date(booking.bookingEndTime), 'p')}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{textAlign: {xs: 'left', sm: 'right'}, mt: {xs: 1, sm: 0}}}>
                                    <Chip label={booking.status} color={statusConfig[booking.status]?.color || 'default'} sx={{mb: 1, mr: {sm: 1}, fontWeight: 'bold'}} />
                                    {(booking.status === 'Pending' || booking.status === 'Confirmed') && isFuture(new Date(booking.bookingStartTime)) && (
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleCancelBooking(booking.id)}>Cancel</Button>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))
            )}
        </Grid>
    );

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', color: 'white' }}>
                <Container maxWidth="md">
                    <Box sx={{ py: 4 }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>My Bookings</Typography>
                        {error && <Alert severity="error">{error}</Alert>}
                        
                        <Paper sx={{borderRadius: 2, mt: 2}}>
                            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
                                <Tab label={`Upcoming (${upcomingBookings.length})`} />
                                <Tab label={`Pending (${pendingBookings.length})`} />
                                <Tab label="History" />
                            </Tabs>
                            {tabIndex === 0 && renderBookingList(upcomingBookings)}
                            {tabIndex === 1 && renderBookingList(pendingBookings)}
                            {tabIndex === 2 && renderBookingList(pastBookings)}
                        </Paper>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default MyBookingsPage;
