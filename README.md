A test repo for MERN setup with TSX and some experimentation with CRDT.

## Docker

### Quick Start with Docker Compose (Recommended)

1. Create a root `.env` from `.env.example` and set your cloud Mongo URI:

```bash
cp .env.example .env
```

2. From the project root:

```bash
docker compose up --build
```

This starts:

- `frontend` on `http://localhost:5173`
- `backend` on `http://localhost:4000`
- `backend` connected to your cloud MongoDB via `MONGO_URI` from root `.env`

Stop everything:

```bash
docker compose down
```

If you want to remove containers and networks too:

```bash
docker compose down -v
```

### Backend

Build image:

```bash
cd backend
docker build -t crdt-backend .
```

Run container:

```bash
docker run --rm -p 4000:4000 --env-file .env crdt-backend
```

### Frontend

Build image:

```bash
cd frontend/react
docker build -t crdt-frontend .
```

Run container:

```bash
docker run --rm -p 5173:80 crdt-frontend
```

Open `http://localhost:5173` in the browser. The frontend calls backend at `http://localhost:4000`.