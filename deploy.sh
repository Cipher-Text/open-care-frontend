#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-open-care-frontend}"
TARGET_ENV="${1:-dev}"    # dev|qa|prod
PORT="${PORT:-5175}"
CONTAINER_PORT="${CONTAINER_PORT:-5173}"

DOCKER_USER="${DOCKER_USER:-imran110219}"  # or export in env
IMAGE="${IMAGE:-$DOCKER_USER/open-care-frontend:${TARGET_ENV}-latest}"

ENV_FILE="${ENV_FILE:-/home/ubuntu/open-care-frontend/.env.${TARGET_ENV}}"

log(){ printf '[deploy] %s\n' "$*"; }

case "$TARGET_ENV" in dev|qa|prod) ;; *) echo "Usage: $0 {dev|qa|prod}"; exit 1;; esac

if [[ ! -f "$ENV_FILE" ]]; then
  log "Missing env file: $ENV_FILE"
  exit 1
fi

log "Pulling image: $IMAGE"
sudo docker pull "$IMAGE"

log "Stopping old container (if any)"
sudo docker stop "$APP_NAME" >/dev/null 2>&1 || true
sudo docker rm "$APP_NAME" >/dev/null 2>&1 || true

log "Starting container: $APP_NAME on $PORT:$CONTAINER_PORT"
sudo docker run -d \
  --name "$APP_NAME" \
  -p "${PORT}:${CONTAINER_PORT}" \
  --restart always \
  --env-file "$ENV_FILE" \
  "$IMAGE"

log "Done. Check logs: sudo docker logs -f $APP_NAME"