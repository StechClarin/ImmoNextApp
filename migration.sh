#!/usr/bin/env bash
# ==============================================================================
# Script de Migration & Sauvegarde — Immovitrine (SQLite + Uploads + .env)
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
echo "    📦  IMMOVITRINE CONGO — MIGRATION & SAUVEGARDE DE SERVEUR    "
echo "=================================================================="
echo -e "${RESET}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ACTION="$1"

# Si aucun argument n'est fourni, afficher le menu interactif
if [ -z "$ACTION" ]; then
    echo -e "${BOLD}Que souhaitez-vous faire ?${RESET}"
    echo -e "  ${GOLD}1)${RESET} ${BOLD}EXPORTER${RESET} — Sauvegarder la base de données SQLite et les images (pour quitter ce serveur)"
    echo -e "  ${GOLD}2)${RESET} ${BOLD}IMPORTER${RESET} — Restaurer une sauvegarde sur ce serveur (nouveau serveur de prod)"
    echo -e "  ${GOLD}3)${RESET} ${BOLD}TRANSFERT DIRECT${RESET} — Envoyer directement la sauvegarde vers le nouveau serveur via SSH"
    echo -e "  ${GOLD}4)${RESET} Quitter"
    echo ""
    read -rp "Votre choix [1/2/3/4] : " CHOICE

    case "$CHOICE" in
        1) ACTION="export" ;;
        2) ACTION="import" ;;
        3) ACTION="transfer" ;;
        *) echo -e "${BLUE}Opération annulée.${RESET}"; exit 0 ;;
    esac
fi

# ==============================================================================
# 1. ACTION : EXPORTATION / SAUVEGARDE
# ==============================================================================
if [ "$ACTION" = "export" ] || [ "$ACTION" = "backup" ]; then
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_DIR="backups"
    ARCHIVE_NAME="immovitrine_migration_${TIMESTAMP}.tar.gz"
    ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

    mkdir -p "$BACKUP_DIR"

    echo -e "\n${BLUE}➔ 1. Analyse des données à exporter...${RESET}"

    # Vérification des composants
    ELEMENTS_TO_BACKUP=""

    if [ -d "data" ]; then
        DB_SIZE=$(du -sh data | cut -f1)
        echo -e "  ✔ Base de données SQLite (${TEAL}data/${RESET}) détectée [${BOLD}${DB_SIZE}${RESET}]"
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP data"
    else
        echo -e "  ${GOLD}⚠ Dossier 'data' introuvable (création d'un dossier vide)${RESET}"
        mkdir -p data
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP data"
    fi

    if [ -d "public/uploads" ]; then
        UPLOADS_SIZE=$(du -sh public/uploads | cut -f1)
        COUNT_FILES=$(find public/uploads -type f | wc -l)
        echo -e "  ✔ Photos & Médias (${TEAL}public/uploads/${RESET}) : ${BOLD}${COUNT_FILES} fichiers${RESET} [${BOLD}${UPLOADS_SIZE}${RESET}]"
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP public/uploads"
    else
        mkdir -p public/uploads
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP public/uploads"
    fi

    if [ -f ".env" ]; then
        echo -e "  ✔ Variables d'environnement (${TEAL}.env${RESET}) détectées"
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP .env"
    elif [ -f ".env.example" ]; then
        echo -e "  ${GOLD}⚠ Aucun .env trouvé, utilisation de .env.example${RESET}"
        ELEMENTS_TO_BACKUP="$ELEMENTS_TO_BACKUP .env.example"
    fi

    echo -e "\n${BLUE}➔ 2. Création de l'archive compressée '${GOLD}${ARCHIVE_PATH}${BLUE}'...${RESET}"
    tar -czvf "$ARCHIVE_PATH" $ELEMENTS_TO_BACKUP >/dev/null

    FINAL_SIZE=$(du -sh "$ARCHIVE_PATH" | cut -f1)
    echo -e "${GREEN}${BOLD}✔ Archive de migration créée avec succès !${RESET}"
    echo -e "  Fichier : ${TEAL}${BOLD}${ARCHIVE_PATH}${RESET} (${FINAL_SIZE})"

    # Création d'un lien symbolique pour le dernier backup
    ln -sf "$ARCHIVE_NAME" "${BACKUP_DIR}/latest_migration.tar.gz"

    echo -e "\n${GOLD}${BOLD}=================================================================="
    echo "  COMMENT RESTAURER CETTE SAUVEGARDE SUR LE NOUVEAU SERVEUR :"
    echo "==================================================================${RESET}"
    echo -e "1. Transférez le fichier vers le nouveau serveur avec cette commande :"
    echo -e "   ${BOLD}scp ${ARCHIVE_PATH} user@IP_NOUVEAU_SERVEUR:/chemin/vers/immovitrine/${RESET}"
    echo ""
    echo -e "2. Sur le nouveau serveur, dans le dossier du projet, lancez simplement :"
    echo -e "   ${BOLD}./migration.sh import ${ARCHIVE_NAME}${RESET}"
    echo ""
    exit 0
fi

# ==============================================================================
# 2. ACTION : IMPORTATION / RESTAURATION
# ==============================================================================
if [ "$ACTION" = "import" ] || [ "$ACTION" = "restore" ]; then
    ARCHIVE_FILE="$2"

    if [ -z "$ARCHIVE_FILE" ]; then
        # Recherche des archives existantes
        LATEST_BACKUP=$(ls -t backups/immovitrine_migration_*.tar.gz 2>/dev/null | head -n 1 || true)
        if [ -n "$LATEST_BACKUP" ]; then
            DEFAULT_ARCHIVE="$LATEST_BACKUP"
        elif [ -f "migration.tar.gz" ]; then
            DEFAULT_ARCHIVE="migration.tar.gz"
        else
            DEFAULT_ARCHIVE=""
        fi

        echo -e "${BLUE}Archives disponibles :${RESET}"
        ls -lh backups/immovitrine_migration_*.tar.gz 2>/dev/null || echo "  (Aucune archive trouvée dans backups/)"
        echo ""
        read -rp "Entrez le chemin du fichier d'archive à restaurer [${DEFAULT_ARCHIVE}] : " INPUT_FILE
        ARCHIVE_FILE="${INPUT_FILE:-$DEFAULT_ARCHIVE}"
    fi

    if [ ! -f "$ARCHIVE_FILE" ]; then
        echo -e "${RED}❌ Erreur : Le fichier d'archive '$ARCHIVE_FILE' n'existe pas.${RESET}"
        exit 1
    fi

    echo -e "\n${BLUE}➔ 1. Vérification de l'archive '${GOLD}${ARCHIVE_FILE}${BLUE}'...${RESET}"
    if ! tar -tzf "$ARCHIVE_FILE" >/dev/null 2>&1; then
        echo -e "${RED}❌ Erreur : L'archive est corrompue ou n'est pas un fichier tar.gz valide.${RESET}"
        exit 1
    fi

    # Sauvegarde de précaution des données actuelles si existantes
    if [ -d "data" ] && [ -f "data/immovitrine.db" ]; then
        SAFETY_BACKUP="backups/safety_before_restore_$(date +'%Y%m%d_%H%M%S').tar.gz"
        mkdir -p backups
        tar -czf "$SAFETY_BACKUP" data/ public/uploads/ 2>/dev/null || true
        echo -e "  ✔ Sauvegarde de sécurité créée : ${TEAL}${SAFETY_BACKUP}${RESET}"
    fi

    echo -e "\n${BLUE}➔ 2. Extraction des données (Base SQLite + Photos + .env)...${RESET}"
    tar -xzvf "$ARCHIVE_FILE"

    echo -e "\n${BLUE}➔ 3. Ajustement des permissions pour Docker...${RESET}"
    mkdir -p data public/uploads
    chmod -R 775 data public/uploads 2>/dev/null || true

    echo -e "${GREEN}${BOLD}✔ Données restaurées avec succès !${RESET}"

    # Proposer de relancer Docker
    echo ""
    read -rp "Souhaitez-vous lancer le déploiement Docker immédiatement avec ./deploy.sh ? [O/n] : " RUN_DEPLOY
    RUN_DEPLOY="${RUN_DEPLOY:-O}"
    if [[ "$RUN_DEPLOY" =~ ^[OoYy]$ ]]; then
        if [ -f "./deploy.sh" ]; then
            chmod +x ./deploy.sh
            ./deploy.sh
        else
            docker compose up -d --build
        fi
    else
        echo -e "${BLUE}Pour démarrer le serveur ultérieurement, lancez : ${BOLD}./deploy.sh${RESET}"
    fi
    exit 0
fi

# ==============================================================================
# 3. ACTION : TRANSFERT DIRECT VIA SSH
# ==============================================================================
if [ "$ACTION" = "transfer" ]; then
    echo -e "\n${BLUE}➔ Préparation du transfert direct...${RESET}"
    read -rp "Identifiant et hôte distant SSH (ex: stech@192.168.1.50 ou user@srv940069) : " REMOTE_HOST
    if [ -z "$REMOTE_HOST" ]; then
        echo -e "${RED}❌ Hôte distant manquant.${RESET}"; exit 1
    fi

    read -rp "Chemin du projet sur le serveur distant [ex: ~/immovitrine] : " REMOTE_PATH
    REMOTE_PATH="${REMOTE_PATH:-~/immovitrine}"

    # Création de l'archive temporaire
    TMP_ARCHIVE="/tmp/immovitrine_transfer_$(date +'%Y%m%d_%H%M%S').tar.gz"
    echo -e "\n${BLUE}➔ 1. Création de l'archive de transfert...${RESET}"
    tar -czf "$TMP_ARCHIVE" data public/uploads .env 2>/dev/null || tar -czf "$TMP_ARCHIVE" data public/uploads

    echo -e "\n${BLUE}➔ 2. Envoi vers ${GOLD}${REMOTE_HOST}:${REMOTE_PATH}${BLUE}...${RESET}"
    ssh "$REMOTE_HOST" "mkdir -p $REMOTE_PATH"
    scp "$TMP_ARCHIVE" "${REMOTE_HOST}:${REMOTE_PATH}/migration_incoming.tar.gz"
    rm -f "$TMP_ARCHIVE"

    echo -e "\n${BLUE}➔ 3. Extraction et application sur le serveur distant...${RESET}"
    ssh "$REMOTE_HOST" "cd $REMOTE_PATH && tar -xzf migration_incoming.tar.gz && chmod -R 775 data public/uploads && rm -f migration_incoming.tar.gz"

    echo -e "${GREEN}${BOLD}✔ Transfert terminé ! Toutes les données ont été migrées sur ${REMOTE_HOST}.${RESET}"
    echo -e "Connectez-vous sur le nouveau serveur et lancez :"
    echo -e "  ${BOLD}ssh ${REMOTE_HOST}${RESET}"
    echo -e "  ${BOLD}cd ${REMOTE_PATH} && ./deploy.sh${RESET}"
    exit 0
fi

echo -e "${RED}Usage: $0 [export | import <fichier.tar.gz> | transfer]${RESET}"
exit 1

