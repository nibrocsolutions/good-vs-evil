# Serves the committed release/ build. The image does not compile the game:
# nginx:alpine already publishes arm64 and arm/v7, so a Raspberry Pi only
# copies static files. npm test checks that release/ matches the source.
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY release/ /usr/share/nginx/html/

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
