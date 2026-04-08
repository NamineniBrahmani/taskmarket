const nodemailer = require("nodemailer");

// ✅ Create transporter ONCE (better performance)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    // ❗ Check env variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not set in .env");
    }

    const info = await transporter.sendMail({
      from: `"TaskMarket" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("Email sent:", info.response);

    return true; // ✅ success

  } catch (error) {
    console.error("Email error:", error.message);
    return false; // ❌ failure
  }
};

module.exports = sendEmail;