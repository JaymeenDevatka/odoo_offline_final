import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddCourtModal from '../components/AddCourtModal';
import BookingTrendChart from '../charts/BookingTrendChart';

// MUI Imports
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FacilityOwnerDashboard = () => {
    // State for all dashboard data
    const [dashboardData, setDashboardData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openAddCourtModal, setOpenAddCourtModal] = useState(false);
    const navigate = useNavigate();

    // A single function to fetch all data, wrapped in useCallback
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            // Fetch both main dashboard data and chart data in parallel
            const [dashboardResponse, chartResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/owner/dashboard', config),
                axios.get('http://localhost:5000/api/owner/chart-data', config)
            ]);
            
            setDashboardData(dashboardResponse.data);
            setChartData(chartResponse.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch when component mounts
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleDeleteCourt = async (courtId) => {
        if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/owner/courts/${courtId}`, config);
                fetchAllData(); // Refresh all dashboard data
            } catch (err) {
                setError('Failed to delete court.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    if (!dashboardData) return <Typography sx={{m: 4}}>No dashboard data found. Have you added your facility yet?</Typography>;

    const allBookings = dashboardData.facility.Courts.flatMap(court => court.Bookings.map(b => ({...b, courtName: court.name})));

    return (
        <Container maxWidth="lg">
            <AddCourtModal open={openAddCourtModal} handleClose={() => setOpenAddCourtModal(false)} onCourtAdded={fetchAllData} />
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        {dashboardData.facility.name} Dashboard
                    </Typography>
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                </Box>
                
                {/* Section for Key Performance Indicators (KPIs) */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Total Earnings</Typography><Typography variant="h4">₹{dashboardData.kpis.totalEarnings.toFixed(2)}</Typography></Paper></Grid>
                    <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Total Bookings</Typography><Typography variant="h4">{dashboardData.kpis.totalBookings}</Typography></Paper></Grid>
                    <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Active Courts</Typography><Typography variant="h4">{dashboardData.kpis.activeCourts}</Typography></Paper></Grid>
                </Grid>

                {/* Section for Charts */}
                <Box sx={{ mt: 4 }}>
                    {chartData?.bookingTrends ? (
                        <BookingTrendChart chartData={chartData.bookingTrends} />
                    ) : (
                        <Typography>Loading chart data...</Typography>
                    )}
                </Box>
                
                {/* Section for Court Management */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, mb: 2 }}>
                    <Typography variant="h5" component="h2">My Courts</Typography>
                    <Button variant="contained" onClick={() => setOpenAddCourtModal(true)}>Add New Court</Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead><TableRow><TableCell>Court Name</TableCell><TableCell>Sport</TableCell><TableCell>Price/hr</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                        <TableBody>
                            {dashboardData.facility.Courts.map((court) => (
                                <TableRow key={court.id}><TableCell>{court.name}</TableCell><TableCell>{court.sportType}</TableCell><TableCell>₹{court.pricePerHour}</TableCell><TableCell align="right"><IconButton onClick={() => handleDeleteCourt(court.id)} color="error"><DeleteIcon /></IconButton></TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Section for Booking Overview */}
                <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>Booking Overview</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead><TableRow><TableCell>User</TableCell><TableCell>Court</TableCell><TableCell>Booking Time</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                        <TableBody>
                            {allBookings.map((booking) => (
                                <TableRow key={booking.id}><TableCell>{booking.User.fullName}</TableCell><TableCell>{booking.courtName}</TableCell><TableCell>{format(new Date(booking.bookingStartTime), 'Pp')}</TableCell><TableCell>{booking.status}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
        </Container>
    );
};

export default FacilityOwnerDashboard;