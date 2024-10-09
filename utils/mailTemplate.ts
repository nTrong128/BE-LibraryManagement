export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cập nhật mật khẩu thành công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Cập nhật mật khẩu thành công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Chúng tôi gửi mail này để xác nhận bạn đã cập nhật mật khẩu thành công.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Nếu bạn không thực hiện điều này, vui lòng liên lạc với đội ngũ hỗ trợ của chúng tôi.</p>
    <p>Vì sự an toàn thông tin của bạn, chúng tôi đề nghị:</p>
    <ul>
      <li>Sử dụng mật khẩu mạnh(chứa chữ và số, bao gồm chữ cái in hoa và ký tự đặc biệt).</li>
      <li>Không nên sử dụng một mật khẩu cho nhiều ứng dụng.</li>
    </ul>
    <p>Trân trọng,<br>Lê Nhật Trọng - B2106819</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không phản hồi vào email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Password Reset</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Xin chào,</p>
      <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua.</p>
      <p>Để khôi phục mật khẩu, vui lòng ấn vào đường dẫn sau:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Cập nhật mật khẩu</a>
      </div>
      <p><strong>Liên kết này sẽ hết hạn trong vòng 10 phút vì lý do an toàn.</strong></p>
      <p>Trân trọng, <br>Lê Nhật Trọng - B2106819 </p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>Đây là tin nhắn tự động, vui lòng không phản hồi vào email này.</p>
    </div>
  </body>
</html>
`;
