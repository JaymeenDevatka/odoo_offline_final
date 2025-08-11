const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facility = sequelize.define('Facility', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    venueType: { // 👈 Add this
        type: DataTypes.ENUM('Indoor', 'Outdoor', 'Mixed'),
        allowNull: false,
        defaultValue: 'Indoor'
    }
    // The ownerId foreign key will be added by the association in index.js
});

module.exports = Facility;