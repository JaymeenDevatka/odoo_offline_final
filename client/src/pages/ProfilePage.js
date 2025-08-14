import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Alert,
  Divider,
  IconButton,
  CircularProgress,
  useMediaQuery,
  Chip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Person as PersonIcon,
  Verified as VerifiedIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

// Custom styled components
const ProfileCard = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: `0px 16px 32px -4px ${alpha(theme.palette.common.black, 0.1)}`,
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0px 24px 48px -8px ${alpha(theme.palette.common.black, 0.15)}`
  }
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  height: 160,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    height: 120
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[6],
  position: 'absolute',
  bottom: -70,
  left: theme.spacing(3),
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease'
  },
  [theme.breakpoints.down('sm')]: {
    width: 100,
    height: 100,
    bottom: -50,
    left: '50%',
    transform: 'translateX(-50%)'
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1)
  }
}));

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    occupation: '',
    skills: []
  });
  
  const [originalData, setOriginalData] = useState({});
  const [profileAvatar, setProfileAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [joinDate, setJoinDate] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
        
        const userData = {
          fullName: data.fullName || '', 
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          occupation: data.occupation || '',
          skills: data.skills || []
        };
        
        setFormData(userData);
        setOriginalData(userData);
        setProfileAvatar(data.avatar || '');
        setJoinDate(data.createdAt ? format(new Date(data.createdAt), 'MMMM yyyy') : '');
        setIsLoading(false);
      } catch (err) {
        setMessage({ text: 'Could not load profile data.', severity: 'error' });
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size should be less than 5MB', severity: 'error' });
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', severity: '' });
    
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach(item => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile', 
        formDataToSend, 
        config
      );

      setMessage({ text: data.message || 'Profile updated successfully!', severity: 'success' });
      setOriginalData(formData);
      if (data.avatar) {
        setProfileAvatar(data.avatar);
        setAvatarPreview('');
        setAvatarFile(null);
      }
      setIsEditing(false);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to update profile.', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData(originalData);
    setIsEditing(false);
    setAvatarPreview('');
    setAvatarFile(null);
    setMessage({ text: '', severity: '' });
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData) || avatarFile;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Header with Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: 2
                }
              }}
            >
              <Tab label="Profile" />
              <Tab label="Activity" />
              <Tab label="Settings" />
              <Tab label="Connections" />
            </Tabs>
          </Box>

          <ProfileCard elevation={3}>
            <ProfileHeader />
            
            {/* Avatar Section */}
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              pt: isMobile ? 8 : 0,
              px: 3
            }}>
              <Box sx={{ 
                position: isMobile ? 'relative' : 'absolute',
                top: isMobile ? 0 : -70,
                left: isMobile ? 0 : 30,
                zIndex: 2
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    isEditing && (
                      <IconButton
                        component="label"
                        size="small"
                        sx={{
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'background.default' }
                        }}
                      >
                        <UploadIcon fontSize="small" />
                        <input
                          type="file"
                          hidden
                          onChange={handleAvatarChange}
                          accept="image/*"
                        />
                      </IconButton>
                    )
                  }
                >
                  <ProfileAvatar
                    src={avatarPreview || profileAvatar}
                    sx={{ 
                      cursor: isEditing ? 'pointer' : 'default',
                    }}
                  >
                    {!profileAvatar && !avatarPreview && <PersonIcon sx={{ fontSize: 60 }} />}
                  </ProfileAvatar>
                </Badge>
              </Box>

              {/* Profile Actions */}
              <Box sx={{ 
                ml: isMobile ? 0 : 20,
                mt: isMobile ? 2 : 4,
                mb: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Box>
                  {isEditing ? (
                    <TextField
                      variant="standard"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '2rem',
                          fontWeight: 700,
                          py: 0
                        }
                      }}
                    />
                  ) : (
                    <Typography variant="h3" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      {formData.fullName}
                      <VerifiedIcon color="primary" sx={{ ml: 1, fontSize: '1.5rem' }} />
                    </Typography>
                  )}
                  
                  {joinDate && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Member since {joinDate}
                    </Typography>
                  )}
                </Box>
                
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 5 }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={cancelEdit}
                      disabled={isSubmitting}
                      sx={{ borderRadius: 5 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
                      onClick={handleSubmit}
                      disabled={isSubmitting || !hasChanges()}
                      sx={{ borderRadius: 5 }}
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: 4, pt: 2 }}>
              {/* Messages */}
              {message.text && (
                <Alert 
                  severity={message.severity} 
                  sx={{ mb: 3 }}
                  onClose={() => setMessage({ text: '', severity: '' })}
                >
                  {message.text}
                </Alert>
              )}

              <Grid container spacing={4}>
                {/* Left Column */}
                <Grid item xs={12} md={8}>
                  {/* About Section */}
                  <Box sx={{ mb: 4 }}>
                    <SectionTitle variant="h5">
                      About
                    </SectionTitle>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        placeholder="Tell others about yourself..."
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body1" paragraph>
                        {formData.bio || 'No bio yet. Tell us about yourself!'}
                      </Typography>
                    )}
                  </Box>

                  {/* Skills Section */}
                  <Box sx={{ mb: 4 }}>
                    <SectionTitle variant="h5">
                      Skills & Expertise
                    </SectionTitle>
                    {isEditing ? (
                      <Box>
                        <TextField
                          fullWidth
                          placeholder="Add a skill and press enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addSkill(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formData.skills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              onDelete={() => removeSkill(skill)}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill) => (
                            <Chip key={skill} label={skill} />
                          ))
                        ) : (
                          <Typography color="text.secondary">No skills added yet</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                  {/* Contact Info */}
                  <Box sx={{ 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    p: 3,
                    mb: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <SectionTitle variant="h6">
                      Contact Information
                    </SectionTitle>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>Email:</Typography>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      ) : (
                        <Typography variant="body2" color="text.primary">
                          {formData.email}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>Phone:</Typography>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      ) : (
                        <Typography variant="body2" color="text.primary">
                          {formData.phone || 'Not provided'}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Add your location"
                        />
                      ) : (
                        <Typography variant="body2" color="text.primary">
                          {formData.location || 'Not specified'}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="Add your occupation"
                        />
                      ) : (
                        <Typography variant="body2" color="text.primary">
                          {formData.occupation || 'Not specified'}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Links */}
                  <Box sx={{ 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    p: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <SectionTitle variant="h6">
                      Links
                    </SectionTitle>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Add your website"
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ mb: 2 }}
                      />
                    ) : formData.website ? (
                      <Button
                        href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        {formData.website.replace(/^https?:\/\//, '')}
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No links added
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ProfileCard>
        </>
      )}
    </Container>
  );
};

export default ProfilePage;