import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import { Container, Grid, Typography, TextField, Box, Paper, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress } from '@mui/material';

const VenuesPage = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        sportType: '',
        maxPrice: '',
        venueType: '',
        minRating: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchVenues = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, ...filters });
            const response = await axios.get(`http://localhost:5000/api/venues?${params.toString()}`);
            
            // Defensive check to ensure data exists and is in the correct format
            if (response.data && Array.isArray(response.data.venues)) {
                setVenues(response.data.venues);
                setTotalPages(response.data.totalPages);
            } else {
                // If data is not as expected, reset to empty state
                setVenues([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Failed to fetch venues:', error);
            setVenues([]); // Reset on error as well
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchVenues() }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchVenues]);

    const handleFilterChange = (e) => {
        setPage(1);
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Find Your Court</Typography>
                
                <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField label="Search..." variant="outlined" name="search" value={filters.search} onChange={handleFilterChange} sx={{ flexGrow: 1, minWidth: '200px' }}/>
                    <FormControl sx={{ minWidth: 150 }}><InputLabel>Sport Type</InputLabel><Select name="sportType" value={filters.sportType} label="Sport Type" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="Badminton">Badminton</MenuItem><MenuItem value="Football">Football</MenuItem><MenuItem value="Tennis">Tennis</MenuItem><MenuItem value="Cricket">Cricket</MenuItem></Select></FormControl>
                    <FormControl sx={{ minWidth: 150 }}><InputLabel>Venue Type</InputLabel><Select name="venueType" value={filters.venueType} label="Venue Type" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="Indoor">Indoor</MenuItem><MenuItem value="Outdoor">Outdoor</MenuItem><MenuItem value="Mixed">Mixed</MenuItem></Select></FormControl>
                    <FormControl sx={{ minWidth: 150 }}><InputLabel>Max Price/hr</InputLabel><Select name="maxPrice" value={filters.maxPrice} label="Max Price/hr" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="300">Up to ₹300</MenuItem><MenuItem value="500">Up to ₹500</MenuItem><MenuItem value="1000">Up to ₹1000</MenuItem><MenuItem value="1500">Up to ₹1500</MenuItem></Select></FormControl>
                    <FormControl sx={{ minWidth: 150 }}><InputLabel>Min Rating</InputLabel><Select name="minRating" value={filters.minRating} label="Min Rating" onChange={handleFilterChange}><MenuItem value=""><em>Any</em></MenuItem><MenuItem value="4">4+ Stars</MenuItem><MenuItem value="3">3+ Stars</MenuItem><MenuItem value="2">2+ Stars</MenuItem></Select></FormControl>
                </Paper>

                {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box> ) : ( 
                    <Grid container spacing={4}>
                        {/* --- THIS IS THE FIX --- */}
                        {/* We use (venues || []) to provide an empty array as a fallback, preventing the .map error */}
                        {(venues || []).map((venue) => ( 
                            <Grid item key={venue.id} xs={12} sm={6} md={4}>
                                <VenueCard venue={venue} />
                            </Grid>
                        ))}
                    </Grid>
                )}
                
                {/* Show a message if there are no results */}
                {!loading && venues.length === 0 && (
                    <Typography align="center" sx={{mt: 5}}>No venues found matching your criteria. Try adjusting your filters.</Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
            </Box>
        </Container>
    );
};

export default VenuesPage;