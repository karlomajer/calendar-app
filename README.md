# Calendar App

A full-stack calendar application with Google Calendar integration.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Google Cloud Project with Calendar API enabled
- yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd calendar-backend

# Install dependencies
yarn install

# Configure environment (more in backend README)
cp .env.example .env

# Create database
createdb test_calendar

# Generate and run DB migrations
yarn db:generate
yarn db:migrate

# Start backend server
yarn dev
```

Backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd calendar-frontend

# Install dependencies
yarn install

# Start frontend development server
yarn dev
```

Frontend will run on `http://localhost:5173`
