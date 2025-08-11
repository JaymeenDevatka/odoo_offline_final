import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Alert } from '@mui/material';

// Style for the modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BookingModal = ({ open, handleClose, courts }) => {
    const [selectedCourt, setSelectedCourt] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const bookingData = { courtId: selectedCourt, bookingStartTime: bookingTime };

            const response = await axios.post('http://localhost:5000/api/bookings', bookingData, config);
            setSuccess(response.data.message);
            // Optional: Close modal after a short delay
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Book a Slot</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select Court</InputLabel>
                    <Select value={selectedCourt} label="Select Court" onChange={(e) => setSelectedCourt(e.target.value)}>
                        {courts.map(court => (
                            <MenuItem key={court.id} value={court.id}>
                                {court.name} ({court.sportType}) - ₹{court.pricePerHour}/hr
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Select Date and Time"
                    type="datetime-local"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }} disabled={!selectedCourt || !bookingTime}>
                    Confirm Booking
                </Button>
            </Box>
        </Modal>
    );
};

export default BookingModal;