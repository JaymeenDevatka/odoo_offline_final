import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Import Components and Pages
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import VenuesPage from "./pages/VenuesPage";
import SingleVenuePage from "./pages/SingleVenuePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage"; // 👈 Import the new page
import FacilityOwnerDashboard from "./pages/FacilityOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FacilityManagementPage from "./pages/FacilityManagementPage";

// A basic theme for consistent styling
const theme = createTheme({
  palette: {
    secondary: {
      main: "#ffffff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Normalizes CSS across browsers */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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

              {/* Protected Routes by Role */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <FacilityOwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/manage-facility"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <FacilityManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <Typography variant="h1" align="center" sx={{ mt: 5 }}>
                    404: Page Not Found
                  </Typography>
                }
              />
            </Routes>
          </main>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
