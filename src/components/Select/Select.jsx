import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import inputStyles from '../Input/Input.module.css';
import styles from './Select.module.css';

/** Выпадающий список в стиле поля ввода (Figma 12:604). Нативный <select> — системный список на телефоне. */
export default function Select({ label, hideLabel = false, error, placeholder, options, value, onChange, onBlur, name, className = '' }) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className={`${inputStyles.wrapper} ${className}`}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : inputStyles.label}>
        {label}
      </label>
      <div className={styles.box}>
        <select
          id={id}
          name={name}
          className={`${inputStyles.field} ${styles.select} ${error ? inputStyles.invalid : ''} ${value ? '' : styles.placeholder}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} strokeWidth={2} className={styles.chevron} aria-hidden="true" />
      </div>
      {error && (
        <p id={msgId} className={inputStyles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
