import { Link } from 'react-router-dom';
import styles from './SectionHeader.module.css';

/** Заголовок секции главной: «Категории … Все». link — { to, label, onClick }. */
export default function SectionHeader({ title, link, id }) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
      {link && (
        <Link to={link.to} onClick={link.onClick} className={styles.link}>
          {link.label}
        </Link>
      )}
    </div>
  );
}
