const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "mdrf9994@gmail.com",
    pass: "cxqd etcv fsgn dpli",
  },
});

// Function to send registration email
async function sendEmail(userEmail) {
  try {
    // Send an email
    await transporter.sendMail({
      from: "mdrf9994@gmail.com",
      to: userEmail,
      subject: "User Registration Successful",
      text: "Congratulations! Your user registration was successful.",
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
// function send mail to forgot password
async function sendForgotPasswordEmail(email, newPassword) {
  try {
    // Send an email
    await transporter.sendMail({
      from: "mdrf9994@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Your new password is: ${newPassword}`,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
module.exports = { sendEmail, sendForgotPasswordEmail };
