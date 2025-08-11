import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper, Grid, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import EditCourtModal from '../components/EditCourtModal';

// Create a dark theme consistent with the owner dashboard
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ff6a00' },
        background: { paper: '#1a1a1a', default: '#121212' },
    },
});

const FacilityManagementPage = () => {
    const [facility, setFacility] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', address: '', amenities: '', venueType: 'Indoor' });
    const [blockSlotData, setBlockSlotData] = useState({ courtId: '', startTime: '', endTime: '', reason: 'Maintenance' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [hasFacility, setHasFacility] = useState(false);
    const navigate = useNavigate();

    const fetchFacility = useCallback(async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const { data } = await axios.get('http://localhost:5000/api/owner/my-facility', config);
            if (data) {
                setFacility(data);
                setFormData({
                    name: data.name || '', description: data.description || '', address: data.address || '',
                    amenities: data.amenities || '', venueType: data.venueType || 'Indoor'
                });
                setHasFacility(true);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setHasFacility(false);
            } else {
                setError('Failed to load facility data.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFacility(); }, [fetchFacility]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleBlockSlotChange = (e) => setBlockSlotData({ ...blockSlotData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            let response;
            if (hasFacility) {
                response = await axios.put('http://localhost:5000/api/owner/my-facility', formData, config);
                toast.success(response.data.message);
                fetchFacility();
            } else {
                response = await axios.post('http://localhost:5000/api/owner/my-facility', formData, config);
                toast.success(response.data.message);
                // --- IMPROVED USER FLOW ---
                // Redirect back to the dashboard after creating a new facility
                setTimeout(() => navigate('/owner/dashboard'), 2000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed.');
        }
    };
    
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', 'your_cloudinary_unsigned_preset'); // Replace
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, uploadFormData); // Replace
            const imageUrl = response.data.secure_url;
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/owner/my-facility/photos', { imageUrl }, config);
            toast.success("Photo uploaded!");
            fetchFacility();
        } catch (err) {
            toast.error('Image upload failed.');
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                await axios.delete(`http://localhost:5000/api/owner/my-facility/photos/${photoId}`, config);
                toast.success("Photo deleted!");
                fetchFacility();
            } catch (err) {
                toast.error('Failed to delete photo.');
            }
        }
    };

    const handleBlockSlot = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.post('http://localhost:5000/api/owner/block-slot', blockSlotData, config);
            toast.success('Time slot has been successfully blocked.');
            fetchFacility();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to block slot.');
        }
    };

    const handleOpenEditModal = (court) => { setSelectedCourt(court); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setSelectedCourt(null); };

    if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress /></Box>;

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', color: 'white', py: 4 }}>
                <Container maxWidth="lg">
                    <EditCourtModal open={isEditModalOpen} handleClose={handleCloseEditModal} court={selectedCourt} onCourtUpdated={fetchFacility} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        {hasFacility ? 'Facility & Court Management' : 'Create Your Facility'}
                    </Typography>
                    {error && <Alert severity="error" onClose={() => setError('')} sx={{mb:2}}>{error}</Alert>}
                    
                    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                        <Typography variant="h6">{hasFacility ? 'Edit Facility Details' : 'Add Facility Details'}</Typography>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Facility Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} required /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Amenities (comma-separated)" name="amenities" value={formData.amenities} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Venue Type</InputLabel><Select name="venueType" value={formData.venueType} label="Venue Type" onChange={handleChange}><MenuItem value="Indoor">Indoor</MenuItem><MenuItem value="Outdoor">Outdoor</MenuItem><MenuItem value="Mixed">Mixed</MenuItem></Select></FormControl></Grid>
                        </Grid>
                        <Button type="submit" variant="contained" sx={{ mt: 2, background: 'linear-gradient(90deg, #ff6a00, #ee0979)' }}>
                            {hasFacility ? 'Save Changes' : 'Create Facility'}
                        </Button>
                    </Paper>

                    {hasFacility && (
                        <>
                            <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom>Manage Photo Gallery</Typography>
                                <Grid container spacing={2}>
                                    {facility?.FacilityPhotos?.map(photo => (
                                        <Grid item key={photo.id} xs={6} sm={4} md={3}>
                                            <Box sx={{ position: 'relative' }}>
                                                <img src={photo.imageUrl} alt="Facility" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                                <IconButton size="small" onClick={() => handleDeletePhoto(photo.id)} sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': {backgroundColor: 'rgba(0,0,0,0.7)'} }}><DeleteIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                    <Grid item xs={6} sm={4} md={3}>
                                        <Button variant="outlined" component="label" sx={{ width: '100%', height: '150px', display: 'flex', flexDirection: 'column' }}>
                                            <AddPhotoAlternateIcon /> Add Photo
                                            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
                                <Typography variant="h6">Manage Courts</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead><TableRow><TableCell>Court Name</TableCell><TableCell>Sport</TableCell><TableCell>Price/hr</TableCell><TableCell>Hours</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                        <TableBody>
                                            {facility?.Courts?.map(court => (
                                                <TableRow key={court.id}>
                                                    <TableCell>{court.name}</TableCell><TableCell>{court.sportType}</TableCell><TableCell>₹{court.pricePerHour}</TableCell>
                                                    <TableCell>{court.operatingHoursStart ? `${court.operatingHoursStart} - ${court.operatingHoursEnd}` : 'Not Set'}</TableCell>
                                                    <TableCell align="right"><IconButton color="primary" onClick={() => handleOpenEditModal(court)}><EditIcon /></IconButton></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            <Paper component="form" onSubmit={handleBlockSlot} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
                                <Typography variant="h6">Block Time Slots for Maintenance</Typography>
                                <Grid container spacing={2} sx={{mt: 1}}>
                                    <Grid item xs={12} sm={4}><FormControl fullWidth><InputLabel>Select Court</InputLabel><Select name="courtId" value={blockSlotData.courtId} label="Select Court" onChange={handleBlockSlotChange}>{facility?.Courts?.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}</Select></FormControl></Grid>
                                    <Grid item xs={12} sm={3}><TextField fullWidth label="Start Time" name="startTime" type="datetime-local" onChange={handleBlockSlotChange} InputLabelProps={{ shrink: true }} /></Grid>
                                    <Grid item xs={12} sm={3}><TextField fullWidth label="End Time" name="endTime" type="datetime-local" onChange={handleBlockSlotChange} InputLabelProps={{ shrink: true }} /></Grid>
                                    <Grid item xs={12} sm={2}><Button type="submit" variant="contained" color="error" fullWidth sx={{height: '100%'}}>Block Slot</Button></Grid>
                                </Grid>
                            </Paper>
                        </>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default FacilityManagementPage;
