import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      // We can add role-based navigation later
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            color: '#fff',
            animation: 'fadeIn 0.8s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: '#fff'
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, opacity: 0.85 }}
          >
            Sign in to continue booking your favorite courts.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
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
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{
                style: { color: '#fff', borderRadius: 12 },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{
                style: { color: '#fff', borderRadius: 12 },
              }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mt: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  color: '#fff',
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: '30px',
                background: 'linear-gradient(90deg, #ff758c, #ff7eb3)',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 105, 135, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 105, 135, 0.6)',
                },
              }}
            >
              Sign In
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, opacity: 0.85 }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
