import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button, TextField, Alert } from '@mui/material';

const style = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 };

const EditCourtModal = ({ open, handleClose, court, onCourtUpdated }) => {
    const [formData, setFormData] = useState({ name: '', sportType: '', pricePerHour: '', operatingHoursStart: '', operatingHoursEnd: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (court) {
            setFormData({
                name: court.name || '',
                sportType: court.sportType || '',
                pricePerHour: court.pricePerHour || '',
                operatingHoursStart: court.operatingHoursStart || '',
                operatingHoursEnd: court.operatingHoursEnd || ''
            });
        }
    }, [court]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/owner/courts/${court.id}`, formData, config);
            onCourtUpdated();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update court.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6">Edit Court Details</Typography>
                <TextField fullWidth margin="normal" label="Court Name" name="name" value={formData.name} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Sport Type" name="sportType" value={formData.sportType} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Price Per Hour" name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Opening Hour (e.g., 09:00)" name="operatingHoursStart" type="time" value={formData.operatingHoursStart} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                <TextField fullWidth margin="normal" label="Closing Hour (e.g., 22:00)" name="operatingHoursEnd" type="time" value={formData.operatingHoursEnd} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Save Changes</Button>
            </Box>
        </Modal>
    );
};

export default EditCourtModal;
