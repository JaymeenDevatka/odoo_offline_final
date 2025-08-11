import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddCourtModal from '../components/AddCourtModal';
import BookingTrendChart from '../charts/BookingTrendChart';
import EarningsSummaryChart from '../charts/EarningsSummaryChart';
import PeakHoursChart from '../charts/PeakHoursChart';
// Import Calendar components
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parse, startOfWeek, getDay } from 'date-fns';


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
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Setup for the calendar localizer
const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Create a dark theme specifically for this dashboard
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff6a00',
        },
        background: {
            paper: '#1a1a1a',
            default: '#121212',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 'bold',
                },
            },
        },
    },
});

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
            const [dashboardResponse, chartResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/owner/dashboard', config),
                axios.get('http://localhost:5000/api/owner/chart-data', config)
            ]);
            
            setDashboardData(dashboardResponse.data);
            setChartData(chartResponse.data);
            setError('');
        } catch (err) {
            // Specifically check for the "not found" error
            if (err.response && err.response.status === 404) {
                setError(err.response.data.message);
            } else {
                setError('Failed to load dashboard data.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleDeleteCourt = async (courtId) => {
        if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/owner/courts/${courtId}`, config);
                fetchAllData();
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
    
    // --- THIS IS THE NEW LOGIC ---
    // If there's an error specifically about not having a facility, show a welcome screen.
    if (error === "You have not created a facility yet.") {
        return (
            <ThemeProvider theme={darkTheme}>
                 <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Container maxWidth="sm">
                        <Typography variant="h4" gutterBottom>Welcome to QuickCourt!</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{mb: 4}}>It looks like you haven't set up your facility yet. Let's get started.</Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={() => navigate('/owner/manage-facility')}
                            sx={{background: 'linear-gradient(90deg, #ff6a00, #ee0979)'}}
                        >
                            Create Your Facility
                        </Button>
                    </Container>
                </Box>
            </ThemeProvider>
        );
    }

    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    if (!dashboardData) return null; // Should not be reached if loading/error is handled

    const allBookings = dashboardData.facility.Courts.flatMap(court => court.Bookings.map(b => ({...b, courtName: court.name})));

    const calendarEvents = allBookings.map(booking => ({
        title: `${booking.courtName} - ${booking.User.fullName}`,
        start: new Date(booking.bookingStartTime),
        end: new Date(booking.bookingEndTime),
        allDay: false,
    }));

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'white' }}>
                <Container maxWidth="lg">
                    <AddCourtModal open={openAddCourtModal} handleClose={() => setOpenAddCourtModal(false)} onCourtAdded={fetchAllData} />
                    <Box sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" component="h1">
                                {dashboardData.facility.name} Dashboard
                            </Typography>
                            <Box>
                                <Button variant="contained" onClick={() => navigate('/owner/manage-facility')} sx={{mr: 2}}>
                                    Manage Facility
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
                            </Box>
                        </Box>
                        
                        {/* KPI Cards */}
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={4}><Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}><Typography variant="h6">Total Earnings</Typography><Typography variant="h4" color="primary" fontWeight="bold">₹{dashboardData.kpis.totalEarnings.toFixed(2)}</Typography></Paper></Grid>
                            <Grid item xs={12} md={4}><Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}><Typography variant="h6">Total Bookings</Typography><Typography variant="h4" color="primary" fontWeight="bold">{dashboardData.kpis.totalBookings}</Typography></Paper></Grid>
                            <Grid item xs={12} md={4}><Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}><Typography variant="h6">Active Courts</Typography><Typography variant="h4" color="primary" fontWeight="bold">{dashboardData.kpis.activeCourts}</Typography></Paper></Grid>
                        </Grid>
                        
                        <Paper sx={{ p: 2, mt: 4, borderRadius: 3, height: '600px' }}>
                            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Booking Calendar</Typography>
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ color: 'white' }}
                            />
                        </Paper>

                        {/* Charts */}
                        <Grid container spacing={3} sx={{ mt: 4 }}>
                            <Grid item xs={12} md={8}>
                                {chartData?.bookingTrends ? <BookingTrendChart chartData={chartData.bookingTrends} /> : <Paper sx={{p:2, height: '100%'}}><Typography>Loading chart data...</Typography></Paper>}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                {chartData?.earningsSummary ? <EarningsSummaryChart chartData={chartData.earningsSummary} /> : <Paper sx={{p:2, height: '100%'}}><Typography>Loading chart data...</Typography></Paper>}
                            </Grid>
                            <Grid item xs={12}>
                                {chartData?.peakHours ? <PeakHoursChart chartData={chartData.peakHours} /> : <Paper sx={{p:2, height: '100%'}}><Typography>Loading chart data...</Typography></Paper>}
                            </Grid>
                        </Grid>
                        
                        {/* Court Management */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, mb: 2 }}>
                            <Typography variant="h5" component="h2">My Courts</Typography>
                            <Button variant="contained" sx={{background: 'linear-gradient(90deg, #ff6a00, #ee0979)'}} onClick={() => setOpenAddCourtModal(true)}>Add New Court</Button>
                        </Box>
                        <TableContainer component={Paper} sx={{borderRadius: 3}}>
                            <Table>
                                <TableHead><TableRow><TableCell>Court Name</TableCell><TableCell>Sport</TableCell><TableCell>Price/hr</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {dashboardData.facility.Courts.map((court) => (
                                        <TableRow key={court.id}><TableCell>{court.name}</TableCell><TableCell>{court.sportType}</TableCell><TableCell>₹{court.pricePerHour}</TableCell><TableCell align="right"><IconButton onClick={() => handleDeleteCourt(court.id)} color="error"><DeleteIcon /></IconButton></TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Booking Overview */}
                        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>Booking Overview</Typography>
                        <TableContainer component={Paper} sx={{borderRadius: 3}}>
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
            </Box>
        </ThemeProvider>
    );
};

export default FacilityOwnerDashboard;
