# Portfolio Backend Service

Production-ready, high-performance TypeScript/Express backend built for receiving portfolio contact form inquiries and dispatching emails via Nodemailer with Gmail SMTP.

---

## Features

- ⚡ **TSX Execution**: Fast TypeScript dev execution with `tsx watch`.
- 🛡️ **Security First**: Helmet headers, `X-Powered-By` disabled, CORS origin restrictions, request size limits, and `express-rate-limit`.
- 🤖 **Anti-Bot Protection**:
  - **Honeypot**: Rejects requests populating the hidden `website` field.
  - **Speed-Submit Filter**: Rejects form submissions completed in under 3 seconds (`loadedAt` delta check).
- 🔌 **Provider Decoupling**: Abstracted `smtp.provider.ts` for easily swapping Gmail with Resend, SendGrid, or AWS SES.
- 📧 **Dual Email Pipeline**: Automatically sends styled HTML notification emails to the admin AND auto-reply confirmations to visitors.
- 🧹 **Input Validation & Sanitization**: Strict Zod schema validation (`fullName`, `email`, `projectType`, `projectDetails`, etc.) with string trimming, normalization, and HTML escaping.
- 🏷️ **Request Tracking**: Auto-assigned UUID `X-Request-ID` attached to all logs and responses.
- 🛑 **Graceful Shutdown**: Handles `SIGINT` & `SIGTERM` signals cleanly to avoid dangling connections.

---

## Directory Structure

```
Portfolio-Backend/
├── src/
│   ├── config/          # Environment & mail configurations
│   ├── controllers/     # Route handlers (contact, health)
│   ├── middleware/      # Validation, rate limiting, request ID, error handling
│   ├── providers/       # SMTP / Email provider implementations
│   ├── routes/          # API route definitions
│   ├── schemas/         # Zod input validation schemas
│   ├── services/        # Business logic & email dispatches
│   ├── templates/       # HTML email templates
│   ├── lib/             # Pino logger setup
│   ├── types/           # TypeScript interfaces & types
│   ├── app.ts           # Express application setup
│   └── server.ts        # Server entry point
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env` and populate the values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=https://my-new-portfolio-orcin-psi.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

> **Note on Gmail App Passwords**: Generate a 16-character App Password via Google Account Security settings (Requires 2-Factor Authentication enabled).

---

## Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build TypeScript for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

5. **Linting & Formatting**:
   ```bash
   npm run lint
   npm run format
   ```

---

## API Documentation

### 1. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response Example (200 OK)**:
  ```json
  {
    "status": "ok",
    "version": "1.0.0",
    "uptime": 412.4,
    "nodeVersion": "v24.x",
    "environment": "development",
    "timestamp": "2026-07-26T18:10:42.000Z"
  }
  ```

---

### 2. Submit Contact Inquiry
- **URL**: `/api/contact`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "company": "Acme Corp",
    "projectType": "Web Application",
    "budget": "$5,000 - $10,000",
    "projectDetails": "We need an interactive web application built with React and Express.",
    "website": "",
    "loadedAt": 1753554000000
  }
  ```

- **Success Response Example (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Thank you. Your inquiry has been received.",
    "requestId": "6af24d10-8b1e-450a-9d9d-21ab1518f8e2",
    "timestamp": "2026-07-26T18:15:00.000Z"
  }
  ```

- **Validation Failure Example (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed. Please check your inputs.",
    "requestId": "6af24d10-8b1e-450a-9d9d-21ab1518f8e2",
    "timestamp": "2026-07-26T18:15:00.000Z",
    "errors": {
      "email": ["Invalid email address"],
      "projectDetails": ["Project Details must be at least 10 characters"]
    }
  }
  ```

---

## Production Deployment

### Deploying to Render
1. Create a **New Web Service** on Render and connect your repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Set Environment Variables in Render Dashboard (`PORT`, `NODE_ENV`, `CLIENT_URL`, `EMAIL_USER`, `EMAIL_PASS`).

### Deploying to Railway
1. Create a new service on Railway.
2. Link your GitHub repo.
3. Configure environment variables in Railway settings.
4. Deployment builds automatically using `npm run build` and `npm start`.

---

## Troubleshooting

- **500 Error: Invalid Environment Variables**: Verify that all required keys (`EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL`) are present in your `.env` or deployment panel.
- **SMTP Auth Error (`Invalid login`)**: Ensure you are using an **App Password**, not your main Google account password.
- **CORS Block**: Ensure your frontend domain matches `CLIENT_URL` exactly.
- **429 Rate Limit Exceeded**: Wait 15 minutes or adjust `contactLimiter` in `src/middleware/rateLimiter.ts`.
