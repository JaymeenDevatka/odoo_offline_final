const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Court = sequelize.define('Court', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., Court 1, Table 2'
    },
    sportType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g., Badminton, Tennis, Turf Cricket'
    },
    pricePerHour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
    // The facilityId foreign key will be added by the association in index.js
});

module.exports = Court;