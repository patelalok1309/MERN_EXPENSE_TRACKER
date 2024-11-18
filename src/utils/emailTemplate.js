const generateEmailTemplate = (verificationCode) => {
	return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          /* Tailwind-inspired inline styles */
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #4f46e5;
            padding: 10px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            color: #ffffff;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .verification-code {
            display: inline-block;
            font-size: 24px;
            font-weight: 600;
            color: #4f46e5;
            background-color: #e0e7ff;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #718096;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering! Please use the verification code below to complete your registration process.</p>
            <div class="verification-code">
              ${verificationCode}
            </div>
            <p>This code will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you did not request this code, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export { generateEmailTemplate };
