import {transporter} from "../config/nodemailer";

import {PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./mailTemplate";
export const sendResetPasswordEmail = async (email: string, resetURL: string) => {
  const mailOptions = {
    from: "nkoxvip0zz@gmail.com",
    to: email,
    subject: "Reset your password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const sendResetPasswordSuccessEmail = async (email: string) => {
  const mailOptions = {
    from: "nkoxvip0zz@gmail.com",
    to: email,
    subject: "Password reset successfully",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};
