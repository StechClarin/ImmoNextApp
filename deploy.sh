#!/usr/bin/env bash
# ==============================================================================
# Script de Déploiement Automatisé — Immovitrine (Docker + Next.js + Prisma)
# Prestataire : ethernanos-SC@Zircon (ethernanos.space)
# ==============================================================================

set -e

# Couleurs pour l'affichage console
TEAL="\033[38;2;15;118;110m"
GOLD="\033[38;2;245;158;11m"
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
BOLD="\033[1m"
RESET="\033[0m"

echo -e "${TEAL}${BOLD}"
echo "=================================================================="
echo "    🚀  IMMOVITRINE CONGO — DÉPLOIEMENT AUTOMATISÉ DOCKER         "
echo "=================================================================="
echo -e "${RESET}"

# 1. Détection de la commande Docker Compose (v2 avec plugin ou v1 autonome)
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif which docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}❌ Erreur : Ni 'docker compose' ni 'docker-compose' n'est installé sur ce serveur.${RESET}"
    exit 1
fi

# 2. Demande ou détection de la branche Git
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "version1")
TARGET_BRANCH="$1"

if [ -z "$TARGET_BRANCH" ]; then
    echo -e "Branche Git actuellement active : ${GOLD}${CURRENT_BRANCH}${RESET}"
    read -rp "Entrez la branche Git à déployer [défaut: ${CURRENT_BRANCH}] : " INPUT_BRANCH
    TARGET_BRANCH="${INPUT_BRANCH:-$CURRENT_BRANCH}"
fi

echo -e "\n${BLUE}➔ 1. Récupération des dernières modifications sur la branche '${GOLD}${TARGET_BRANCH}${BLUE}'...${RESET}"
git fetch origin "$TARGET_BRANCH"
git checkout "$TARGET_BRANCH"
git pull origin "$TARGET_BRANCH"

# 3. Vérification du fichier d'environnement .env
echo -e "\n${BLUE}➔ 2. Vérification de l'environnement (.env)...${RESET}"
if [ ! -f .env ]; then
    echo -e "${GOLD}⚠️  Fichier .env introuvable. Création automatique à partir de .env.example...${RESET}"
    cp .env.example .env
    echo -e "${GREEN}✓ Fichier .env créé. Pensez à y ajuster vos secrets de production si nécessaire.${RESET}"
else
    echo -e "${GREEN}✓ Fichier .env présent.${RESET}"
fi

# 4. S'assurer que les répertoires persistants existent
echo -e "\n${BLUE}➔ 3. Préparation des volumes persistants (SQLite et téléversements)...${RESET}"
mkdir -p data public/uploads
chmod 775 data public/uploads 2>/dev/null || true
echo -e "${GREEN}✓ Dossiers 'data/' et 'public/uploads/' prêts pour le montage Docker.${RESET}"

# 5. Construction et démarrage des conteneurs
echo -e "\n${BLUE}➔ 4. Construction et démarrage du conteneur Docker (port local 8095)...${RESET}"
$DOCKER_COMPOSE down --remove-orphans 2>/dev/null || true
$DOCKER_COMPOSE up -d --build

# 6. Vérification de l'état de santé du conteneur
echo -e "\n${BLUE}➔ 5. Vérification du démarrage et test de connectivité locale...${RESET}"
echo "Attente de l'initialisation de l'application (5 secondes)..."
sleep 5

CONTAINER_STATUS=$(docker inspect --format='{{.State.Status}}' immovitrine_app 2>/dev/null || echo "not_found")

if [ "$CONTAINER_STATUS" = "running" ]; then
    echo -e "${GREEN}✓ Conteneur 'immovitrine_app' actif (${CONTAINER_STATUS}).${RESET}"
else
    echo -e "${RED}⚠️  Attention : Le conteneur ne semble pas actif (état: ${CONTAINER_STATUS}).${RESET}"
    echo "Logs du conteneur :"
    $DOCKER_COMPOSE logs --tail=25 immovitrine
    exit 1
fi

# Test de réponse HTTP locale
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8095/ || echo "000")

echo -e "\n${TEAL}${BOLD}=================================================================="
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "308" ]; then
    echo -e "    ${GREEN}✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS SUR LA BRANCHE '${TARGET_BRANCH}' !${RESET}${TEAL}${BOLD}"
    echo "=================================================================="
    echo -e "${RESET}"
    echo -e "• Port d'écoute interne  : ${GOLD}http://127.0.0.1:8095${RESET}"
    echo -e "• Conteneur en cours     : ${GOLD}immovitrine_app${RESET}"
    echo -e "• Code réponse HTTP      : ${GREEN}${HTTP_CODE} OK${RESET}"
    echo ""
    echo "Commandes utiles :"
    echo "  - Voir les logs en direct : $DOCKER_COMPOSE logs -f immovitrine"
    echo "  - Redémarrer              : $DOCKER_COMPOSE restart"
    echo "  - Arrêter                 : $DOCKER_COMPOSE down"
else
    echo -e "    ${GOLD}⚠️  Conteneur démarré mais réponse HTTP inattendue (${HTTP_CODE}).${RESET}${TEAL}${BOLD}"
    echo "=================================================================="
    echo -e "${RESET}"
    echo "Vérifiez les logs avec :"
    echo "  $DOCKER_COMPOSE logs -f immovitrine"
fi

