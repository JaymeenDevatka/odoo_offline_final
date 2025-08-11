import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PeakHoursChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => `${d.hour}:00`), // e.g., "17:00", "18:00"
        datasets: [{
            label: 'Number of Bookings',
            data: chartData.map(d => d.count),
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
        }]
    };

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Peak Booking Hours</Typography>
            <Bar data={data} />
        </Paper>
    );
};

export default PeakHoursChart;