import { NavLink } from 'react-router-dom';
import { House, BookOpen, Heart } from 'lucide-react';
import styles from './BottomNav.module.css';

export const NAV_ITEMS = [
  { to: '/', label: 'Главная', Icon: House, end: true },
  { to: '/recipes', label: 'Рецепты', Icon: BookOpen },
  { to: '/favorites', label: 'Избранное', Icon: Heart },
];

/** Нижняя панель (Figma 6:68). На десктопе (≥1024) скрыта — навигация в шапке. */
export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Основная навигация">
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
