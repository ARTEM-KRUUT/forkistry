import { useId } from 'react';
import styles from './SegmentedControl.module.css';

/**
 * Сегмент-контрол (Figma 12:626): группа радиокнопок, выбранная — белая плашка с тенью.
 * Стрелки ←/→ переключают значение (поведение нативных radio).
 */
export default function SegmentedControl({ label, options, value, onChange, name, size = 'md' }) {
  const autoName = useId();
  return (
    <div className={`${styles.root} ${styles[size]}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.value} className={`${styles.item} ${value === o.value ? styles.active : ''}`}>
          <input
            type="radio"
            className={styles.input}
            name={name ?? autoName}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}
