const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    bookingStartTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bookingEndTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Confirmed', 'Cancelled', 'Completed'),
        defaultValue: 'Confirmed'
    }
    // The userId and courtId foreign keys are added by the associations
});

module.exports = Booking;