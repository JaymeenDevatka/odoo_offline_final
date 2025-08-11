import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Tabs, Tab, Grid, Card, CardContent, CardActions, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BookingTrendChart from '../charts/BookingTrendChart';
import MostActiveSportsChart from '../charts/MostActiveSportsChart';

const AdminDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [stats, setStats] = useState(null);
    const [pendingFacilities, setPendingFacilities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const [statsRes, facilitiesRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', config),
                axios.get('http://localhost:5000/api/admin/pending-facilities', config),
                axios.get('http://localhost:5000/api/admin/users', config)
            ]);
            setStats(statsRes.data);
            setPendingFacilities(facilitiesRes.data);
            setUsers(usersRes.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch admin data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpdateFacilityStatus = async (facilityId, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/facilities/${facilityId}/status`, { status }, config);
            fetchData();
        } catch (err) {
            setError('Failed to update facility status.');
        }
    };

    const handleUpdateUserStatus = async (userId, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { status }, config);
            fetchData();
        } catch (err) {
            setError(`Failed to update user status.`);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{m:4}}>{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Admin Dashboard</Typography>
                <Paper>
                    <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
                        <Tab label="Dashboard Overview" />
                        <Tab label={`Facility Approvals (${pendingFacilities.length})`} />
                        <Tab label="User Management" />
                    </Tabs>
                    
                    {/* Dashboard Overview Tab */}
                    {tabIndex === 0 && stats && (
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={3}><Paper sx={{p:2, textAlign:'center'}}><Typography variant="h6">Total Users</Typography><Typography variant="h4">{stats.kpis.totalUsers}</Typography></Paper></Grid>
                                <Grid item xs={6} md={3}><Paper sx={{p:2, textAlign:'center'}}><Typography variant="h6">Facility Owners</Typography><Typography variant="h4">{stats.kpis.totalOwners}</Typography></Paper></Grid>
                                <Grid item xs={6} md={3}><Paper sx={{p:2, textAlign:'center'}}><Typography variant="h6">Total Bookings</Typography><Typography variant="h4">{stats.kpis.totalBookings}</Typography></Paper></Grid>
                                <Grid item xs={6} md={3}><Paper sx={{p:2, textAlign:'center'}}><Typography variant="h6">Active Courts</Typography><Typography variant="h4">{stats.kpis.totalActiveCourts}</Typography></Paper></Grid>
                                
                                <Grid item xs={12} md={8}><BookingTrendChart chartData={stats.charts.bookingActivity} /></Grid>
                                <Grid item xs={12} md={4}><MostActiveSportsChart chartData={stats.charts.mostActiveSports} /></Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Facility Approvals Tab */}
                    {tabIndex === 1 && (
                        <Box sx={{ p: 3 }}>
                            {pendingFacilities.length === 0 ? (
                                <Typography>No facilities are currently pending approval.</Typography>
                            ) : (
                                pendingFacilities.map((facility) => (
                                    <Card key={facility.id} sx={{ mb: 2 }} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5">{facility.name}</Typography>
                                            <Typography color="text.secondary">{facility.address}</Typography>
                                            <Typography variant="body2" sx={{mt:1}}>{facility.description}</Typography>
                                            <Typography variant="caption" display="block" mt={1}>
                                                Submitted by: {facility.Owner?.fullName} ({facility.Owner?.email})
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" variant="contained" color="success" onClick={() => handleUpdateFacilityStatus(facility.id, 'approved')}>Approve</Button>
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateFacilityStatus(facility.id, 'rejected')}>Reject</Button>
                                        </CardActions>
                                    </Card>
                                ))
                            )}
                        </Box>
                    )}

                    {/* User Management Tab */}
                    {tabIndex === 2 && (
                        <TableContainer>
                            <Table>
                                <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell><Chip label={user.status} color={user.status === 'active' ? 'success' : 'error'} size="small" /></TableCell>
                                            <TableCell align="right">
                                                {user.status === 'active' ? (
                                                    <Button variant="outlined" color="error" size="small" onClick={() => handleUpdateUserStatus(user.id, 'banned')}>Ban</Button>
                                                ) : (
                                                    <Button variant="outlined" color="success" size="small" onClick={() => handleUpdateUserStatus(user.id, 'active')}>Unban</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default AdminDashboard;
