#!/bin/sh
set -eu

cat <<EOF >/usr/share/nginx/html/env.js
window.__ENV = {
  API_KEY: "${API_KEY:-}",
  AI_BACKEND: "${AI_BACKEND:-}"
};
EOF
