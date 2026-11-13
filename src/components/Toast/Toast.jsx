import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

/** Короткое уведомление внизу экрана («Ссылка скопирована»). Само скрывается через duration мс. */
export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  return createPortal(
    <div className={styles.region} role="status" aria-live="polite">
      {message && <div className={styles.toast}>{message}</div>}
    </div>,
    document.body,
  );
}
