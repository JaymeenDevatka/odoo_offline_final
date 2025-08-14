const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncDatabase } = require('./models');

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth'); // We will create these routes next
const {facilityRoutes} = require('./routes/facilityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 
const ownerRoutes = require('./routes/ownerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- Middleware ---   
// Enable Cross-Origin Resource Sharing (CORS) so your React app can talk to the server
app.use(cors()); 
// Parse incoming JSON requests
app.use(express.json());

// --- API Routes ---
// Tell the server to use your authentication routes for any request starting with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/owner', ownerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// (You will add other routes here, like for bookings and facilities)


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
        await sequelize.sync();
        await syncDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server:', error);
    }
}

startServer();