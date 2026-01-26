# VideoTube Backend API (Learning Project)
A beginner-friendly Node.js/Express backend for practicing API design, authentication, and file uploads. There is no frontend; all APIs are exercised via Postman or Thunder Client.

## Tech Stack
- Node.js, Express 5
- MongoDB with Mongoose
- JWT auth with httpOnly cookies
- Cloudinary for media storage, Multer for uploads
- CORS, Cookie Parser, dotenv, nodemon

## Features
- User registration with avatar (required) and optional cover image uploads
- Login with access/refresh tokens stored in secure cookies
- Token refresh, logout, change password, and current-user/profile endpoints
- Channel profile aggregation (subscribers/subscribed counts) and watch history lookup
- Clean modular structure (routes, controllers, models, middlewares, utils)

## Folder Structure
```text
src/
	app.js            # Express app setup
	index.js          # Server bootstrap
	constants.js      # Shared constants (DB name)
	db/               # Database connection
	routes/           # API route definitions
	controllers/      # Request handlers
	models/           # Mongoose schemas
	middlewares/      # Auth, upload, etc.
	utils/            # Helpers (Cloudinary, responses)
public/             # Static assets/uploads
```

## Getting Started (Local)
1) Install Node.js (>=18) and have a MongoDB connection string ready (Atlas or local).
2) Clone the repo and install dependencies:
```bash
npm install
```
3) Create a `.env` file in the project root using the template below.
4) Start the dev server with automatic reload:
```bash
npm run dev
```
5) The API defaults to `http://localhost:8000` (or the `PORT` you set).

## Environment Variables
Create a `.env` file alongside `package.json`:
```ini
PORT=8000
CORS_ORIGIN=http://localhost:3000

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net
# Database name is set in src/constants.js

ACCESS_TOKEN_SECRET=replace-with-strong-random-string
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=replace-with-strong-random-string
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Testing the APIs (Postman/Thunder Client)
- Base URL: `http://localhost:<PORT>/api/v1/users`
- Register: `POST /register` with `multipart/form-data` fields `avatar` (file, required) and `coverImage` (file, optional) plus `username`, `email`, `fullName`, `password`.
- Login: `POST /login` returns access/refresh tokens in httpOnly cookies; use those cookies for subsequent requests. You can also send `Authorization: Bearer <accessToken>` if preferred.
- Protected routes (logout, refresh-token, change-password, current-user, avatar/cover-image updates, channel profile, history) require the access token.
- For file uploads, set the body type to form-data and attach files from your disk.

## Data Models
- Visual schema: [DataModels](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Notes
- Backend-only project; no UI is included.
- Keep your `.env` out of version control.
- Use this repository as a learning playground—feel free to extend models, add routes, or plug in your own client.