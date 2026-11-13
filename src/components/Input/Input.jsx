import { useId } from 'react';
import styles from './Input.module.css';

/**
 * Поле формы с подписью, подсказкой и ошибкой под полем.
 * multiline — textarea; остальные props уходят в сам элемент ввода.
 */
export default function Input({ label, hideLabel = false, error, hint, multiline = false, id, className = '', ...rest }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-msg`;
  const message = error || hint;
  const Field = multiline ? 'textarea' : 'input';

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={hideLabel ? 'visually-hidden' : styles.label}>
          {label}
        </label>
      )}
      <Field
        id={inputId}
        className={`${styles.field} ${multiline ? styles.multiline : ''} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
