import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SNCK62iB_2cCRnThfJYcjmW49SjrTmenP';
const resend = new Resend(RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  
  const resetLink = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/reset-password/${token}`;
  
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: [email],
    subject: 'Reset your password for Vaani',
    html: `
      <p>Hello ${name},</p>
      <p>Click the link below to reset your password. This link is valid for 30 minutes.</p>
      <p>Reset link: <a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>— Team Vaani</p>
    `,
  });

  if (error) {
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }

  return data;
}