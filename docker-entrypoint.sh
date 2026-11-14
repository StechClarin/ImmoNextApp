#!/bin/sh
set -e

# S'assurer que les dossiers de volumes persistants existent
mkdir -p /app/data /app/public/uploads

# Ajuster la propriété au cas où le volume a été monté par Docker avec l'utilisateur root
chown -R nextjs:nodejs /app/data /app/public/uploads 2>/dev/null || true
chmod -R 775 /app/data /app/public/uploads 2>/dev/null || true

# Exécuter la commande finale sous l'utilisateur sécurisé nextjs
exec su-exec nextjs "$@"
