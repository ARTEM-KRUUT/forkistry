import { Link } from 'react-router-dom';
import styles from './CategoryTile.module.css';

/**
 * Плитка категории (Figma 15:625): пастельный квадрат (позже — картинка) и подпись.
 * С `to` — ссылка (главная → каталог), с `onClick` — переключатель (фильтр).
 */
export default function CategoryTile({ label, color, imageUrl, selected = false, to, onClick }) {
  const cls = `${styles.tile} ${selected ? styles.selected : ''}`;
  const content = (
    <>
      <span className={styles.image} style={{ background: color }}>
        {imageUrl && <img src={imageUrl} alt="" className={styles.img} />}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} aria-pressed={selected} onClick={onClick}>
      {content}
    </button>
  );
}
