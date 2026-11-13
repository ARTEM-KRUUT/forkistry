/** 90 → «1 ч 30 мин», 45 → «45 мин», 120 → «2 ч». */
export function formatMinutes(total) {
  if (!Number.isFinite(total) || total <= 0) return '';
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (h && m) return `${h} ч ${m} мин`;
  if (h) return `${h} ч`;
  return `${m} мин`;
}

/** Калорийность; пусто, если не посчитана (продукта нет в справочнике). */
export function formatKcal(kcal) {
  return Number.isFinite(kcal) && kcal > 0 ? `${Math.round(kcal)} ккал` : '';
}

/** Доля лайков в процентах; null, если голосов нет. */
export function likePercent(likes = 0, dislikes = 0) {
  const total = likes + dislikes;
  return total > 0 ? Math.round((likes / total) * 100) : null;
}

/** «Анна Белова» → «АБ». */
export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** «Марина Котова» → «Марина К.» (подпись под аватаром). */
export function shortName(name = '') {
  const [first, last] = name.trim().split(/\s+/);
  return last ? `${first} ${last[0]}.` : first ?? '';
}

/** Склонение по числу: plural(5, ['рецепт', 'рецепта', 'рецептов']) → «рецептов». */
export function plural(n, [one, few, many]) {
  const n10 = Math.abs(n) % 10;
  const n100 = Math.abs(n) % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}

/** Число с пробелами между разрядами: 2840 → «2 840». */
export function formatCount(n = 0) {
  return n.toLocaleString('ru-RU');
}

/** Дата публикации: «15 сентября 2026». PocketBase отдаёт «2026-09-15 18:00:00.000Z». */
export function formatDate(value, { withYear = true } = {}) {
  if (!value) return '';
  const d = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', ...(withYear ? { year: 'numeric' } : null) }).replace(/\s*г\.$/, '').trim();
}

/** Для карточек: в этом году — «15 сентября», иначе «15 сент. 2025». */
export function formatShortDate(value, now = new Date()) {
  if (!value) return '';
  const d = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\s*г\.$/, '').trim();
}

/** 300 → «5 мин», 90 → «1 мин 30 с» — длительность таймера шага. */
export function formatTimer(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m && s) return `${m} мин ${s} с`;
  return m ? `${m} мин` : `${s} с`;
}
