import { useCallback, useEffect, useRef, useState } from 'react';

const initial = (steps) =>
  steps.map((s) => ({ duration: s.timerSeconds || 0, remaining: s.timerSeconds || 0, running: false, endAt: 0, done: false }));

/**
 * Таймеры всех шагов рецепта. У каждого шага свой таймер, они идут независимо
 * (можно запустить таймер следующего шага, пока идёт текущий — вариант Б).
 * Время считается от момента окончания (endAt), а не тиками — не отстаёт в фоне.
 * onFinish(index) вызывается один раз, когда таймер дошёл до нуля.
 */
export function useStepTimers(steps, onFinish) {
  const [timers, setTimers] = useState(() => initial(steps));
  const notified = useRef(new Set());
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const anyRunning = timers.some((t) => t.running);

  useEffect(() => {
    if (!anyRunning) return undefined;
    const tick = () => {
      const now = Date.now();
      setTimers((ts) => {
        let changed = false;
        const next = ts.map((t) => {
          if (!t.running) return t;
          const remaining = Math.max(0, Math.ceil((t.endAt - now) / 1000));
          if (remaining === t.remaining && remaining > 0) return t;
          changed = true;
          return remaining === 0 ? { ...t, remaining: 0, running: false, done: true } : { ...t, remaining };
        });
        return changed ? next : ts;
      });
    };
    const id = setInterval(tick, 250);
    // Вкладка вернулась из фона — сразу пересчитываем
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [anyRunning]);

  // Сигнал — один раз на каждое окончание (не внутри setState: StrictMode вызывает его дважды)
  useEffect(() => {
    timers.forEach((t, i) => {
      if (t.done && !notified.current.has(i)) {
        notified.current.add(i);
        onFinishRef.current?.(i);
      }
    });
  }, [timers]);

  const update = useCallback((i, fn) => setTimers((ts) => ts.map((t, idx) => (idx === i ? fn(t) : t))), []);

  const start = useCallback(
    (i) => {
      notified.current.delete(i);
      update(i, (t) => {
        const remaining = t.remaining > 0 ? t.remaining : t.duration;
        return { ...t, remaining, running: true, done: false, endAt: Date.now() + remaining * 1000 };
      });
    },
    [update],
  );

  const pause = useCallback(
    (i) => update(i, (t) => (t.running ? { ...t, running: false, remaining: Math.max(0, Math.ceil((t.endAt - Date.now()) / 1000)) } : t)),
    [update],
  );

  /** «Сброс»: снова полное время; если таймер шёл — продолжает идти с начала. */
  const reset = useCallback(
    (i) => {
      notified.current.delete(i);
      update(i, (t) => ({ ...t, remaining: t.duration, done: false, endAt: t.running ? Date.now() + t.duration * 1000 : 0 }));
    },
    [update],
  );

  /** «Стоп»: остановить и вернуть полное время. */
  const stop = useCallback(
    (i) => {
      notified.current.delete(i);
      update(i, (t) => ({ ...t, remaining: t.duration, running: false, done: false, endAt: 0 }));
    },
    [update],
  );

  const toggle = useCallback((i) => (timers[i]?.running ? pause(i) : start(i)), [timers, pause, start]);

  return { timers, anyRunning, start, pause, reset, stop, toggle };
}

/** 1536 → «25:36», 3725 → «1:02:05». */
export function formatClock(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0');
  return h ? `${h}:${mm}:${String(s).padStart(2, '0')}` : `${mm}:${String(s).padStart(2, '0')}`;
}
