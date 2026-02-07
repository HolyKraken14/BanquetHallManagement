const nodemailer = require('nodemailer');

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vrushabhyouthoob617@gmail.com",
    pass: "npbd lqfb pvaa geym" // Replace with your app-specific password
  },
});

// Export the sendEmail function
async function sendEmail({ to, subject, text, attachments }) {
  try {
    const info = await transporter.sendMail({
      from: "vrushabhyouthoob617@gmail.com", // use the same email as auth
      to,
      subject,
      text,
      attachments: attachments || [],
    });
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;