# SnapLink URL Shortener

SnapLink is a full-stack URL shortener built with Node.js, Express, MongoDB, and vanilla frontend code. It supports short link creation, custom aliases, redirects, click tracking, editing, deletion, and a lightweight dashboard.

## Features

- Create short links from long URLs
- Reuse an existing short link for duplicate URLs
- Choose a custom alias when you want a memorable link
- Redirect short links to the original destination
- Track clicks and last-visited timestamps
- Edit and delete short links
- Use the product through a browser dashboard or REST API

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- Nano ID
- Vanilla HTML, CSS, and JavaScript

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   copy .env.example .env
   ```

3. Update `MONGO_URI` if you are using MongoDB Atlas.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5000](http://localhost:5000).

If you do not have MongoDB installed locally, use a MongoDB Atlas connection string in `.env`.

## API Endpoints

- `GET /api/health` health check
- `GET /api/urls` list recent short links
- `POST /api/urls` create a short link
- `GET /api/urls/:shortCode` get analytics for one short link
- `PATCH /api/urls/:shortCode` update the destination URL
- `DELETE /api/urls/:shortCode` delete a short link
- `GET /:shortCode` redirect to the destination URL

## Example Create Request

```json
{
  "originalUrl": "https://openai.com",
  "customCode": "openai"
}
```

## Learning Notes

The running project notes are stored in [docs/learning-journal.md](./docs/learning-journal.md), and a PDF snapshot can be generated with:

```bash
npm run learn:pdf
```
