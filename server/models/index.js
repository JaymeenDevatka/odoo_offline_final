const sequelize = require('../config/database');

const User = require('./user');
const Facility = require('./facility');
const Court = require('./court');
const Booking = require('./booking');
// Add Review to the imports
const Review = require('./review');
const FacilityPhoto = require('./facilityPhoto');

// --- Define Relationships ---

// One-to-Many: A User can have many Bookings
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// One-to-Many: A Court can have many Bookings
Court.hasMany(Booking, { foreignKey: 'courtId' });
Booking.belongsTo(Court, { foreignKey: 'courtId' });

// One-to-Many: A Facility has many Courts
Facility.hasMany(Court, { foreignKey: 'facilityId' });
Court.belongsTo(Facility, { foreignKey: 'facilityId' });

// One-to-One: A User (role='owner') has one Facility
User.hasOne(Facility, { foreignKey: 'ownerId' });
Facility.belongsTo(User, { as: 'Owner', foreignKey: 'ownerId' });

// Add these associations
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Facility.hasMany(Review, { foreignKey: 'facilityId' });
Review.belongsTo(Facility, { foreignKey: 'facilityId' });

Facility.hasMany(FacilityPhoto, { foreignKey: 'facilityId' });
FacilityPhoto.belongsTo(Facility, { foreignKey: 'facilityId' });

// --- Sync All Models ---
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Use {force: true} to drop and recreate tables
        console.log('✅ All models were synchronized successfully.');
    } catch (error) {
        console.error('❌ Unable to synchronize the database:', error);
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    User,
    Facility,
    Court,
    Booking,
    Review,
    FacilityPhoto
};