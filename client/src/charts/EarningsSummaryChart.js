import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Paper, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const EarningsSummaryChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(d => d.name), // e.g., "Court 1", "Turf A"
        datasets: [{
            label: 'Earnings',
            data: chartData.map(d => d.totalEarnings),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ],
        }]
    };

    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Earnings Summary by Court</Typography>
            <Doughnut data={data} />
        </Paper>
    );
};

export default EarningsSummaryChart;