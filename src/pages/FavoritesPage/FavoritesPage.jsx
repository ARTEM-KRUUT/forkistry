import { Heart, HeartOff } from 'lucide-react';
import RecipeCardSmall from '../../components/RecipeCardSmall/RecipeCardSmall.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { plural } from '../../utils/format.js';
import styles from './FavoritesPage.module.css';

/** Избранное (Figma 10:399), для гостя — приглашение войти (Figma 10:456). */
export default function FavoritesPage() {
  const { isAuthed } = useAuth();
  const { status, items, reload } = useFavorites();
  const count = items.length;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>Избранное</h1>
        {isAuthed && status === 'success' && count > 0 && (
          <p className={styles.count}>
            {count} {plural(count, ['сохранённый рецепт', 'сохранённых рецепта', 'сохранённых рецептов'])}
          </p>
        )}
      </div>

      {!isAuthed && (
        <div className={styles.center}>
          <EmptyState
            icon={Heart}
            title="Здесь будут сохранённые рецепты"
            text="Войдите в профиль, чтобы сохранять рецепты и возвращаться к ним с любого устройства"
            action={{ label: 'Войти', to: '/login', state: { from: { pathname: '/favorites' } } }}
            secondaryAction={{ label: 'Перейти в каталог', to: '/recipes' }}
          />
        </div>
      )}

      {isAuthed && status === 'loading' && (
        <div className={styles.grid} aria-busy="true" aria-label="Загрузка избранного">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton}>
              <Skeleton height="auto" className={styles.skeletonPhoto} radius="var(--radius-photo-sm)" />
              <Skeleton width="85%" height="18px" />
              <Skeleton width="55%" height="14px" />
            </div>
          ))}
        </div>
      )}

      {isAuthed && status === 'error' && <ErrorState onRetry={reload} />}

      {isAuthed && status === 'success' && count === 0 && (
        <div className={styles.center}>
          <EmptyState
            icon={HeartOff}
            title="Пока ничего не сохранено"
            text="Нажмите на сердечко у рецепта, и он появится здесь"
            action={{ label: 'Перейти в каталог', to: '/recipes' }}
          />
        </div>
      )}

      {isAuthed && status === 'success' && count > 0 && (
        <ul className={styles.grid}>
          {items.map((f) => (
            <li key={f.id}>
              <RecipeCardSmall recipe={f.recipe} fluid />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
