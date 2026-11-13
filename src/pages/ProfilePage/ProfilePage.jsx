import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, LogOut, NotebookPen } from 'lucide-react';
import Avatar from '../../components/Avatar/Avatar.jsx';
import Button from '../../components/Button/Button.jsx';
import MyRecipeRow from '../../components/MyRecipeRow/MyRecipeRow.jsx';
import ProfileEditSheet from '../../components/ProfileEditSheet/ProfileEditSheet.jsx';
import DeleteRecipeDialog from '../../components/DeleteRecipeDialog/DeleteRecipeDialog.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getAuthor, getAuthorRecipes } from '../../api/recipes.js';
import { formatCount, plural } from '../../utils/format.js';
import styles from './ProfilePage.module.css';

/** Профиль (Figma 10:495). Доступен только после входа — маршрут обёрнут в RequireAuth. */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const { status, data, reload } = useAsync(
    () => Promise.all([getAuthor(user.id), getAuthorRecipes(user.id, 'new')]).then(([author, recipes]) => ({ stats: author.stats, recipes })),
    [user.id],
  );

  // RequireAuth сам уведёт на главную после явного выхода
  const onLogout = logout;

  const stats = data?.stats;

  return (
    <div className={styles.page}>
      <section className={styles.profile}>
        <button type="button" className={styles.avatar} onClick={() => setEditOpen(true)} aria-label="Сменить фото профиля">
          <Avatar name={user.name} url={user.avatarUrl} size={96} />
          <span className={styles.camera} aria-hidden="true">
            <Camera size={16} strokeWidth={2} />
          </span>
        </button>
        <div className={styles.who}>
          <h1 className={styles.name}>{user.name || 'Без имени'}</h1>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
        </div>

        <dl className={styles.stats} aria-busy={status === 'loading'}>
          {[
            [stats?.recipes, ['рецепт', 'рецепта', 'рецептов']],
            [stats?.likes, ['лайк', 'лайка', 'лайков']],
            [stats?.favorites, null],
          ].map(([value, forms], i) => (
            <div key={i} className={styles.stat}>
              <dt className={styles.statLabel}>{forms ? plural(value ?? 0, forms) : 'в избранном'}</dt>
              <dd className={styles.statValue}>{status === 'success' ? formatCount(value) : '—'}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.buttons}>
          <Button variant="secondary" fullWidth onClick={() => setEditOpen(true)}>
            Изменить профиль
          </Button>
          <button type="button" className={styles.logout} onClick={onLogout} aria-label="Выйти из профиля">
            <LogOut size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className={styles.mine} aria-labelledby="my-recipes">
        <div className={styles.mineHead}>
          <h2 id="my-recipes" className={styles.h2}>
            Мои рецепты
          </h2>
          <Link to="/recipe/new" className={styles.add}>
            Добавить
          </Link>
        </div>

        {status === 'loading' && (
          <div aria-busy="true" aria-label="Загрузка рецептов">
            {[1, 2].map((i) => (
              <div key={i} className={styles.rowSkeleton}>
                <Skeleton width="72px" height="72px" radius="var(--radius-tile-img)" />
                <div className={styles.rowSkeletonText}>
                  <Skeleton width="70%" height="18px" />
                  <Skeleton width="40%" height="14px" />
                </div>
              </div>
            ))}
          </div>
        )}
        {status === 'error' && <ErrorState onRetry={reload} />}
        {status === 'success' && data.recipes.length === 0 && (
          <EmptyState
            icon={NotebookPen}
            title="Вы ещё ничего не опубликовали"
            text="Добавьте семейный рецепт — он появится здесь и в общем каталоге"
            action={{ label: 'Добавить рецепт', to: '/recipe/new' }}
          />
        )}
        {status === 'success' && data.recipes.length > 0 && (
          <ul className={styles.list}>
            {data.recipes.map((r) => (
              <MyRecipeRow key={r.id} recipe={r} onDelete={setToDelete} />
            ))}
          </ul>
        )}
      </section>

      <ProfileEditSheet open={editOpen} onClose={() => setEditOpen(false)} />

      <DeleteRecipeDialog
        recipe={toDelete}
        onClose={() => setToDelete(null)}
        onDeleted={() => {
          setToDelete(null);
          reload();
        }}
      />
    </div>
  );
}
