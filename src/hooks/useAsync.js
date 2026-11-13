import { useCallback, useEffect, useState } from 'react';

/**
 * Асинхронная загрузка с состояниями loading / error / success.
 * Пустое состояние экран определяет сам по данным (пустой список и т. п.).
 * reload() повторяет запрос — для кнопки «Повторить».
 * Ответ устаревшего запроса (сменились deps) игнорируется.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, status: 'loading', error: null }));
    fn()
      .then((data) => active && setState({ status: 'success', data, error: null }))
      .catch((error) => active && setState({ status: 'error', data: null, error }));
    return () => {
      active = false;
    };
    // fn пересоздаётся каждый рендер; зависимости запроса передаются явно в deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
