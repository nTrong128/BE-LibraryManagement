import nodemailer from "nodemailer";

// Create a nodemailer transporter
export const transporter = nodemailer.createTransport({
  service: "gmail", // Use a service like Gmail or configure SMTP details
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD, // Use an app-specific password if using Gmail
  },
});
