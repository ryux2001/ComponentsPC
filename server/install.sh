#!/bin/bash
# install.sh
npm install -g pnpm
pnpm install
mkdir -p node_modules/express
# Crear un enlace directo al módulo de pnpm
ln -sf $(pwd)/node_modules/.pnpm/*/node_modules/express node_modules/express 2>/dev/null || true