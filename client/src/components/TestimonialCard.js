import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial }) => {
    return (
        <Paper 
            elevation={3}
            sx={{
                p: 4,
                borderRadius: '16px',
                maxWidth: '800px',
                mx: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    sx={{ 
                        width: 60, 
                        height: 60,
                        mr: 2,
                        border: '2px solid #6C5CE7'
                    }}
                />
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {testimonial.position}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "{testimonial.content}"
            </Typography>
        </Paper>
    );
};

export default TestimonialCard;