import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// The corrected import line now includes Typography
import { CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';

// Import Components and Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import VenuesPage from './pages/VenuesPage';
import SingleVenuePage from './pages/SingleVenuePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import FacilityOwnerDashboard from './pages/FacilityOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerifyOtpPage from './pages/VerifyOtpPage';

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
            <Route path="/owner/dashboard" element={<ProtectedRoute><FacilityOwnerDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            
            {/* Add a catch-all route for 404 Not Found */}
            <Route path="*" element={<Typography variant="h1" align="center" sx={{mt: 5}}>404: Page Not Found</Typography>} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;