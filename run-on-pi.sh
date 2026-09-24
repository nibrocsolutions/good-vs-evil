#!/usr/bin/env bash
# Serve the committed release/ build. No Node.js and no npm install.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE="$ROOT/release"
PORT="${PORT:-8080}"
KIOSK=0
ACTION="serve"

usage() {
  cat <<'EOF'
Usage: ./run-on-pi.sh [--port 8080] [--kiosk] [--install-service] [--update]

  Serve the game (default)     python3 only; prints this Pi's URLs
  --port N                     listen on port N (or set PORT=N)
  --kiosk                      also open Chromium fullscreen if a desktop is running
  --install-service            install a systemd service that starts the game on boot
  --install-service --kiosk    also open Chromium fullscreen when the desktop logs in
  --uninstall-service          remove that systemd service
  --update                     git pull, then restart the service if it is installed

Open the printed URL in a browser on this Pi or on another device on the same network.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      PORT="${2:-}"
      shift 2
      ;;
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --kiosk)
      KIOSK=1
      shift
      ;;
    --install-service)
      ACTION="install"
      shift
      ;;
    --uninstall-service)
      ACTION="uninstall"
      shift
      ;;
    --update)
      ACTION="update"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [[ "$PORT" -lt 1 || "$PORT" -gt 65535 ]]; then
  echo "Port must be a number from 1 to 65535." >&2
  exit 1
fi

require_release() {
  if [[ ! -f "$RELEASE/index.html" ]]; then
    echo "release/index.html is missing." >&2
    echo "On a development machine run: npm run sync-release" >&2
    echo "Then commit release/ and git pull on the Pi." >&2
    exit 1
  fi
}

find_browser() {
  local candidate
  for candidate in chromium chromium-browser; do
    if command -v "$candidate" >/dev/null 2>&1; then
      command -v "$candidate"
      return 0
    fi
  done
  return 1
}

print_urls() {
  echo "On this Pi:  http://127.0.0.1:${PORT}/"
  local ips ip found=0
  ips="$(hostname -I 2>/dev/null || true)"
  for ip in $ips; do
    case "$ip" in
      127.*|*:*) continue ;;
    esac
    echo "On your LAN: http://${ip}:${PORT}/"
    found=1
  done
  if [[ "$found" -eq 0 ]]; then
    echo "No LAN address found. Look one up with: hostname -I"
  fi
}

service_installed() {
  systemctl list-unit-files good-vs-evil.service --no-legend 2>/dev/null | grep -q good-vs-evil.service
}

install_service() {
  require_release
  local python unit
  python="$(command -v python3)"
  unit="/etc/systemd/system/good-vs-evil.service"
  echo "Installing $unit (sudo may ask for a password)."
  sudo tee "$unit" >/dev/null <<EOF
[Unit]
Description=Good vs. Evil story game
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$ROOT
ExecStart=$python $ROOT/scripts/serve_release.py --port $PORT --directory $ROOT/release
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now good-vs-evil.service
  echo "The game starts on boot and is running now."
  print_urls

  if [[ "$KIOSK" -eq 1 ]]; then
    local browser desktop
    if ! browser="$(find_browser)"; then
      echo "Chromium is not installed. On the Pi: sudo apt install chromium" >&2
      echo "The server is still running." >&2
      return 0
    fi
    mkdir -p "$HOME/.config/autostart"
    desktop="$HOME/.config/autostart/good-vs-evil.desktop"
    cat >"$desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Good vs. Evil
Comment=Open the story game fullscreen
Exec=sh -c "sleep 3; exec $browser --kiosk --start-fullscreen http://127.0.0.1:${PORT}/"
X-GNOME-Autostart-enabled=true
EOF
    echo "Fullscreen Chromium will open when this user logs into the desktop."
    echo "Autostart file: $desktop"
  fi
}

uninstall_service() {
  if [[ -f /etc/systemd/system/good-vs-evil.service ]]; then
    sudo systemctl disable --now good-vs-evil.service || true
    sudo rm -f /etc/systemd/system/good-vs-evil.service
    sudo systemctl daemon-reload
    echo "Removed the good-vs-evil service."
  else
    echo "No good-vs-evil service is installed."
  fi
  rm -f "$HOME/.config/autostart/good-vs-evil.desktop"
}

update_repo() {
  echo "Pulling the latest commit in $ROOT"
  git -C "$ROOT" pull --ff-only
  if service_installed; then
    echo "Restarting good-vs-evil.service"
    sudo systemctl restart good-vs-evil.service
    echo "Updated and restarted."
    print_urls
  else
    echo "Updated. Start it with: ./run-on-pi.sh"
  fi
}

open_kiosk() {
  local browser url="http://127.0.0.1:${PORT}/"
  if [[ -z "${DISPLAY:-}" && -z "${WAYLAND_DISPLAY:-}" ]]; then
    echo "No desktop session (DISPLAY is unset). Open this URL in a browser: $url"
    return 0
  fi
  if ! browser="$(find_browser)"; then
    echo "Chromium is not installed. On the Pi: sudo apt install chromium" >&2
    echo "The server is still available at $url" >&2
    return 0
  fi
  "$browser" --kiosk --start-fullscreen "$url" >/dev/null 2>&1 &
  BROWSER_PID=$!
  echo "Opened Chromium fullscreen (pid $BROWSER_PID)."
}

serve() {
  require_release
  if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required. Raspberry Pi OS includes it." >&2
    exit 1
  fi
  echo "Good vs. Evil"
  print_urls
  echo "Press Ctrl+C to stop."
  local server_pid
  if [[ "$KIOSK" -eq 1 ]]; then
    open_kiosk
  fi
  python3 "$ROOT/scripts/serve_release.py" --port "$PORT" --directory "$RELEASE" &
  server_pid=$!
  cleanup() {
    kill "$server_pid" >/dev/null 2>&1 || true
    if [[ -n "${BROWSER_PID:-}" ]]; then
      kill "$BROWSER_PID" >/dev/null 2>&1 || true
    fi
  }
  trap cleanup EXIT INT TERM
  wait "$server_pid"
}

case "$ACTION" in
  serve) serve ;;
  install) install_service ;;
  uninstall) uninstall_service ;;
  update) update_repo ;;
esac
