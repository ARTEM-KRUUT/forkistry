import styles from './Chip.module.css';

/** Чип-переключатель: категория, техника, сортировка. */
export default function Chip({ active = false, icon: Icon, onClick, children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : ''} ${className}`}
      aria-pressed={active}
      onClick={onClick}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
      {children}
    </button>
  );
}
