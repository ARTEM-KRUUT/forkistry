#!/usr/bin/env bash
# Выкладка Forkistry на VPS: npm run deploy
# 1) тесты и production-сборка; 2) dist/, pb_migrations/, pb_hooks/ одним архивом по SSH в /opt/forkistry;
# 3) резервная копия базы, перезапуск PocketBase (новые миграции применяются при старте), проверка здоровья.
# На сервере работает VPN — nginx и чужие сервисы скрипт не трогает (см. CLAUDE.md → «Сервер и публикация»).
set -euo pipefail

HOST="${DEPLOY_HOST:-root@147.45.50.28}"
PORT="${DEPLOY_PORT:-10023}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/forkistry_vps}"
DOMAIN="${DEPLOY_DOMAIN:-forkistry.albania2win.ru}"
SSH=(ssh -i "$KEY" -p "$PORT" -o BatchMode=yes "$HOST")

cd "$(dirname "$0")/.."

echo "→ Тесты"
npm test --silent

echo "→ Сборка"
npm run build --silent

echo "→ Загрузка на $HOST"
# Сначала архив во временный файл (stdin ssh занят архивом), затем отдельной командой — скрипт выкладки
tar czf - dist pb_migrations pb_hooks | "${SSH[@]}" "cat > /tmp/forkistry-release.tgz"

echo "→ Выкладка"
"${SSH[@]}" "DOMAIN=$DOMAIN bash -s" <<'REMOTE'
set -euo pipefail
cd /opt/forkistry
ts=$(date +%Y%m%d-%H%M%S)
rm -rf release.new
mkdir -p backups release.new
tar xzf /tmp/forkistry-release.tgz -C release.new
rm -f /tmp/forkistry-release.tgz

systemctl stop forkistry-pocketbase
tar czf "backups/pb_data-$ts.tar.gz" pb_data
ls -1t backups/pb_data-*.tar.gz | tail -n +6 | xargs -r rm -f   # храним 5 последних копий

rm -rf dist.old pb_migrations.old pb_hooks.old
[ -d dist ] && mv dist dist.old
[ -d pb_migrations ] && mv pb_migrations pb_migrations.old
[ -d pb_hooks ] && mv pb_hooks pb_hooks.old
mv release.new/dist release.new/pb_migrations release.new/pb_hooks .
rmdir release.new
chown -R forkistry:forkistry /opt/forkistry

systemctl start forkistry-pocketbase
for i in $(seq 1 20); do curl -fsS http://127.0.0.1:8090/api/health >/dev/null 2>&1 && break; sleep 0.5; done
systemctl is-active forkistry-pocketbase

echo "API:   $(curl -fsS --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/api/health")"
echo "Сайт:  $(curl -s -o /dev/null -w '%{http_code}' --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/recipes")"
echo "Рецептов: $(curl -fsS --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/api/collections/recipes/records?perPage=1&fields=id" | grep -o '"totalItems":[0-9]*')"
echo "VPN-маскировка: $(curl -s -o /dev/null -w '%{http_code}' --resolve node-alb.bestkruutmaps.com:443:127.0.0.1 https://node-alb.bestkruutmaps.com/)"
REMOTE

echo "✓ Готово: https://$DOMAIN"
