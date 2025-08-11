import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar
} from '@mui/material';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        let avatarUrl = '';
        // Step 1: If an avatar file is selected, upload it to Cloudinary first.
        if (avatarFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', avatarFile);
            // IMPORTANT: Replace 'your_cloudinary_unsigned_preset' with your actual preset name from Cloudinary settings.
            uploadFormData.append('upload_preset', 'your_cloudinary_unsigned_preset'); 

            try {
                // IMPORTANT: Replace 'your_cloud_name' with your actual Cloudinary cloud name.
                const response = await axios.post(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, uploadFormData);
                avatarUrl = response.data.secure_url;
            } catch (err) {
                setError('Image upload failed. Please try a smaller file or check your connection.');
                setLoading(false);
                return;
            }
        }
        
        // Step 2: Send all data (including the new avatar URL) to your backend to start the OTP process.
        try {
            const finalData = { ...formData, avatar: avatarUrl };
            const response = await axios.post('http://localhost:5000/api/auth/register', finalData);
            setMessage(response.data.message);

            setTimeout(() => {
                navigate('/verify-otp', { state: { email: formData.email } });
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            setLoading(false);
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
        padding: 2,
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
          <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
            QuickCourt
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, opacity: 0.85 }}>
            Create an account to start booking your favorite sports courts.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center' }}>
                <Avatar src={avatarPreview} sx={{ width: 80, height: 80, mr: 2, border: '2px solid white' }} />
                <Button variant="contained" component="label" sx={{backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': {backgroundColor: 'rgba(255,255,255,0.3)'}}}>
                    Upload Avatar
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </Button>
            </Box>

            <TextField margin="normal" required fullWidth id="fullName" label="Full Name" name="fullName" onChange={handleChange} variant="outlined" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff', borderRadius: 12 } }} />
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" onChange={handleChange} variant="outlined" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff', borderRadius: 12 } }} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" onChange={handleChange} variant="outlined" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff', borderRadius: 12 } }} />

            <FormControl fullWidth margin="normal" variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#fff' }, '& .MuiSelect-select': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}>
              <InputLabel id="role-select-label">I am a...</InputLabel>
              <Select labelId="role-select-label" id="role-select" name="role" value={formData.role} onChange={handleChange} label="I am a...">
                <MenuItem value="user">User (I want to book courts)</MenuItem>
                <MenuItem value="owner">Facility Owner</MenuItem>
              </Select>
            </FormControl>

            {error && <Alert severity="error" sx={{ width: '100%', mt: 2, borderRadius: 2, backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#fff' }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ width: '100%', mt: 2, borderRadius: 2, backgroundColor: 'rgba(0, 255, 0, 0.2)', color: '#fff' }}>{message}</Alert>}

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', textTransform: 'none', borderRadius: '30px', background: 'linear-gradient(90deg, #ff758c, #ff7eb3)', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 105, 135, 0.4)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(255, 105, 135, 0.6)' } }}>
              {loading ? <CircularProgress size={24} sx={{color: 'white'}} /> : 'Sign Up'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2, opacity: 0.85 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>Sign In</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
