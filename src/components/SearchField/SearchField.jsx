import { Search, X } from 'lucide-react';
import styles from './SearchField.module.css';

/** Поле поиска с иконкой и кнопкой очистки. size: md — каталог (48), lg — главная (52). */
export default function SearchField({ value, onChange, placeholder, label = 'Поиск', size = 'md', ...rest }) {
  return (
    <div className={`${styles.field} ${styles[size]}`}>
      <Search size={20} strokeWidth={1.75} className={styles.icon} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        enterKeyHint="search"
        {...rest}
      />
      {value && (
        <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Очистить поиск">
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
