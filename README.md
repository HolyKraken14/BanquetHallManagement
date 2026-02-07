## Running the Project with Docker

This project provides Dockerfiles for both the frontend (`./frontend`) and backend (`./src`) applications, along with a Docker Compose configuration to orchestrate both services.

### Project-Specific Docker Requirements
- **Node.js Version:** Both services require Node.js `22.13.1-slim` (as specified by `ARG NODE_VERSION=22.13.1` in the Dockerfiles).
- **Dependencies:**
  - Frontend and backend dependencies are installed using `npm ci` for deterministic builds.
  - Production dependencies only are included in the final images.
- **Non-root User:** Both containers run as a non-root user for improved security.

### Environment Variables
- The Docker Compose file includes commented `env_file` lines for both services. If you have environment variables, place them in `.env` files in `./frontend` and `./src` respectively, and uncomment these lines in `docker-compose.yml`.

### Build and Run Instructions
1. **Ensure Docker and Docker Compose are installed.**
2. **Build and start the services:**
   ```sh
   docker compose up --build
   ```
   This will build and start both the frontend and backend containers.

### Service Ports
- **Frontend (`js-frontend`):**
  - Exposes port `4173` (Vite preview server)
- **Backend (`js-src`):**
  - Exposes port `7002` (API server)

### Special Configuration
- **Service Dependency:** The frontend service (`js-frontend`) depends on the backend (`js-src`) and will wait for it to be available before starting.
- **Network:** Both services are connected via a custom bridge network `appnet` for internal communication.
- **Resource Limits:** Both containers set `NODE_OPTIONS="--max-old-space-size=4096"` to increase available memory for Node.js processes.

### Summary
- **Node.js 22.13.1-slim** is required for both services.
- **Ports:** 4173 (frontend), 7002 (backend)
- **Optional:** Add `.env` files for environment variables if needed.
- **Start everything:** `docker compose up --build`

Refer to the Dockerfiles and `docker-compose.yml` for further customization as needed for your development or production environment.
