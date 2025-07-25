import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  
  const resetLink = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/reset-password/${token}`;
  
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [email],
    subject: 'Reset Your Password – Vaani',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #F26B1D;
            margin-bottom: 10px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #F26B1D;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: #D72638;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Vaani</div>
            <p style="color: #666; font-size: 16px;">Nepal's Trusted Learning Platform</p>
          </div>
          
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password for your Vaani account. Click the button below to reset it:</p>
            
            <div class="button-container">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 14px;">
              ${resetLink}
            </p>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This link is valid for 1 hour only. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          
          <div class="footer">
            <p>— Team Vaani</p>
            <p style="font-size: 12px; color: #999;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}