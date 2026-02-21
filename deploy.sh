#!/usr/bin/env bash
set -euo pipefail

# Server-side deploy script for environments where CI is available
# but automatic CD on the server is not.

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_ENV="${1:-dev}"
case "$TARGET_ENV" in
  dev|qa|prod) ;;
  *)
    echo "Usage: $0 {dev|qa|prod}"
    exit 1
    ;;
esac

ENV_FILE_DEFAULT=".env.${TARGET_ENV}"
ENV_FILE="${ENV_FILE:-$ENV_FILE_DEFAULT}"
RUNTIME_ENV_FILE="${RUNTIME_ENV_FILE:-.env}"
PORT="${PORT:-5175}"
PID_FILE="${PID_FILE:-.next-app.pid}"
SKIP_BUILD="${SKIP_BUILD:-0}"

log() {
  printf '[deploy] %s\n' "$*"
}

cd "$APP_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  log "Missing $ENV_FILE in $APP_DIR for environment '$TARGET_ENV'"
  exit 1
fi

cp "$ENV_FILE" "$RUNTIME_ENV_FILE"
log "Loaded environment '$TARGET_ENV' from $ENV_FILE -> $RUNTIME_ENV_FILE"

PKG_MGR=""
if command -v yarn >/dev/null 2>&1 && [[ -f yarn.lock ]]; then
  PKG_MGR="yarn"
elif command -v npm >/dev/null 2>&1; then
  PKG_MGR="npm"
fi

if [[ "$SKIP_BUILD" != "1" ]]; then
  if [[ -z "$PKG_MGR" ]]; then
    log "Neither yarn nor npm is installed. Set SKIP_BUILD=1 to deploy prebuilt artifact."
    exit 1
  fi

  if [[ "$PKG_MGR" == "yarn" ]]; then
    log "Installing dependencies with yarn"
    yarn install --frozen-lockfile
    log "Building application"
    yarn build
  else
    log "Installing dependencies with npm"
    npm ci
    log "Building application"
    npm run build
  fi
else
  log "SKIP_BUILD=1, skipping dependency install and build"
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" || true)"
  if [[ -n "${OLD_PID:-}" ]] && kill -0 "$OLD_PID" >/dev/null 2>&1; then
    log "Stopping previous process $OLD_PID"
    kill "$OLD_PID" >/dev/null 2>&1 || true
    sleep 2
  fi
  rm -f "$PID_FILE"
fi

log "Starting application on port $PORT"
if command -v npm >/dev/null 2>&1; then
  START_CMD=(npm run start)
elif [[ -x "./node_modules/.bin/next" ]]; then
  START_CMD=(./node_modules/.bin/next start -p "$PORT")
else
  log "Cannot start app: npm is not installed and ./node_modules/.bin/next is missing"
  exit 1
fi

nohup env PORT="$PORT" "${START_CMD[@]}" >/tmp/open-care-frontend.log 2>&1 &
NEW_PID="$!"
echo "$NEW_PID" > "$PID_FILE"

log "Deployment complete. PID=$NEW_PID, logs=/tmp/open-care-frontend.log"
