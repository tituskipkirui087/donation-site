# Imani Childrens Home — Donation Website

This is the official donation website for Imani Children\'s Home / Children First Kenya.

## Features
- Online donations via Paystack (MPesa, Card, Bank)
- Real-time donation notifications
- Supporters comments section
- Responsive design for all devices

## Quick Start (Local Development)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## Production Deployment

### Required Environment Variables
Create a `.env` file with:
```
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PORT=3000
NODE_ENV=production
```

### Paystack Configuration
1. Get live API keys from Paystack dashboard
2. Set webhook URL: `https://yourdomain.com/webhook`
3. Update `.env` with live keys

### Hosting Options
- **Render.com** - Recommended free Node.js hosting
- **Railway** - Easy deployment
- **Heroku** - Classic option
- **Vercel/Netlify** - With serverless functions

### Deploy to Render
1. Push code to GitHub
2. Connect Render to your GitHub repo
3. Set environment variables in Render dashboard
4. Deploy!

## License
ISC
