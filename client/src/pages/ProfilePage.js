import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Avatar, Paper, Alert } from '@mui/material';

const ProfilePage = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '' });
    const [profileAvatar, setProfileAvatar] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
                setFormData({ fullName: data.fullName, email: data.email });
                setProfileAvatar(data.avatar);
            } catch (err) {
                setError('Could not load profile data.');
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4, mt: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={profileAvatar} sx={{ width: 100, height: 100, mb: 2 }} />
                    <Typography variant="h4">{formData.fullName}</Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Full Name" 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Email Address" 
                        name="email"
                        type="email"
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                    {message && <Alert severity="success" sx={{mt:2}}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                        Update Profile
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProfilePage;
