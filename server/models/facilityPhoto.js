const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FacilityPhoto = sequelize.define('FacilityPhoto', {
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = FacilityPhoto;