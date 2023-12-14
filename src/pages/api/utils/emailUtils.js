const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: 'mail1.netim.hosting',

  // port: 465,
  // secure: false,
  
  port: 587,
  secure: true, // Use SSL/TLS

  auth: {
    user: 'support@22nd.al',
    pass: 'P1mYba5S783Z',
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
      to,
      subject,
      text,
    };

    // Send the email
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};


