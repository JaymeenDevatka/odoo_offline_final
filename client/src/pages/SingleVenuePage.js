import React from 'react'; // Corrected this line
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import AddReviewForm from '../components/AddReviewForm';

// MUI Imports
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Button, 
    CircularProgress, 
    Alert, 
    Rating,
    Chip 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SingleVenuePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);

    const fetchVenue = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/venues/${id}`);
            setVenue(response.data);
        } catch (err) {
            setError('Failed to fetch venue details. It may not be approved or does not exist.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchVenue();
    }, [fetchVenue]);

    const handleOpenModal = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    if (!venue) {
        return <Typography>Venue not found.</Typography>;
    }

    const amenities = venue.amenities ? venue.amenities.split(',') : [];

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {/* Photo Gallery Section */}
                <Grid container spacing={1} sx={{ mb: 4 }}>
                    {venue.FacilityPhotos && venue.FacilityPhotos.length > 0 ? (
                        <Grid item xs={12} md={8} sx={{ height: '450px' }}>
                            <img src={venue.FacilityPhotos[0].imageUrl} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        </Grid>
                    ) : (
                        <Grid item xs={12} md={8} sx={{ height: '450px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                            <Typography>No Photos Available</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12} md={4} container spacing={1}>
                        {venue.FacilityPhotos?.slice(1, 3).map(photo => (
                            <Grid item xs={12} key={photo.id} sx={{ height: '225px' }}>
                                <img src={photo.imageUrl} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Typography variant="h3" component="h1" gutterBottom>{venue.name}</Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>{venue.address}</Typography>
                
                <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                    <Typography variant="h5" gutterBottom>About Venue</Typography>
                    <Typography>{venue.description}</Typography>
                </Paper>

                {/* Amenities Section */}
                {amenities.length > 0 && (
                    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                        <Typography variant="h5" gutterBottom>Amenities</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {amenities.map((amenity, index) => (
                                <Chip key={index} icon={<CheckCircleIcon />} label={amenity.trim()} variant="outlined" color="success" />
                            ))}
                        </Box>
                    </Paper>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>Available Courts</Typography>
                        <List>
                            {venue.Courts?.length > 0 ? (
                                venue.Courts.map(court => (
                                    <ListItem key={court.id} divider>
                                        <ListItemText 
                                            primary={`${court.name} - ${court.sportType}`}
                                            secondary={`₹${court.pricePerHour} per hour`}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No courts listed for this venue.</Typography>
                            )}
                        </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" gutterBottom>Book Your Slot</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary" size="large" fullWidth onClick={handleOpenModal}>
                                Book Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* User Reviews Section */}
                <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                    <Typography variant="h5" gutterBottom>User Reviews</Typography>
                    {venue.Reviews && venue.Reviews.length > 0 ? (
                        <List>
                            {venue.Reviews.map(review => (
                                <ListItem key={review.id} alignItems="flex-start" divider>
                                    <ListItemText
                                        primary={<Rating value={review.rating} readOnly />}
                                        secondary={
                                            <>
                                                {review.comment}
                                                <Typography variant="caption" display="block" sx={{mt: 1}}>
                                                    <em>- {review.User?.fullName || 'Anonymous'}</em>
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No reviews yet. Be the first to leave one!</Typography>
                    )}
                </Paper>

                {localStorage.getItem('token') && (
                    <AddReviewForm facilityId={id} onReviewAdded={fetchVenue} />
                )}
            </Box>

            {venue && <BookingModal open={openModal} handleClose={handleCloseModal} courts={venue.Courts || []} />}
        </Container>
    );
};

export default SingleVenuePage;
