import { Link, NavLink } from 'react-router-dom';
import { Plus, UserRound } from 'lucide-react';
import Logo from '../Logo/Logo.jsx';
import Avatar from '../Avatar/Avatar.jsx';
import { NAV_ITEMS } from '../BottomNav/BottomNav.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Header.module.css';

/**
 * Шапка (Figma 6:22): варианты «Гость» и «Авторизован».
 * На десктопе (≥1024) в шапку переезжает основная навигация, нижняя панель скрывается.
 * Гостя «+ Рецепт» и профиль ведут на вход (маршруты защищены RequireAuth).
 */
export default function Header({ desktopOnly = false }) {
  const { user } = useAuth();

  return (
    <header className={`${styles.header} ${desktopOnly ? styles.desktopOnly : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logoLink} aria-label="Forkistry, на главную">
          <Logo />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navActive : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/recipe/new" className={styles.addButton}>
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Рецепт
          </Link>
          <Link to="/profile" className={`${styles.profile} ${user ? styles.profileUser : ''}`} aria-label={user ? `Профиль: ${user.name}` : 'Профиль'}>
            {user ? <Avatar name={user.name} url={user.avatarUrl} size={40} /> : <UserRound size={20} strokeWidth={1.75} aria-hidden="true" />}
          </Link>
        </div>
      </div>
    </header>
  );
}
