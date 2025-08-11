import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Card, CardContent, CardActions,
  CircularProgress, Alert, Button, Grid, Chip, Divider, Stack
} from '@mui/material';
import { format, isFuture } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = useCallback(async () => {
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

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, config);
        setMessage(response.data.message);
        fetchBookings();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const statusConfig = {
    Confirmed: { color: 'success', icon: <CheckCircleIcon /> },
    Cancelled: { color: 'error', icon: <CancelIcon /> },
    Pending: { color: 'warning', icon: <HourglassBottomIcon /> }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress size={50} />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Bookings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}

      {bookings.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" color="text.secondary">
            You have no bookings yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || { color: 'default', icon: null };
            return (
              <Grid item xs={12} key={booking.id}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {booking.Court.Facility.name} — {booking.Court.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.bookingStartTime), 'eeee, MMMM do, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(booking.bookingStartTime), 'p')} — {format(new Date(booking.bookingEndTime), 'p')}
                        </Typography>
                      </Box>

                      <Chip
                        icon={status.icon}
                        label={booking.status}
                        color={status.color}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Stack>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1.5 }}>
                    {booking.status === 'Confirmed' && isFuture(new Date(booking.bookingStartTime)) && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookingsPage;
