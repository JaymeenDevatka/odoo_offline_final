import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Typography, Box, CircularProgress, Alert, Paper, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip,
    Card, CardContent, CardActions
} from '@mui/material';

const AdminDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [pendingFacilities, setPendingFacilities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            setLoading(true);
            const [facilitiesRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/pending-facilities', config),
                axios.get('http://localhost:5000/api/admin/users', config)
            ]);
            setPendingFacilities(facilitiesRes.data);
            setUsers(usersRes.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch admin data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (url, body) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(url, body, config);
            fetchData(); // Refresh all data on any update
        } catch (err) {
            setError('Failed to perform action.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Admin Dashboard</Typography>
                <Paper>
                    <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
                        <Tab label={`Facility Approvals (${pendingFacilities.length})`} />
                        <Tab label={`User Management (${users.length})`} />
                    </Tabs>

                    {/* Facility Approvals Tab Panel */}
                    {tabIndex === 0 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Pending Facility Approvals</Typography>
                            {pendingFacilities.length === 0 ? (
                                <Typography>No facilities are currently pending approval.</Typography>
                            ) : (
                                <Box>
                                    {pendingFacilities.map((facility) => (
                                        <Card key={facility.id} sx={{ mb: 2 }} variant="outlined">
                                            <CardContent>
                                                <Typography variant="h5">{facility.name}</Typography>
                                                <Typography color="text.secondary">{facility.address}</Typography>
                                                <Typography variant="body2" sx={{mt:1}}>{facility.description}</Typography>
                                                <Typography variant="caption" display="block" mt={1}>
                                                    Submitted by: {facility.Owner?.fullName || 'N/A'} ({facility.Owner?.email || 'N/A'})
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" variant="contained" color="success" onClick={() => handleUpdateStatus(`http://localhost:5000/api/admin/facilities/${facility.id}/status`, { status: 'approved' })}>Approve</Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateStatus(`http://localhost:5000/api/admin/facilities/${facility.id}/status`, { status: 'rejected' })}>Reject</Button>
                                            </CardActions>
                                        </Card>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* User Management Tab Panel */}
                    {tabIndex === 1 && (
                        <TableContainer>
                            <Table>
                                <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.fullName}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.role}</TableCell>
                                            <TableCell><Chip label={user.status} color={user.status === 'active' ? 'success' : 'error'} size="small" /></TableCell>
                                            <TableCell align="right">
                                                {user.status === 'active' ? (
                                                    <Button variant="outlined" color="error" size="small" onClick={() => handleUpdateStatus(`http://localhost:5000/api/admin/users/${user.id}/status`, { status: 'banned' })}>Ban</Button>
                                                ) : (
                                                    <Button variant="outlined" color="success" size="small" onClick={() => handleUpdateStatus(`http://localhost:5000/api/admin/users/${user.id}/status`, { status: 'active' })}>Unban</Button>
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