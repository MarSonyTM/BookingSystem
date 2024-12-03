import { Handler } from '@netlify/functions';
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.VITE_EMAIL_FROM;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { email, name, message } = JSON.parse(event.body || '{}');

    if (!email || !name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          received: { email, name, message }
        }),
      };
    }

    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    if (!FROM_EMAIL) {
      throw new Error('FROM_EMAIL is not configured');
    }

    sgMail.setApiKey(SENDGRID_API_KEY);
    
    const msg = {
      to: FROM_EMAIL,
      from: FROM_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };

    console.log('Sending email with payload:', msg);
    
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};