import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookingPot } from 'lucide-react';
import SearchField from '../../components/SearchField/SearchField.jsx';
import KitchenPanel from '../../components/KitchenPanel/KitchenPanel.jsx';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import HScroll from '../../components/HScroll/HScroll.jsx';
import CategoryTile from '../../components/CategoryTile/CategoryTile.jsx';
import RecipeCardSmall from '../../components/RecipeCardSmall/RecipeCardSmall.jsx';
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx';
import AuthorTile from '../../components/AuthorTile/AuthorTile.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import RecipeCardSkeleton from '../../components/RecipeCard/RecipeCardSkeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useFilters } from '../../context/FiltersContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getPopularAuthors, getRecipes } from '../../api/recipes.js';
import { CATEGORIES } from '../../data/constants.js';
import styles from './HomePage.module.css';

// Перед переходом в каталог из секции главной оставляем только технику кухни
const ONLY_KITCHEN = { search: '', category: null, time: null, difficulty: [], kcal: null };

export default function HomePage() {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const { equipment } = filters;
  const hasKitchen = equipment.length > 0;

  // Три запроса параллельно; при смене техники секции перезагружаются
  const { status, data, reload } = useAsync(
    () =>
      Promise.all([
        getRecipes({ equipment }, { limit: 8 }),
        getRecipes({ equipment, time: '30' }, { limit: 2 }),
        getPopularAuthors({ limit: 10 }),
      ]).then(([forKitchen, quick, authors]) => ({ forKitchen, quick, authors })),
    [equipment.join('|')],
  );

  const onSearch = (e) => {
    e.preventDefault();
    setFilters({ ...ONLY_KITCHEN, search: query.trim() });
    navigate('/recipes');
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Что приготовим сегодня?</h1>
        <form role="search" onSubmit={onSearch}>
          <SearchField value={query} onChange={setQuery} placeholder="Блюдо или продукт" label="Поиск рецептов" size="lg" />
        </form>
      </section>

      <div className={styles.gutter}>
        <KitchenPanel />
      </div>

      <section className={styles.section} aria-labelledby="home-categories">
        <SectionHeader id="home-categories" title="Категории" link={{ to: '/recipes', label: 'Все', onClick: () => setFilters(ONLY_KITCHEN) }} />
        <HScroll gap="var(--space-2-5)">
          {CATEGORIES.map((c) => (
            <CategoryTile
              key={c.id}
              label={c.id}
              color={c.color}
              imageUrl={c.image}
              to="/recipes"
              onClick={() => setFilters({ ...ONLY_KITCHEN, category: c.id })}
            />
          ))}
        </HScroll>
      </section>

      {status === 'loading' && <HomeSkeleton />}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'success' && data.forKitchen.total === 0 && (
        <EmptyState
          icon={CookingPot}
          title={hasKitchen ? 'С такой техникой рецептов пока нет' : 'Рецептов пока нет'}
          text={hasKitchen ? 'Отметьте ещё что-нибудь из техники или снимите выбор' : 'Добавьте первый рецепт, и он появится здесь'}
          action={
            hasKitchen
              ? { label: 'Снять выбор техники', onClick: () => setFilters({ equipment: [] }) }
              : { label: 'Добавить рецепт', to: '/recipe/new' }
          }
        />
      )}

      {status === 'success' && data.forKitchen.total > 0 && (
        <>
          <section className={styles.section} aria-labelledby="home-kitchen">
            <SectionHeader
              id="home-kitchen"
              title={hasKitchen ? 'Под вашу технику' : 'Популярное'}
              link={{ to: '/recipes', label: `Все ${data.forKitchen.total}`, onClick: () => setFilters(ONLY_KITCHEN) }}
            />
            <HScroll as="ul" gap="var(--space-3)">
              {data.forKitchen.items.map((r) => (
                <li key={r.id}>
                  <RecipeCardSmall recipe={r} />
                </li>
              ))}
            </HScroll>
          </section>

          {data.quick.total > 0 && (
            <section className={styles.section} aria-labelledby="home-quick">
              <SectionHeader
                id="home-quick"
                title="Быстро, до 30 минут"
                link={{ to: '/recipes', label: 'Все', onClick: () => setFilters({ ...ONLY_KITCHEN, time: '30' }) }}
              />
              <ul className={styles.cards}>
                {data.quick.items.map((r) => (
                  <li key={r.id}>
                    <RecipeCard recipe={r} isFavorite={isFavorite(r.id)} onToggleFavorite={toggleFavorite} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.authors.length > 0 && (
            <section className={`${styles.section} ${styles.authors}`} aria-labelledby="home-authors">
              <SectionHeader id="home-authors" title="Популярные авторы" link={{ to: '/authors', label: 'Все' }} />
              <ul className={styles.authorList}>
                {data.authors.map((a) => (
                  <li key={a.id}>
                    <AuthorTile author={a} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Загрузка подборок">
      <section className={styles.section}>
        <div className={styles.gutter}>
          <Skeleton width="55%" height="22px" />
        </div>
        <HScroll gap="var(--space-3)">
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.smallSkeleton}>
              <Skeleton height="var(--card-small-photo-h)" radius="var(--radius-photo-sm)" />
              <Skeleton width="85%" height="18px" />
              <Skeleton width="50%" height="14px" />
            </div>
          ))}
        </HScroll>
      </section>
      <section className={styles.section}>
        <div className={styles.gutter}>
          <Skeleton width="65%" height="22px" />
        </div>
        <div className={styles.cards}>
          <RecipeCardSkeleton />
        </div>
      </section>
    </div>
  );
}
