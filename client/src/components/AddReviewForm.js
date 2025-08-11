import React, { useState } from 'react';
import axios from 'axios';
// Paper has been added to the import list below
import { Box, Typography, Rating, TextField, Button, Alert, Paper } from '@mui/material';

const AddReviewForm = ({ facilityId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:5000/api/reviews/${facilityId}`, { rating, comment }, config);
            onReviewAdded(); // Refresh the reviews list
            setRating(0);
            setComment('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        }
    };

    return (
        <Box component={Paper} elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6">Leave a Review</Typography>
            <Rating name="rating" value={rating} onChange={(e, newValue) => setRating(newValue)} />
            <TextField fullWidth multiline rows={3} margin="normal" label="Your Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
            <Button variant="contained" onClick={handleSubmit}>Submit Review</Button>
        </Box>
    );
};

export default AddReviewForm;