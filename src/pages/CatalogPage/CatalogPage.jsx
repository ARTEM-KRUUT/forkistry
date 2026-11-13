import { useEffect, useRef, useState } from 'react';
import { SearchX } from 'lucide-react';
import SearchField from '../../components/SearchField/SearchField.jsx';
import FilterButton from '../../components/FilterButton/FilterButton.jsx';
import FilterSheet from '../../components/FilterSheet/FilterSheet.jsx';
import SortSelect from '../../components/SortSelect/SortSelect.jsx';
import HScroll from '../../components/HScroll/HScroll.jsx';
import Chip from '../../components/Chip/Chip.jsx';
import RecipeCard from '../../components/RecipeCard/RecipeCard.jsx';
import RecipeCardSkeleton from '../../components/RecipeCard/RecipeCardSkeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useFilters } from '../../context/FiltersContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getRecipes } from '../../api/recipes.js';
import { CATEGORIES } from '../../data/constants.js';
import { countActiveFilters, describeFilters } from '../../utils/filters.js';
import { plural } from '../../utils/format.js';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  const { filters, setFilters, resetFilters } = useFilters();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState(filters.search);
  const filterButtonRef = useRef(null);

  // Поиск применяется с небольшой задержкой, чтобы не дёргать API на каждую букву
  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== filters.search) setFilters({ search: query });
    }, 300);
    return () => clearTimeout(t);
  }, [query, filters.search, setFilters]);

  const { status, data, reload } = useAsync(() => getRecipes(filters), [filters]);

  const activeCount = countActiveFilters(filters);
  const summary = describeFilters(filters);
  const hasAnyFilter = activeCount > 0 || filters.category || filters.search;
  const total = data?.total ?? 0;

  const resetAll = () => {
    setQuery('');
    resetFilters();
    setFilters({ search: '' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Рецепты</h1>
          <p className={styles.count} aria-live="polite">
            {status === 'success' && `${total} ${plural(total, ['рецепт', 'рецепта', 'рецептов'])}`}
          </p>
        </div>
        <div className={styles.searchRow}>
          <SearchField value={query} onChange={setQuery} placeholder="Поиск по названию" label="Поиск рецептов" />
          <FilterButton ref={filterButtonRef} count={activeCount} onClick={() => setSheetOpen(true)} />
        </div>
      </div>

      <HScroll label="Категории" className={styles.categories}>
        <Chip active={!filters.category} onClick={() => setFilters({ category: null })}>
          Все
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={filters.category === c.id} onClick={() => setFilters({ category: filters.category === c.id ? null : c.id })}>
            {c.id}
          </Chip>
        ))}
      </HScroll>

      <div className={styles.controls}>
        {summary && (
          <div className={styles.summary}>
            <span>{summary}</span>
            <button type="button" className={styles.resetLink} onClick={resetFilters}>
              Сбросить
            </button>
          </div>
        )}
        <SortSelect value={filters.sort} onChange={(sort) => setFilters({ sort })} />
      </div>

      {status === 'loading' && (
        <div className={styles.list} aria-busy="true" aria-label="Загрузка рецептов">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      )}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'success' && total === 0 && (
        <EmptyState
          icon={SearchX}
          title="Ничего не нашлось"
          text={hasAnyFilter ? 'Под выбранные условия нет рецептов. Попробуйте убрать часть фильтров' : 'Рецептов пока нет'}
          action={hasAnyFilter ? { label: 'Сбросить фильтры', onClick: resetAll } : undefined}
        />
      )}

      {status === 'success' && total > 0 && (
        <ul className={styles.list}>
          {data.items.map((recipe) => (
            <li key={recipe.id}>
              <RecipeCard recipe={recipe} isFavorite={isFavorite(recipe.id)} onToggleFavorite={toggleFavorite} />
            </li>
          ))}
        </ul>
      )}

      <FilterSheet
        open={sheetOpen}
        filters={filters}
        returnFocusRef={filterButtonRef}
        onClose={() => setSheetOpen(false)}
        onApply={(draft) => {
          setFilters(draft);
          setSheetOpen(false);
        }}
      />
    </div>
  );
}
