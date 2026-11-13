import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import IconButton from '../IconButton/IconButton.jsx';
import styles from './BottomSheet.module.css';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Выдвижная панель снизу (Figma 8:249): затемнение, ручка, заголовок, крестик.
 * Модальный диалог: Esc и клик по фону закрывают, Tab не выходит за панель,
 * после закрытия фокус возвращается туда, откуда панель открыли.
 * returnFocusRef — явная кнопка для возврата фокуса (Safari не фокусирует кнопку при клике).
 */
export default function BottomSheet({ open, onClose, title, children, footer, returnFocusRef }) {
  const sheetRef = useRef(null);
  const titleId = useId();
  // Последний onClose без перезапуска эффекта: иначе при каждом рендере родителя фокус прыгал бы
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const close = () => onCloseRef.current();
    const opener = returnFocusRef?.current ?? document.activeElement;
    const sheet = sheetRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    sheet?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !sheet) return;
      const items = [...sheet.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
    // returnFocusRef — объект ref, стабилен между рендерами
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div ref={sheetRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon={X} label="Закрыть" variant="soft" size={36} onClick={onClose} />
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
