import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_EMAIL_FROM;

if (!SENDGRID_API_KEY) {
  throw new Error('SendGrid API key is not configured');
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<boolean> => {
  try {
    const verificationUrl = `${window.location.origin}/verify-email?token=${encodeURIComponent(verificationToken)}`;
    
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Verify your email address',
      text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Verify your email address</h2>
          <p style="color: #374151; margin: 16px 0;">
            Thank you for registering! Please verify your email address by clicking the button below:
          </p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background: linear-gradient(to right, #4F46E5, #7C3AED); 
                    color: white; padding: 12px 24px; border-radius: 8px; 
                    text-decoration: none; font-weight: 500;">
            Verify Email
          </a>
          <p style="color: #6B7280; margin-top: 16px; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <span style="color: #4F46E5;">${verificationUrl}</span>
          </p>
          <p style="color: #6B7280; margin-top: 24px; font-size: 12px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false },
        subscriptionTracking: { enable: false },
      },
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};