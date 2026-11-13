// Локальный PocketBase для разработки и тестов: npm run pb
// Бинарник кладётся в .pocketbase/ (не в git): https://github.com/pocketbase/pocketbase/releases (v0.40.6)
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = path.join(root, '.pocketbase', process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase');

if (!existsSync(bin)) {
  console.error(`Нет ${bin}\nСкачайте PocketBase 0.40.6 для своей ОС и распакуйте в .pocketbase/`);
  process.exit(1);
}

const args = [
  'serve',
  '--http=127.0.0.1:8090',
  `--dir=${path.join(root, '.pocketbase', 'pb_data')}`,
  `--migrationsDir=${path.join(root, 'pb_migrations')}`,
  `--hooksDir=${path.join(root, 'pb_hooks')}`,
  ...process.argv.slice(2),
];

spawn(bin, args, { stdio: 'inherit' }).on('exit', (code) => process.exit(code ?? 0));
