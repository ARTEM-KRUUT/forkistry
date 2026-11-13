import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import BottomNav from '../BottomNav/BottomNav.jsx';
import styles from './Layout.module.css';

/**
 * Оболочка экранов. Видимость шапки и нижней панели задаётся на уровне группы маршрутов в App.jsx.
 * headerOnDesktop — шапка только на широком экране (страница рецепта: на телефоне её заменяет фото).
 */
export default function Layout({ showHeader = true, showBottomNav = true, headerOnDesktop = false }) {
  const { pathname } = useLocation();

  // При переходе на новый экран — наверх страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.root}>
      <a href="#main" className={styles.skip}>
        Перейти к содержимому
      </a>
      {showHeader && <Header />}
      {!showHeader && headerOnDesktop && <Header desktopOnly />}
      <main id="main" className={`${styles.main} ${showBottomNav ? styles.withNav : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
