import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, Heart, NotebookPen, ThumbsUp, UserX } from 'lucide-react';
import Avatar from '../../components/Avatar/Avatar.jsx';
import Chip from '../../components/Chip/Chip.jsx';
import HScroll from '../../components/HScroll/HScroll.jsx';
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx';
import RecipeCardSkeleton from '../../components/RecipeCard/RecipeCardSkeleton.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useGoBack } from '../../hooks/useGoBack.js';
import { getAuthor, getAuthorRecipes } from '../../api/recipes.js';
import { isNotFound } from '../../api/errors.js';
import { formatCount, plural } from '../../utils/format.js';
import styles from './AuthorPage.module.css';

const SORTS = [
  { id: 'popular', label: 'Популярные' },
  { id: 'new', label: 'Новые' },
  { id: 'fast', label: 'Быстрые' },
];

export default function AuthorPage() {
  const { id } = useParams();
  const goBack = useGoBack('/');
  const [sort, setSort] = useState('popular');
  const { isFavorite, toggleFavorite } = useFavorites();

  const author = useAsync(() => getAuthor(id), [id]);
  const recipes = useAsync(() => getAuthorRecipes(id, sort), [id, sort]);

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={goBack}>
        <ChevronLeft size={20} strokeWidth={1.75} aria-hidden="true" />
        Назад
      </button>

      {author.status === 'loading' && <AuthorSkeleton />}

      {author.status === 'error' &&
        (isNotFound(author.error) ? (
          <EmptyState icon={UserX} title="Автор не найден" text="Возможно, профиль удалён" action={{ label: 'На главную', to: '/' }} />
        ) : (
          <ErrorState onRetry={author.reload} />
        ))}

      {author.status === 'success' && (
        <>
          <section className={styles.profile}>
            <div className={styles.who}>
              <Avatar name={author.data.name} url={author.data.avatarUrl} size={72} tone="neutral" />
              <h1 className={styles.name}>{author.data.name}</h1>
            </div>
            <Stats stats={author.data.stats} />
            {author.data.bio && <p className={styles.bio}>{author.data.bio}</p>}
          </section>

          <HScroll label="Сортировка рецептов" className={styles.sorts}>
            {SORTS.map((s) => (
              <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}>
                {s.label}
              </Chip>
            ))}
          </HScroll>

          {recipes.status === 'loading' && (
            <div className={styles.list} aria-busy="true" aria-label="Загрузка рецептов">
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </div>
          )}
          {recipes.status === 'error' && <ErrorState onRetry={recipes.reload} />}
          {recipes.status === 'success' && recipes.data.length === 0 && (
            <EmptyState icon={NotebookPen} title="Рецептов пока нет" text="Автор ещё ничего не опубликовал" />
          )}
          {recipes.status === 'success' && recipes.data.length > 0 && (
            <ul className={styles.list}>
              {recipes.data.map((r) => (
                <li key={r.id}>
                  <RecipeCard recipe={r} isFavorite={isFavorite(r.id)} onToggleFavorite={toggleFavorite} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function Stats({ stats }) {
  const items = [
    { icon: BookOpen, value: stats.recipes, label: plural(stats.recipes, ['рецепт', 'рецепта', 'рецептов']), tone: '' },
    { icon: ThumbsUp, value: stats.likes, label: plural(stats.likes, ['лайк', 'лайка', 'лайков']), tone: styles.like },
    { icon: Heart, value: stats.favorites, label: 'в избранном', tone: styles.fav },
  ];
  return (
    <dl className={styles.stats}>
      {items.map(({ icon: Icon, value, label, tone }) => (
        <div key={label} className={styles.stat}>
          <dt className={styles.statLabel}>{label}</dt>
          <dd className={`${styles.statValue} ${tone}`}>
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
            {formatCount(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function AuthorSkeleton() {
  return (
    <div className={styles.profile} aria-busy="true" aria-label="Загрузка автора">
      <div className={styles.who}>
        <Skeleton width="72px" height="72px" radius="50%" />
        <Skeleton width="55%" height="24px" />
      </div>
      <Skeleton height="62px" radius="var(--radius-photo-sm)" />
      <Skeleton width="90%" height="40px" />
    </div>
  );
}
