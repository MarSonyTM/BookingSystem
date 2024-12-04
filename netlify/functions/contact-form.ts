import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';

const handler: Handler = async (event) => {
  // Log environment variables (remove in production)
  console.log('Environment check:', {
    hasApiKey: !!process.env.SENDGRID_API_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    emailFrom: process.env.EMAIL_FROM
  });

  if (!process.env.SENDGRID_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SendGrid API key not configured' })
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    // Test email
    await sgMail.send({
      to: process.env.EMAIL_FROM,
      from: process.env.EMAIL_FROM,
      subject: 'Test Email',
      text: 'This is a test email to verify SendGrid configuration',
      html: '<p>This is a test email to verify SendGrid configuration</p>'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Test email sent successfully' })
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export { handler };