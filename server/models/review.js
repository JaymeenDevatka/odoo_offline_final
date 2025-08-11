const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 } // 1 to 5 stars
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // userId and facilityId will be added via associations
});

module.exports = Review;