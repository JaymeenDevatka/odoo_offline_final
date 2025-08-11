import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Paper, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MostActiveSportsChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.sportType),
        datasets: [{
            label: 'Total Bookings',
            data: chartData.map(d => d.bookingCount),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }]
    };
    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Most Popular Sports</Typography>
            <Bar data={data} />
        </Paper>
    );
};

export default MostActiveSportsChart;