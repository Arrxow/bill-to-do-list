# Bill to-do (MERN)

A web app to track bills due for the month with statuses **incomplete**, **pending**, and **completed**. Use it on your phone or any device – data syncs via your account (MongoDB + Express API in the cloud).

## Stack

- **M**ongoDB (Atlas) – database
- **E**xpress – API and auth (JWT)
- **R**eact – frontend (Vite)
- **N**ode – runtime

## Run locally

### 1. MongoDB

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), get the connection string, and create a database (e.g. `billtodo`).

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000`. In dev, the client proxies `/api` to the backend so you don’t need `VITE_API_URL`.

## Deploy (use from anywhere)

- **Backend**: Deploy `server` to [Render](https://render.com) (Web Service, Node, set `MONGODB_URI` and `JWT_SECRET`).
- **Frontend**: Deploy `client` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Set env var `VITE_API_URL` to your Render API URL (e.g. `https://your-app.onrender.com`).
- **Database**: Use the same MongoDB Atlas cluster (free tier is enough).

After deployment, open the frontend URL on your phone (or any device) and sign in – no home computer needed.

## API (for reference)

- `POST /api/auth/register` – body: `{ "email", "password" }`
- `POST /api/auth/login` – body: `{ "email", "password" }` → returns `{ token, user }`
- `GET /api/bills?month=YYYY-MM&status=incomplete|pending|completed` – list (auth required)
- `POST /api/bills` – create (auth required)
- `GET /api/bills/:id` – get one (auth required)
- `PATCH /api/bills/:id` – update (auth required)
- `DELETE /api/bills/:id` – delete (auth required)

Send `Authorization: Bearer <token>` for protected routes.
