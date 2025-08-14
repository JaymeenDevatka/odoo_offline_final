import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import VenueCard from '../components/VenueCard';
import TestimonialCard from '../components/TestimonialCard';
import FeatureCard from '../components/FeatureCard';

// MUI Components
import { 
  Container, Box, Typography, Button, Grid, Paper, Avatar, 
  CircularProgress, IconButton, useMediaQuery, Divider, Chip
} from '@mui/material';

// Icons
import { 
  Search, EventAvailable, SportsScore, SportsCricket, 
  SportsTennis, SportsSoccer, ArrowForward, Star, 
  LocationOn, CalendarToday, People, TrendingUp,
  Shield, Payment, SupportAgent, Discount
} from '@mui/icons-material';

const LandingPage = () => {
    const navigate = useNavigate();
    const [popularVenues, setPopularVenues] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState({
        venues: true,
        testimonials: true
    });
    const [hoveredSport, setHoveredSport] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const controls = useAnimation();
    const isMobile = useMediaQuery('(max-width:600px)');

    // Color scheme
    const colors = {
        primary: '#6C5CE7',
        secondary: '#00CEFF',
        accent: '#FF7675',
        background: '#0F0E17',
        text: '#FFFFFE',
        lightText: '#A7A9BE',
        darkBackground: '#121212'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular venues
                const venuesResponse = await axios.get('http://localhost:5000/api/venues/popular');
                const venuesWithPrice = venuesResponse.data.map(v => ({ 
                    ...v, 
                    startingPrice: Math.floor(Math.random() * 200) + 50, 
                    rating: (Math.random() * 1 + 4).toFixed(1),
                    sportTypes: ['Badminton', 'Tennis', 'Soccer', 'Cricket'].slice(0, Math.floor(Math.random() * 3) + 1)
                }));
                setPopularVenues(venuesWithPrice);
                
                // Fetch testimonials
                const testimonialsResponse = await axios.get('http://localhost:5000/api/testimonials');
                setTestimonials(testimonialsResponse.data);
                
                // Animate in content after load
                await controls.start("visible");
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading({
                    venues: false,
                    testimonials: false
                });
            }
        };
        fetchData();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        if (testimonials.length > 0) {
            const interval = setInterval(() => {
                setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [testimonials]);

    const handleSportSearch = (sport) => {
        navigate(`/venues?sportType=${encodeURIComponent(sport)}`);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const sportCardVariants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.05,
            y: -10,
            boxShadow: `0 15px 30px ${colors.primary}40`,
            transition: { duration: 0.3 }
        }
    };

    const testimonialVariants = {
        enter: { opacity: 0, x: 100 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
    };

    const features = [
        {
            icon: <TrendingUp fontSize="large" />,
            title: "Real-Time Availability",
            description: "See up-to-the-minute court availability and book instantly"
        },
        {
            icon: <Shield fontSize="large" />,
            title: "Secure Payments",
            description: "Industry-standard encryption for all your transactions"
        },
        {
            icon: <Payment fontSize="large" />,
            title: "Flexible Payments",
            description: "Multiple payment options including digital wallets"
        },
        {
            icon: <SupportAgent fontSize="large" />,
            title: "24/7 Support",
            description: "Our team is always ready to assist you"
        },
        {
            icon: <Discount fontSize="large" />,
            title: "Exclusive Deals",
            description: "Special discounts for frequent players"
        },
        {
            icon: <People fontSize="large" />,
            title: "Community Events",
            description: "Join tournaments and meet fellow players"
        }
    ];

    const stats = [
        { value: "500+", label: "Venues Listed" },
        { value: "50K+", label: "Active Users" },
        { value: "95%", label: "Positive Reviews" },
        { value: "24/7", label: "Customer Support" }
    ];

    return (
        <Box sx={{ 
            backgroundColor: colors.background, 
            color: colors.text,
            overflow: 'hidden'
        }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 14,
                    pb: 14,
                    textAlign: 'center',
                    background: `linear-gradient(rgba(15, 14, 23, 0.9), rgba(15, 14, 23, 0.9)), url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated background elements */}
                <motion.div
                    initial={{ x: '-50%', y: '-50%', rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: '30%',
                        left: '20%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        border: `2px dashed ${colors.primary}30`,
                        zIndex: 0
                    }}
                />
                <motion.div
                    initial={{ x: '-50%', y: '-50%', rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '15%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        border: `2px dashed ${colors.secondary}30`,
                        zIndex: 0
                    }}
                />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography 
                            variant={isMobile ? "h3" : "h2"} 
                            fontWeight="bold" 
                            gutterBottom 
                            sx={{ 
                                letterSpacing: 1,
                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Find Your Game, Book Your Court
                        </Typography>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Typography variant="h5" sx={{ my: 4, color: colors.lightText }}>
                            The easiest way to discover and book sports facilities in your area.
                        </Typography>
                    </motion.div>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/venues')}
                                endIcon={<ArrowForward />}
                                sx={{
                                    background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                                    color: colors.text,
                                    fontWeight: 600,
                                    px: 5, 
                                    py: 1.5,
                                    borderRadius: '12px',
                                    boxShadow: `0 4px 15px ${colors.primary}40`,
                                    '&:hover': {
                                        background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
                                        boxShadow: `0 6px 20px ${colors.primary}60`,
                                    }
                                }}
                            >
                                Find a Venue Now
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/how-it-works')}
                                sx={{
                                    color: colors.text,
                                    borderColor: colors.text,
                                    fontWeight: 600,
                                    px: 5, 
                                    py: 1.5,
                                    borderRadius: '12px',
                                    '&:hover': {
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                        backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                    }
                                }}
                            >
                                Learn More
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Quick Search Chips */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        style={{ marginTop: '2rem' }}
                    >
                        <Typography variant="body1" sx={{ mb: 2, color: colors.lightText }}>
                            Popular sports:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Badminton', 'Tennis', 'Soccer', 'Basketball', 'Squash'].map((sport) => (
                                <motion.div
                                    key={sport}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Chip
                                        label={sport}
                                        onClick={() => handleSportSearch(sport)}
                                        sx={{
                                            cursor: 'pointer',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: colors.text,
                                            '&:hover': {
                                                backgroundColor: colors.primary
                                            }
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ py: 6, backgroundColor: colors.darkBackground }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" fontWeight="bold" sx={{ 
                                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body1" color={colors.lightText}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 6 }}>
                        How It Works
                    </Typography>
                </motion.div>
                
                <Grid container spacing={5} sx={{ mt: 5 }}>
                    {[
                        { icon: <Search fontSize="large" />, title: 'Find', text: 'Search our extensive list of local venues by sport, location, or price.' },
                        { icon: <EventAvailable fontSize="large" />, title: 'Book', text: 'Select your desired date and time slot, and confirm instantly.' },
                        { icon: <SportsScore fontSize="large" />, title: 'Play', text: 'Show up at the venue and enjoy your game!' }
                    ].map((step, idx) => (
                        <Grid key={idx} item xs={12} md={4} textAlign="center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                            >
                                <Avatar sx={{ 
                                    bgcolor: '#222', 
                                    color: colors.primary, 
                                    width: 80, 
                                    height: 80, 
                                    mx: 'auto', 
                                    mb: 3,
                                    border: `2px solid ${colors.primary}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'rotateY(180deg)',
                                        bgcolor: colors.primary,
                                        color: colors.text
                                    }
                                }}>
                                    {step.icon}
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {idx + 1}. {step.title}
                                </Typography>
                                <Typography color={colors.lightText}>
                                    {step.text}
                                </Typography>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Popular Venues */}
            <Box sx={{ bgcolor: colors.darkBackground, py: 10 }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 6 }}>
                            Popular Venues Near You
                        </Typography>
                    </motion.div>
                    
                    {loading.venues ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress sx={{ color: colors.primary }} />
                        </Box>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={controls}
                        >
                            <Grid container spacing={4} sx={{ mt: 4 }}>
                                {popularVenues.map((venue, idx) => (
                                    <Grid item key={venue.id} xs={12} sm={6} md={4} lg={3}>
                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <VenueCard venue={venue} darkMode />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ marginTop: '3rem', textAlign: 'center' }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/venues')}
                            endIcon={<ArrowForward />}
                            sx={{
                                color: colors.text,
                                borderColor: colors.text,
                                fontWeight: 600,
                                px: 5, 
                                py: 1.5,
                                borderRadius: '12px',
                                '&:hover': {
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    backgroundColor: 'rgba(108, 92, 231, 0.1)'
                                }
                            }}
                        >
                            View All Venues
                        </Button>
                    </motion.div>
                </Container>
            </Box>

            {/* Featured Sports */}
            <Box sx={{ py: 10 }}>
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 6 }}>
                            Any Sport, Any Time
                        </Typography>
                    </motion.div>
                    
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { icon: <SportsCricket sx={{ fontSize: 40 }} />, label: 'Cricket' },
                            { icon: <SportsTennis sx={{ fontSize: 40 }} />, label: 'Badminton' },
                            { icon: <SportsSoccer sx={{ fontSize: 40 }} />, label: 'Football' },
                            { icon: <SportsTennis sx={{ fontSize: 40 }} />, label: 'Tennis' },
                            { icon: <SportsSoccer sx={{ fontSize: 40 }} />, label: 'Basketball' },
                            { icon: <SportsTennis sx={{ fontSize: 40 }} />, label: 'Squash' }
                        ].map((sport, idx) => (
                            <Grid key={idx} item xs={6} sm={4} md={3}>
                                <motion.div
                                    variants={sportCardVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    onHoverStart={() => setHoveredSport(idx)}
                                    onHoverEnd={() => setHoveredSport(null)}
                                    onClick={() => handleSportSearch(sport.label)}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{ 
                                            p: 3, 
                                            minWidth: 120, 
                                            borderRadius: '16px', 
                                            cursor: 'pointer', 
                                            bgcolor: '#222',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                                                transform: hoveredSport === idx ? 'scaleX(1)' : 'scaleX(0)',
                                                transformOrigin: 'left',
                                                transition: 'transform 0.3s ease'
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            color: hoveredSport === idx ? colors.primary : colors.text,
                                            transition: 'color 0.3s ease',
                                            textAlign: 'center'
                                        }}>
                                            {sport.icon}
                                            <Typography sx={{ mt: 1 }}>{sport.label}</Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials */}
            <Box sx={{ py: 10, backgroundColor: colors.darkBackground }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 6 }}>
                            What Our Users Say
                        </Typography>
                    </motion.div>

                    {loading.testimonials ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress sx={{ color: colors.primary }} />
                        </Box>
                    ) : (
                        <Box sx={{ 
                            position: 'relative', 
                            minHeight: '300px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <AnimatePresence mode="wait">
                                {testimonials.slice(activeTestimonial, activeTestimonial + 1).map((testimonial) => (
                                    <motion.div
                                        key={testimonial.id}
                                        variants={testimonialVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            padding: '0 1rem'
                                        }}
                                    >
                                        <TestimonialCard testimonial={testimonial} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Box>
                    )}

                    {/* Testimonial navigation dots */}
                    {testimonials.length > 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mt: 4,
                            gap: 1
                        }}>
                            {testimonials.map((_, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    sx={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: activeTestimonial === idx ? colors.primary : colors.lightText,
                                        opacity: activeTestimonial === idx ? 1 : 0.5,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10 }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 2 }}>
                            Why Choose QuickCourt?
                        </Typography>
                        <Typography variant="body1" align="center" color={colors.lightText} sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}>
                            We're revolutionizing the way you book sports facilities with our cutting-edge platform.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        {features.map((feature, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <FeatureCard 
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                        color={colors.primary}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Final CTA */}
            <Box sx={{ 
                py: 10,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="md" sx={{ 
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: colors.text }}>
                            Ready to Get in the Game?
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, color: colors.text }}>
                            Join thousands of players and hundreds of facilities on QuickCourt today.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        background: colors.text,
                                        color: colors.primary,
                                        px: 5, 
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        boxShadow: `0 4px 15px rgba(0,0,0,0.2)`,
                                        '&:hover': {
                                            background: colors.background,
                                            color: colors.text
                                        }
                                    }}
                                >
                                    Sign Up for Free
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/venues')}
                                    sx={{
                                        borderColor: colors.text,
                                        color: colors.text,
                                        px: 5, 
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: colors.background,
                                            color: colors.background,
                                            backgroundColor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                >
                                    Browse Venues
                                </Button>
                            </motion.div>
                        </Box>
                    </motion.div>
                </Container>

                {/* Floating elements */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 0
                    }}
                />
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '10%',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 0
                    }}
                />
            </Box>
        </Box>
    );
};

export default LandingPage;