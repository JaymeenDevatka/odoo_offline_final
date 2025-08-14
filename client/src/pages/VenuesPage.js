import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Button,
  Badge,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { 
  createTheme, 
  ThemeProvider, 
  alpha, 
  styled 
} from '@mui/material/styles';
import { 
  motion, 
  AnimatePresence,
  LayoutGroup
} from 'framer-motion';
import { 
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  SportsSoccer as SoccerIcon,
  SportsBasketball as BasketballIcon,
  SportsTennis as TennisIcon,
  Pool as PoolIcon,
  DirectionsRun as RunningIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Custom styled components
const GradientText = styled('span')(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700
}));

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`
}));

// Enhanced dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF6D00' },
    secondary: { main: '#00E5FF' },
    background: { 
      paper: '#1E1E1E', 
      default: '#121212',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-1px',
      lineHeight: 1.1
    },
    h6: {
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});

// Sport type options with icons
const sportTypes = [
  { value: 'Football', label: 'Football', icon: <SoccerIcon />, color: '#00E676' },
  { value: 'Basketball', label: 'Basketball', icon: <BasketballIcon />, color: '#FF5252' },
  { value: 'Tennis', label: 'Tennis', icon: <TennisIcon />, color: '#2979FF' },
  { value: 'Swimming', label: 'Swimming', icon: <PoolIcon />, color: '#00B0FF' },
  { value: 'Running', label: 'Running', icon: <RunningIcon />, color: '#FF6D00' },
];

const venueTypes = [
  { value: 'Indoor', label: 'Indoor' },
  { value: 'Outdoor', label: 'Outdoor' },
  { value: 'Mixed', label: 'Mixed' }
];

const priceRanges = [
  { value: 300, label: '₹300' },
  { value: 500, label: '₹500' },
  { value: 1000, label: '₹1000' },
  { value: 2000, label: '₹2000' }
];

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', 
    sportType: '', 
    maxPrice: '', 
    venueType: '', 
    minRating: '',
    amenities: []
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const isMobile = useMediaQuery('(max-width:900px)');

  // Mock amenities - in a real app these would come from API
  const amenitiesList = [
    'Parking',
    'Locker Room',
    'Showers',
    'Cafeteria',
    'WiFi',
    'Equipment Rental'
  ];

  // Fetch venues with error handling
  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page, 
        ...filters,
        amenities: filters.amenities.join(','),
        limit: 12
      });
      
      const { data } = await axios.get(`http://localhost:5000/api/venues?${params}`);
      
      setVenues(data.venues || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setVenues([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // Debounced fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(fetchVenues, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchVenues]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAmenityToggle = (amenity) => {
    setPage(1);
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({
      search: '', 
      sportType: '', 
      maxPrice: '', 
      venueType: '', 
      minRating: '',
      amenities: []
    });
  };

  // Active filter count
  const activeFilterCount = Object.values(filters).reduce((count, val) => {
    if (Array.isArray(val)) return count + val.length;
    return count + (val !== '' ? 1 : 0);
  }, 0);

  // Rating stars component
  const RatingFilter = () => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          size="small"
          onClick={() => {
            setPage(1);
            setFilters(prev => ({
              ...prev,
              minRating: prev.minRating === star.toString() ? '' : star.toString()
            }));
          }}
        >
          {star <= parseInt(filters.minRating || 0) ? (
            <StarIcon color="primary" />
          ) : (
            <StarBorderIcon color="disabled" />
          )}
        </IconButton>
      ))}
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        color: 'text.primary',
        minHeight: '100vh',
        pt: { xs: 2, md: 0 }
      }}>

        {/* Hero Section with animated gradient */}
        <Box
          sx={{
            position: 'relative',
            py: { xs: 8, md: 12 },
            px: 2,
            textAlign: "center",
            background: `
              linear-gradient(135deg, rgba(18,18,18,0.95) 0%, rgba(30,30,30,0.98) 100%),
              url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #FF6D00 0%, #00E5FF 100%)',
            }
          }}
        >
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  lineHeight: 1.1
                }}
              >
                Discover <GradientText>Premium</GradientText> Sports Venues
              </Typography>
              
              <Typography
                variant="h6"
                sx={{ 
                  opacity: 0.9, 
                  maxWidth: "650px", 
                  mx: "auto",
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Book world-class facilities with instant confirmation and exclusive member benefits
              </Typography>

              {/* Search Bar in Hero */}
              <GlassPaper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                sx={{
                  p: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 50,
                  mx: 'auto',
                  maxWidth: '700px'
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search venues by name, location or sport..."
                  InputProps={{
                    disableUnderline: true,
                    sx: { px: 3, py: 1.5, fontSize: '1rem' },
                    startAdornment: (
                      <SearchIcon sx={{ 
                        color: 'text.secondary', 
                        mr: 1,
                        fontSize: '1.5rem'
                      }} />
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 50,
                    px: 3,
                    py: 1.5,
                    minWidth: '120px',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(255, 109, 0, 0.3)'
                    }
                  }}
                  onClick={fetchVenues}
                >
                  Search
                </Button>
              </GlassPaper>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, md: 3 } }}>

          {/* View Toggle and Filter Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              sx={{
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 1,
                  border: 'none',
                  '&.Mui-selected': {
                    bgcolor: alpha(darkTheme.palette.primary.main, 0.2),
                    color: darkTheme.palette.primary.main
                  }
                }
              }}
            >
              <ToggleButton value="grid">
                Grid View
              </ToggleButton>
              <ToggleButton value="map">
                Map View
              </ToggleButton>
            </ToggleButtonGroup>

            <Badge 
              badgeContent={activeFilterCount} 
              color="primary"
              overlap="circular"
              sx={{ 
                '& .MuiBadge-badge': {
                  right: 5,
                  top: 5,
                  bgcolor: 'primary.main',
                  color: 'common.white'
                }
              }}
            >
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderRadius: 50,
                  px: 3,
                  borderColor: alpha(darkTheme.palette.divider, 0.3),
                  '&:hover': {
                    borderColor: darkTheme.palette.primary.main
                  }
                }}
              >
                Filters
              </Button>
            </Badge>
          </Box>

          {/* Filter Panel - Collapsible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassPaper
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    color: 'text.secondary'
                  }}>
                    <FilterIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">FILTER OPTIONS</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Button 
                      startIcon={<CloseIcon />}
                      onClick={clearFilters}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      Clear all
                    </Button>
                  </Box>
                  
                  <Divider sx={{ mb: 3, bgcolor: 'divider' }} />
                  
                  <Grid container spacing={3}>
                    {/* Sport Type Filter */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Sport Type
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {sportTypes.map((sport) => (
                          <Chip
                            key={sport.value}
                            label={sport.label}
                            icon={sport.icon}
                            onClick={() => {
                              setPage(1);
                              setFilters(prev => ({
                                ...prev,
                                sportType: prev.sportType === sport.value ? '' : sport.value
                              }));
                            }}
                            variant={filters.sportType === sport.value ? 'filled' : 'outlined'}
                            color={filters.sportType === sport.value ? 'primary' : 'default'}
                            sx={{
                              borderColor: alpha(sport.color, 0.5),
                              '&.MuiChip-filled': {
                                bgcolor: alpha(sport.color, 0.2),
                                borderColor: sport.color
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Venue Type Filter */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Venue Type
                      </Typography>
                      <ToggleButtonGroup
                        value={filters.venueType}
                        exclusive
                        onChange={(_, newType) => {
                          setPage(1);
                          setFilters(prev => ({ ...prev, venueType: newType }));
                        }}
                        fullWidth
                        sx={{
                          '& .MuiToggleButton-root': {
                            px: 2,
                            py: 1,
                            borderColor: alpha(darkTheme.palette.divider, 0.3),
                            '&.Mui-selected': {
                              bgcolor: alpha(darkTheme.palette.primary.main, 0.2),
                              color: darkTheme.palette.primary.main,
                              borderColor: darkTheme.palette.primary.main
                            }
                          }
                        }}
                      >
                        {venueTypes.map((type) => (
                          <ToggleButton key={type.value} value={type.value}>
                            {type.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid>

                    {/* Price Range Filter */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Max Price: {filters.maxPrice ? `₹${filters.maxPrice}/hr` : 'Any'}
                      </Typography>
                      <Slider
                        value={filters.maxPrice || 0}
                        onChange={(_, value) => {
                          setPage(1);
                          setFilters(prev => ({ ...prev, maxPrice: value }));
                        }}
                        min={0}
                        max={2000}
                        step={100}
                        marks={priceRanges}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `₹${value}`}
                        sx={{
                          '& .MuiSlider-markLabel': {
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }
                        }}
                      />
                    </Grid>

                    {/* Rating Filter */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Minimum Rating
                      </Typography>
                      <RatingFilter />
                    </Grid>

                    {/* Amenities Filter */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Amenities
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {amenitiesList.map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            onClick={() => handleAmenityToggle(amenity)}
                            variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
                            color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </GlassPaper>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {loading ? 'Finding perfect venues...' : 
               venues.length === 0 ? 'No matching venues found' : 
               `Showing ${venues.length} ${venues.length === 1 ? 'venue' : 'venues'}`}
            </Typography>
            
            {venues.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Sorted by popularity and rating
              </Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
          </Box>

          {/* View Content */}
          {viewMode === 'map' ? (
            <Box sx={{ height: '600px', borderRadius: 3, overflow: 'hidden' }}>
              <MapContainer 
                center={[28.6139, 77.2090]} // Default to Delhi coordinates
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {venues.map(venue => (
                  <Marker 
                    key={venue.id} 
                    position={[venue.latitude, venue.longitude]}
                  >
                    <Popup>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2">{venue.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {venue.location}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <StarIcon color="primary" fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {venue.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          ) : loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '400px'
            }}>
              <CircularProgress 
                color="primary" 
                size={80} 
                thickness={4} 
                sx={{ 
                  '& circle': {
                    strokeLinecap: 'round'
                  }
                }}
              />
            </Box>
          ) : venues.length === 0 ? (
            <Box textAlign="center" sx={{ py: 10 }}>
              <Box
                component={motion.div}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: alpha(darkTheme.palette.background.paper, 0.5),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <SearchIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                No venues match your search
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto', mb: 3 }}>
                Try adjusting your filters or search for different terms
              </Typography>
              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<FilterIcon />}
                sx={{ borderRadius: 50, px: 4 }}
              >
                Reset all filters
              </Button>
            </Box>
          ) : (
            <LayoutGroup>
              <Grid container spacing={3}>
                {venues.map((venue, index) => (
                  <Grid item key={venue.id} xs={12} sm={6} md={4} lg={3}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.03,
                        duration: 0.4
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <VenueCard 
                        venue={venue} 
                        darkMode 
                        elevation={3}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </LayoutGroup>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  fontWeight: 600,
                  bgcolor: alpha(darkTheme.palette.primary.main, 0.2),
                },
                '&.MuiPaginationItem-ellipsis': {
                  color: 'text.disabled'
                }
              }
            }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                shape="rounded"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 2}
              />
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default VenuesPage;