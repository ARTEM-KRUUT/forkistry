import styles from './HScroll.module.css';

/** Горизонтальная лента с прокруткой: начинается от поля экрана и уходит за край. */
export default function HScroll({ children, gap = 'var(--space-2)', label, as: Tag = 'div', className = '' }) {
  return (
    <Tag className={`${styles.scroll} ${className}`} style={{ gap }} aria-label={label} role={label ? 'group' : undefined}>
      {children}
    </Tag>
  );
}
