const { User } = require('../models');

// Get the profile of the currently logged-in user
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userData.userId, {
            attributes: ['fullName', 'email', 'avatar']
        });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile.' });
    }
};

// Update the user's profile
exports.updateUserProfile = async (req, res) => {
    try {
        // Now accepting email in the request body
        const { fullName, email } = req.body;
        const user = await User.findByPk(req.userData.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (fullName) {
            user.fullName = fullName;
        }
        
        // If email is provided and is different from the current one
        if (email && email !== user.email) {
            // Check if the new email is already taken
            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(409).json({ message: 'This email address is already in use.' });
            }
            user.email = email;
            // Note: In a production app, you would trigger an email re-verification process here.
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};