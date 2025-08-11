import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Alert, Step, Stepper, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const style = { /* ... same style object as before ... */ };
const steps = ['Select Details', 'Confirm & Pay'];

const BookingModal = ({ open, handleClose, courts }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedCourt, setSelectedCourt] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [duration, setDuration] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Calculate total price whenever the court or duration changes
    useEffect(() => {
        if (selectedCourt) {
            const court = courts.find(c => c.id === selectedCourt);
            setTotalPrice(court.pricePerHour * duration);
        }
    }, [selectedCourt, duration, courts]);

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);

    const handleConfirmBooking = async () => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const bookingData = { courtId: selectedCourt, bookingStartTime: bookingTime, durationInHours: duration };

            await axios.post('http://localhost:5000/api/bookings', bookingData, config);
            
            // After success, redirect to "My Bookings"
            navigate('/my-bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed.');
            handleBack(); // Go back to the selection step on error
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                </Stepper>

                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h6">Select Details</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Select Court</InputLabel>
                            <Select value={selectedCourt} label="Select Court" onChange={(e) => setSelectedCourt(e.target.value)}>
                                {courts.map(court => <MenuItem key={court.id} value={court.id}>{court.name} - ₹{court.pricePerHour}/hr</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Duration</InputLabel>
                            <Select value={duration} label="Duration" onChange={(e) => setDuration(e.target.value)}>
                                <MenuItem value={1}>1 Hour</MenuItem><MenuItem value={2}>2 Hours</MenuItem><MenuItem value={3}>3 Hours</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth margin="normal" label="Select Date and Time" type="datetime-local" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} InputLabelProps={{ shrink: true }}/>
                        <Button variant="contained" onClick={handleNext} disabled={!selectedCourt || !bookingTime}>Next</Button>
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6">Confirm Details</Typography>
                        <Typography>Court: {courts.find(c => c.id === selectedCourt)?.name}</Typography>
                        <Typography>Time: {new Date(bookingTime).toLocaleString()}</Typography>
                        <Typography>Duration: {duration} hour(s)</Typography>
                        <Typography variant="h5" sx={{ mt: 2 }}>Total: ₹{totalPrice}</Typography>
                        {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}
                        <Box sx={{ mt: 2 }}>
                            <Button onClick={handleBack}>Back</Button>
                            <Button variant="contained" color="success" onClick={handleConfirmBooking} sx={{ ml: 1 }}>Simulate Payment & Confirm</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default BookingModal;