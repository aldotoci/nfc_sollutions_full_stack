const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: 'mx1.netim.net',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: 'support@22nd.al',
    pass: 'P1mYba5S783Z',
  },
  tls: {
    rejectUnauthorized: false, // Use with caution, only for testing purposes
  },
};

// Create a transporter with the email configuration
const transporter = nodemailer.createTransport(emailConfig);

// Function to send an email
export const sendEmail = async ({to, subject,text}) => {
  try {
    // Email options
    const mailOptions = {
      from: 'support@22nd.al',
      to, // Replace with the recipient's email address
      subject,
      text,
    };

    // Send the email
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};


