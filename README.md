# SnapLink

**Snap. Scan. Shorten.**

SnapLink is a full-stack URL shortener with a cinematic frontend, QR code generation, click tracking, custom aliases, and a clean REST API. It started as a backend learning project and was pushed into a portfolio-grade product with a strong visual identity, usable browser interface, and production-style structure.

## Why This Project Stands Out

Most URL shorteners stop at CRUD.

SnapLink goes further:

- sharp landing-page style UI instead of a generic form
- real redirect flow using short codes
- QR code generation for every short link
- analytics basics with click count and last visit time
- editable and deletable links from the UI
- reusable backend structure with controllers, services, middleware, and utilities

This makes it a much better showcase of backend engineering, product thinking, and frontend polish than a typical tutorial clone.

## Features

- Create short URLs from long destination links
- Reuse an existing short link for duplicate long URLs
- Create custom aliases for memorable links
- Redirect short links to the original destination
- Generate a downloadable QR code for every short link
- Track click count and last-visited timestamp
- Edit destination URLs after creation
- Delete links from the dashboard
- Manage everything through a browser UI or the REST API

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Zod
- Nano ID

### Frontend

- HTML
- CSS
- Vanilla JavaScript

### Tooling

- Nodemon
- Dotenv
- Morgan
- QRCode

## Design Direction

The current UI is inspired by a bold editorial web concept:

- oversized condensed typography
- black and red cinematic palette
- centered hero interaction
- subtle web/target graphics
- custom desktop cursor treatment
- dramatic contrast instead of generic dashboard styling

The goal was to make the project instantly memorable on GitHub and in demos.

## Project Structure

```txt
url-shortener/
|-- docs/
|   |-- learning-journal.md
|   `-- learning-journal.pdf
|-- scripts/
|   `-- generate-learning-pdf.py
|-- src/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   `-- urlController.js
|   |-- middleware/
|   |   |-- errorHandler.js
|   |   `-- notFound.js
|   |-- models/
|   |   `-- Url.js
|   |-- public/
|   |   |-- app.js
|   |   |-- index.html
|   |   `-- styles.css
|   |-- routes/
|   |   |-- redirectRoute.js
|   |   `-- urlRoutes.js
|   |-- services/
|   |   `-- urlService.js
|   `-- utils/
|       |-- AppError.js
|       |-- asyncHandler.js
|       |-- buildShortUrl.js
|       `-- generateQrCode.js
|-- .env.example
|-- package.json
`-- README.md
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

```bash
copy .env.example .env
```

### 3. Set `MONGO_URI`

You have two good options:

#### Local MongoDB

```env
MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
BASE_URL=http://localhost:5000
PORT=5000
```

#### MongoDB Atlas

```env
MONGO_URI=your_atlas_connection_string
BASE_URL=http://localhost:5000
PORT=5000
```

If you use Atlas:

- make sure the database user credentials are correct
- make sure your current IP is allowed under **Network Access**
- if your password contains special characters, URL-encode it

### 4. Run the app

```bash
npm run dev
```

### 5. Open it in the browser

[http://localhost:5000](http://localhost:5000)

## API Overview

### Health

- `GET /api/health`

Returns server health info.

### Create a short link

- `POST /api/urls`

Example body:

```json
{
  "originalUrl": "https://openai.com",
  "customCode": "openai"
}
```

### List recent links

- `GET /api/urls`

### Get stats for a single short code

- `GET /api/urls/:shortCode`

### Update a link destination

- `PATCH /api/urls/:shortCode`

Example body:

```json
{
  "originalUrl": "https://platform.openai.com"
}
```

### Delete a link

- `DELETE /api/urls/:shortCode`

### Redirect

- `GET /:shortCode`

This is the real short-link route users visit.

## Example Response Shape

```json
{
  "message": "Short URL created successfully.",
  "data": {
    "id": "6654b7d11c4f0a1234567890",
    "originalUrl": "https://openai.com",
    "shortCode": "openai",
    "shortUrl": "http://localhost:5000/openai",
    "qrCodeDataUrl": "data:image/png;base64,...",
    "qrCodeFilename": "openai-qr.png",
    "clicks": 0,
    "lastVisitedAt": null,
    "createdAt": "2026-05-28T00:00:00.000Z",
    "updatedAt": "2026-05-28T00:00:00.000Z"
  }
}
```

## What I Learned Building This

- how to structure an Express app beyond a single file
- why validation should happen before database writes
- how redirects and analytics interact in one request flow
- how to generate derived assets like QR codes on the backend
- how much better a project looks when the UI has a real point of view
- why startup order matters when your app depends on a database connection

## Learning Journal

This repo includes a parallel build log:

- [docs/learning-journal.md](./docs/learning-journal.md)
- [docs/learning-journal.pdf](./docs/learning-journal.pdf)

Generate the PDF again anytime with:

```bash
npm run learn:pdf
```

## Future Improvements

- authentication and per-user link dashboards
- expiration dates for short links
- richer analytics charts
- copy-QR-image support
- test coverage for controllers and services
- deploy to Render, Railway, or a VPS
- Docker setup for local and production parity

## Repository

GitHub: [Pierce05/url_shortener](https://github.com/Pierce05/url_shortener)
