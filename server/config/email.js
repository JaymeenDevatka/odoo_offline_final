const nodemailer = require('nodemailer');

// This function creates a test account on Ethereal and returns a transporter
const createTestTransporter = async () => {
    const testAccount = await nodemailer.createTestAccount();

    // Log the credentials to the console so you can check the fake inbox
    console.log(' ethereal user: %s', testAccount.user);
    console.log(' ethereal pass: %s', testAccount.pass);

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    return transporter;
};

module.exports = createTestTransporter;