import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';

// Import Components and Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import VenuesPage from './pages/VenuesPage';
import SingleVenuePage from './pages/SingleVenuePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage'; // 👈 Import the new page
import FacilityOwnerDashboard from './pages/FacilityOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FacilityManagementPage from './pages/FacilityManagementPage';

// A basic theme for consistent styling
const theme = createTheme({
    palette: {
        secondary: {
            main: '#ffffff',
        },
    },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS across browsers */}
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/venue/:id" element={<SingleVenuePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            
            {/* Protected Routes */}
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> {/* 👈 Add the new route */}
            <Route path="/owner/dashboard" element={<ProtectedRoute><FacilityOwnerDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/owner/manage-facility" element={<ProtectedRoute><FacilityManagementPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Typography variant="h1" align="center" sx={{mt: 5}}>404: Page Not Found</Typography>} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
