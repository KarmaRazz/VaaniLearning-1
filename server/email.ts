import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SNCK62iB_2cCRnThfJYcjmW49SjrTmenP';
const resend = new Resend(RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  
  const resetLink = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/reset-password?token=${token}`;
  
  const { data, error } = await resend.emails.send({
    from: 'no-reply@e-vaani.com',
    to: [email],
    subject: 'Reset Your Vaani Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            background-color: #F26B1D; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
            margin: 20px 0;
          }
          .footer { margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Hi ${name},</p>
          <p>We received a request to reset your Vaani password. Click the button below to reset it:</p>
          <p><a href="${resetLink}" class="button">Reset Password</a></p>
          <p>This link will expire in 15 minutes.</p>
          <p>If this wasn't you, ignore this email.</p>
          <div class="footer">
            <p>— Team Vaani</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }

  return data;
}