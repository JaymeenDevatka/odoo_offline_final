import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Paper, Grid, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditCourtModal from '../components/EditCourtModal';

const FacilityManagementPage = () => {
    const [facility, setFacility] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', address: '', amenities: '', venueType: 'Indoor' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchFacility = useCallback(async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const { data } = await axios.get('http://localhost:5000/api/owner/my-facility', config);
            setFacility(data);
            setFormData({
                name: data.name || '', description: data.description || '', address: data.address || '',
                amenities: data.amenities || '', venueType: data.venueType || 'Indoor'
            });
        } catch (err) {
            setError('Failed to load facility data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFacility(); }, [fetchFacility]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const { data } = await axios.put('http://localhost:5000/api/owner/my-facility', formData, config);
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        }
    };

    const handleOpenEditModal = (court) => {
        setSelectedCourt(court);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCourt(null);
    };

    if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <EditCourtModal open={isEditModalOpen} handleClose={handleCloseEditModal} court={selectedCourt} onCourtUpdated={fetchFacility} />
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Facility & Court Management</Typography>
                {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                
                <Paper component="form" onSubmit={handleUpdateDetails} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6">Edit Facility Details</Typography>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Facility Name" name="name" value={formData.name} onChange={handleChange} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
                        <Grid item xs={12}><TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Amenities (comma-separated)" name="amenities" value={formData.amenities} onChange={handleChange} /></Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth><InputLabel>Venue Type</InputLabel><Select name="venueType" value={formData.venueType} label="Venue Type" onChange={handleChange}><MenuItem value="Indoor">Indoor</MenuItem><MenuItem value="Outdoor">Outdoor</MenuItem><MenuItem value="Mixed">Mixed</MenuItem></Select></FormControl>
                        </Grid>
                    </Grid>
                    {message && <Alert severity="success" sx={{mt:2}}>{message}</Alert>}
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Facility Changes</Button>
                </Paper>

                <Paper sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h6">Manage Courts</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead><TableRow><TableCell>Court Name</TableCell><TableCell>Sport</TableCell><TableCell>Price/hr</TableCell><TableCell>Hours</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                            <TableBody>
                                {facility?.Courts?.map(court => (
                                    <TableRow key={court.id}>
                                        <TableCell>{court.name}</TableCell>
                                        <TableCell>{court.sportType}</TableCell>
                                        <TableCell>₹{court.pricePerHour}</TableCell>
                                        <TableCell>{court.operatingHoursStart ? `${court.operatingHoursStart} - ${court.operatingHoursEnd}` : 'Not Set'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleOpenEditModal(court)}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default FacilityManagementPage;
