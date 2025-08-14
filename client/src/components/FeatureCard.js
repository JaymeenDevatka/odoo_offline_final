import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, color = '#6C5CE7' }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: color,
                    boxShadow: `0 10px 20px ${color}20`
                }
            }}
        >
            <Box 
                sx={{ 
                    color: color,
                    fontSize: '2.5rem',
                    mb: 2
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.7)">
                {description}
            </Typography>
        </Paper>
    );
};

export default FeatureCard;