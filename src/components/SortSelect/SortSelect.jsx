import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../data/constants.js';
import styles from './SortSelect.module.css';

/**
 * «Сначала популярные ▾» (Figma 7:191). Под текстом — нативный <select>:
 * на телефоне открывается системный список, работает с клавиатуры и экранными дикторами.
 */
export default function SortSelect({ value, onChange, options = SORT_OPTIONS }) {
  const id = useId();
  const current = options.find((o) => o.id === value) ?? options[0];

  return (
    <div className={styles.root}>
      <label htmlFor={id} className="visually-hidden">
        Сортировка
      </label>
      <span className={styles.label} aria-hidden="true">
        {current.label}
        <ChevronDown size={16} strokeWidth={2} />
      </span>
      <select id={id} className={styles.select} value={current.id} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
