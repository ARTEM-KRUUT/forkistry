import { useEffect } from 'react';

/** Не даёт экрану погаснуть, пока открыт режим готовки (Screen Wake Lock API, где поддерживается). */
export function useWakeLock(enabled = true) {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return undefined;
    let lock = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
      } catch {
        // отказ браузера (энергосбережение, нет жеста) — не критично
      }
      if (cancelled) lock?.release().catch(() => {});
    };
    const onVisible = () => document.visibilityState === 'visible' && acquire();
    acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      lock?.release().catch(() => {});
    };
  }, [enabled]);
}
