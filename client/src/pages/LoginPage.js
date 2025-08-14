import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Login, ArrowForward, AutoAwesome } from '@mui/icons-material';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [particles, setParticles] = useState([]);
  const controls = useAnimation();
  const navigate = useNavigate();

  // Color scheme
  const colors = {
    primary: '#6C5CE7',
    secondary: '#00CEFF',
    accent: '#FF7675',
    background: '#0F0E17',
    text: '#FFFFFE',
    lightText: '#A7A9BE'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      
      // Success animation
      await controls.start({
        scale: 0.9,
        transition: { duration: 0.2 }
      });
      await controls.start({
        scale: 1.1,
        backgroundColor: 'rgba(108, 92, 231, 0.3)',
        transition: { duration: 0.3 }
      });
      await controls.start({
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transition: { duration: 0.4 }
      });
      
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      createParticles();
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      color: [colors.primary, colors.secondary, colors.accent][Math.floor(Math.random() * 3)],
      duration: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  // Floating animation for decorative elements
  const floatingVariants = {
    float: {
      y: ["0%", "-10%", "0%"],
      rotate: [0, 5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const fieldFocusVariants = {
    focused: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.background} 0%, #1E1E2E 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1,
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              scale: 1
            }}
            animate={{
              y: `${particle.y - 50}%`,
              opacity: 0,
              scale: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: particle.duration,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: particle.color,
              zIndex: 1
            }}
          />
        ))}
      </AnimatePresence>

      {/* Decorative floating elements */}
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '20px',
          background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          opacity: 0.2,
          filter: 'blur(10px)',
          zIndex: 0
        }}
      />
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '30px',
          background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
          opacity: 0.2,
          filter: 'blur(15px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <motion.div
            animate={controls}
            style={{
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: `0 8px 32px rgba(31, 38, 135, 0.2)`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: colors.text,
              position: 'relative',
              overflow: 'hidden',
              zIndex: 2
            }}
          >
            {/* Animated border */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                zIndex: 3
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', sm: '3rem' }
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ 
                    mb: 4, 
                    color: colors.lightText,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Sign in to continue your journey
                </Typography>
              </motion.div>

              <Box component="form" onSubmit={handleSubmit}>
                <motion.div
                  variants={fieldFocusVariants}
                  animate={activeField === 'email' ? 'focused' : 'unfocused'}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px'
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}40`
                        },
                      },
                    }}
                    InputLabelProps={{ 
                      style: { 
                        color: colors.lightText,
                      } 
                    }}
                    InputProps={{
                      style: { 
                        color: colors.text,
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  variants={fieldFocusVariants}
                  animate={activeField === 'password' ? 'focused' : 'unfocused'}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px'
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          boxShadow: `0 0 0 2px ${colors.primary}40`
                        },
                      },
                    }}
                    InputLabelProps={{ 
                      style: { 
                        color: colors.lightText,
                      } 
                    }}
                    InputProps={{
                      style: { 
                        color: colors.text,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{ color: colors.lightText }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert
                        severity="error"
                        sx={{
                          width: '100%',
                          mt: 2,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 0, 0, 0.15)',
                          color: colors.text,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                        icon={<AutoAwesome />}
                      >
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    startIcon={!isLoading && <Login />}
                    endIcon={isLoading ? null : <ArrowForward />}
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: '12px',
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      fontWeight: 'bold',
                      boxShadow: `0 4px 15px ${colors.primary}40`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
                        boxShadow: `0 6px 20px ${colors.primary}60`,
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ 
                      mt: 2, 
                      color: colors.lightText,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Don't have an account?{' '}
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/register"
                        style={{
                          textDecoration: 'none',
                          color: colors.secondary,
                          fontWeight: 'bold',
                          position: 'relative'
                        }}
                      >
                        Sign Up
                        <motion.span
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: colors.secondary,
                            transformOrigin: 'left'
                          }}
                          initial={{ transform: 'scaleX(0)' }}
                          whileHover={{ transform: 'scaleX(1)' }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.span>
                  </Typography>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;