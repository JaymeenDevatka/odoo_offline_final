import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button, TextField, Alert } from '@mui/material';

// Using the same style as the BookingModal
const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 };

const AddCourtModal = ({ open, handleClose, onCourtAdded }) => {
    const [formData, setFormData] = useState({ name: '', sportType: '', pricePerHour: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/owner/courts', formData, config);
            onCourtAdded(); // This is a callback function to refresh the dashboard data
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add court.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6">Add New Court</Typography>
                <TextField fullWidth margin="normal" label="Court Name (e.g., Court 1)" name="name" onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Sport Type (e.g., Badminton)" name="sportType" onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Price Per Hour" name="pricePerHour" type="number" onChange={handleChange} />
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Add Court</Button>
            </Box>
        </Modal>
    );
};

export default AddCourtModal;