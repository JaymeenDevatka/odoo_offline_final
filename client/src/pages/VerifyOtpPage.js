import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Get email passed from the register page

    if (!email) {
        return <Alert severity="error">No email found. Please go back to the registration page.</Alert>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Verify Your Email</Typography>
                <Typography sx={{ mt: 1 }}>An OTP has been sent to {email}.</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth label="Enter 6-Digit OTP" name="otp" onChange={(e) => setOtp(e.target.value)} />
                    {error && <Alert severity="error">{error}</Alert>}
                    {message && <Alert severity="success">{message}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Verify</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default VerifyOtpPage;