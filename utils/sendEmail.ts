import {transporter} from "../config/nodemailer";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  REQUEST_RETURN_BOOK,
} from "./mailTemplate";
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
    from: process.env.NODEMAILER_EMAIL,
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

export const sendRquestReturnBookEmail = async (
  email: string,
  HoTen: string,
  TenSach: string,
  NgayTra: string
) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Yêu cầu hoàn trả sách",
    html: REQUEST_RETURN_BOOK.replace("{HoTen}", HoTen)
      .replace("{HoTen}", HoTen)
      .replace("{TenSach}", TenSach)
      .replace("{NgayTra}", NgayTra),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Request return book email sent successfully");
  } catch (error) {
    console.error("Error sending request return book:", error);
  }
};
