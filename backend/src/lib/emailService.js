import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

// Send password reset email
export const sendResetEmail = async (email, code, expiresAt) => {
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `MovieVerse Password Reset <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: [email],
            subject: 'Verification Code',
            html: `
        <h2>Password Reset</h2>
        <p>Your verification code: <strong>${code}</strong></p>
        <p>Expires at: ${expiresAt.toLocaleString()}</p>
      `
        });
    } catch (error) {
        console.error('Mailgun error:', error);
        throw new Error('Failed to send reset email');
    }
};