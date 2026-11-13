/**
 * Безопасный адрес возврата после входа из location.state.from.
 * Пускаем только внутренние пути: «/recipe/1?x», но не «//evil.com», «/\evil.com» или «https://…».
 * (React Router 6 подвержен open redirect через обратный слэш — GHSA-wrjc-x8rr-h8h6.)
 */
export function safeRedirect(from, fallback = '/') {
  const path = typeof from === 'string' ? from : from ? `${from.pathname ?? ''}${from.search ?? ''}${from.hash ?? ''}` : '';
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return fallback;
  if (/^\/(login|register)\b/.test(path)) return fallback; // не возвращаем на сам вход
  return path;
}
