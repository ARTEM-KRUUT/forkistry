import { useId } from 'react';
import styles from './Switch.module.css';

/** Переключатель «вкл/выкл» с подписью (Figma 12:636). Это <input type="checkbox" role="switch">. */
export default function Switch({ label, checked, onChange }) {
  const id = useId();
  return (
    <label htmlFor={id} className={styles.row}>
      <span>{label}</span>
      <input id={id} type="checkbox" role="switch" className={styles.input} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
