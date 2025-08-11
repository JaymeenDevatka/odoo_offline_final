import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, CardActionArea, Box, Rating, Chip } from '@mui/material';

const VenueCard = ({ venue }) => {
    // Split the sportTypes string into an array, or use an empty array if it's null
    const sports = venue.sportTypes ? venue.sportTypes.split(',') : [];

    return (
        <Link to={`/venue/${venue.id}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {venue.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={parseFloat(venue.averageRating)} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {venue.averageRating ? parseFloat(venue.averageRating).toFixed(1) : 'No reviews'}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {venue.address}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                            Starts from ₹{venue.startingPrice || 'N/A'}/hr
                        </Typography>
                        
                        {/* 👇 This is the new section to display sport types */}
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {sports.map((sport, index) => (
                                <Chip key={index} label={sport} size="small" />
                            ))}
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default VenueCard;