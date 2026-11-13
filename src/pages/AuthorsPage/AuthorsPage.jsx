import { Users } from 'lucide-react';
import AuthorRow from '../../components/AuthorRow/AuthorRow.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getPopularAuthors } from '../../api/recipes.js';
import { POPULAR_AUTHOR_MIN_LIKES } from '../../data/constants.js';
import { plural } from '../../utils/format.js';
import styles from './AuthorsPage.module.css';

/** Популярные авторы: у кого рецепты набрали в сумме от 3 лайков. */
export default function AuthorsPage() {
  const { status, data, reload } = useAsync(() => getPopularAuthors(), []);
  const min = POPULAR_AUTHOR_MIN_LIKES;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>Популярные авторы</h1>
        <p className={styles.hint}>
          Авторы, чьи рецепты набрали от {min} {plural(min, ['лайка', 'лайков', 'лайков'])}. Чем больше лайков, тем выше в списке
        </p>
      </div>

      {status === 'loading' && (
        <div className={styles.list} aria-busy="true" aria-label="Загрузка авторов">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="150px" radius="var(--radius-card)" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'success' && data.length === 0 && (
        <EmptyState
          icon={Users}
          title="Популярных авторов пока нет"
          text={`Автор появится здесь, когда его рецепты наберут ${min} ${plural(min, ['лайк', 'лайка', 'лайков'])}`}
          action={{ label: 'Перейти в каталог', to: '/recipes' }}
        />
      )}

      {status === 'success' && data.length > 0 && (
        <ol className={styles.list}>
          {data.map((a, i) => (
            <AuthorRow key={a.id} author={a} place={i + 1} />
          ))}
        </ol>
      )}
    </div>
  );
}
