#!/usr/bin/env python3
"""Serve the prebuilt game with Python's standard library only."""

import argparse
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Explicit types so ES modules and fonts load even when the OS mime database
# maps .js to text/plain.
EXTRA_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".webp": "image/webp",
    ".png": "image/png",
    ".ico": "image/x-icon",
}


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, **EXTRA_TYPES}


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the Good vs. Evil release build.")
    parser.add_argument("--port", type=int, required=True)
    parser.add_argument("--directory", required=True)
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        print("Port must be between 1 and 65535.", file=sys.stderr)
        sys.exit(1)

    handler = partial(Handler, directory=args.directory)
    try:
        server = ThreadingHTTPServer(("0.0.0.0", args.port), handler)
    except OSError:
        print(
            f"Port {args.port} is already in use. Try: ./run-on-pi.sh --port {args.port + 1}",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"Serving {args.directory} on 0.0.0.0:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
