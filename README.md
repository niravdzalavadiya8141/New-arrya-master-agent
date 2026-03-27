# AARYA Mission Control

Production-ready mission control dashboard for AARYA agent system.

## Structure

- `mhq-frontend/` - React frontend with Socket.IO integration
- `mhq-backend/` - Node.js/Express backend with PostgreSQL

## Quick Start

```bash
# Frontend
cd mhq-frontend
npm install
npm start

# Backend
cd mhq-backend
npm install
npm run dev
```

## Deployment

Both frontend and backend are configured for Vercel deployment.

### Frontend
```bash
cd mhq-frontend
vercel --prod
```

### Backend
```bash
cd mhq-backend
vercel deploy --prod
```

## Environment Variables

Backend requires:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)