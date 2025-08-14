import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Step,
  Stepper,
  StepLabel,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const steps = ['Select Details', 'Confirm & Pay'];

const BookingModal = ({ open, handleClose, courts }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [bookingTime, setBookingTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCourt) {
      const court = courts.find((c) => c.id === selectedCourt);
      setTotalPrice(court.pricePerHour * duration);
    }
  }, [selectedCourt, duration, courts]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleConfirmBooking = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const bookingData = {
        courtId: selectedCourt,
        bookingStartTime: bookingTime,
        durationInHours: duration,
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData, config);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
      handleBack();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" gutterBottom>
                Select Details
              </Typography>

              {/* Court Selection */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Court</InputLabel>
                <Select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                >
                  {courts.map((court) => (
                    <MenuItem key={court.id} value={court.id}>
                      {court.name} — ₹{court.pricePerHour}/hr
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Duration */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Duration</InputLabel>
                <Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <MenuItem value={1}>1 Hour</MenuItem>
                  <MenuItem value={2}>2 Hours</MenuItem>
                  <MenuItem value={3}>3 Hours</MenuItem>
                </Select>
              </FormControl>

              {/* Date Time Picker */}
              <DateTimePicker
                label="Select Date and Time"
                value={bookingTime}
                onChange={(newValue) => setBookingTime(newValue)}
                renderInput={(params) => (
                  <TextField fullWidth margin="normal" {...params} />
                )}
              />

              {/* Total Price Live Preview */}
              {selectedCourt && (
                <Paper
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: 'primary.light',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                  elevation={3}
                >
                  Total Price: ₹{totalPrice}
                </Paper>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleNext}
                disabled={!selectedCourt || !bookingTime}
              >
                Next
              </Button>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6">Confirm Details</Typography>
              <Typography>
                Court: {courts.find((c) => c.id === selectedCourt)?.name}
              </Typography>
              <Typography>
                Time: {bookingTime ? bookingTime.format('DD MMM YYYY, hh:mm A') : ''}
              </Typography>
              <Typography>Duration: {duration} hour(s)</Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total: ₹{totalPrice}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack}>Back</Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirmBooking}
                >
                  Simulate Payment & Confirm
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
};

export default BookingModal;
