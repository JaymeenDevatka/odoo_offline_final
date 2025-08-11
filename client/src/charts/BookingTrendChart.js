import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BookingTrendChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
            label: 'Bookings per Day',
            data: chartData.map(d => d.count),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Daily Booking Trends</Typography>
            <Line data={data} />
        </Paper>
    );
};

export default BookingTrendChart;