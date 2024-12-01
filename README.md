# Physio & Massage Booking System

A modern booking system built with React, Supabase, and Netlify.

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the following environment variables in `.env`:

- `VITE_SUPABASE_URL`: Your Supabase project URL (find in Project Settings > API)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key (find in Project Settings > API)
- `VITE_SENDGRID_API_KEY`: Your SendGrid API key (for email notifications)
- `VITE_EMAIL_FROM`: Verified sender email for SendGrid

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Deployment

The application is configured for deployment on Netlify. Push to the main branch to trigger automatic deployment.

### Environment Variables on Netlify

Make sure to add the following environment variables in Netlify (Site settings > Build & deploy > Environment):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENDGRID_API_KEY`
- `VITE_EMAIL_FROM`