// Correct Code
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'owner', 'admin'), // Defines the three roles
        defaultValue: 'user'
    },
    avatar: { // Add this
        type: DataTypes.STRING,
        allowNull: true
    }

});

module.exports = User;