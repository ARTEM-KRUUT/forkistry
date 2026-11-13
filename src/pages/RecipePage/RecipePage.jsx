import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, Pencil, SearchX, Share2, Trash2 } from 'lucide-react';
import Photo from '../../components/Photo/Photo.jsx';
import IconButton from '../../components/IconButton/IconButton.jsx';
import RecipeParams from '../../components/RecipeParams/RecipeParams.jsx';
import EquipmentTags from '../../components/EquipmentTags/EquipmentTags.jsx';
import VoteButtons from '../../components/VoteButtons/VoteButtons.jsx';
import ServingsStepper from '../../components/ServingsStepper/ServingsStepper.jsx';
import IngredientList from '../../components/IngredientList/IngredientList.jsx';
import StepList from '../../components/StepList/StepList.jsx';
import Button from '../../components/Button/Button.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import DeleteRecipeDialog from '../../components/DeleteRecipeDialog/DeleteRecipeDialog.jsx';
import Toast from '../../components/Toast/Toast.jsx';
import { useAuth, useRequireAuth } from '../../context/AuthContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useGoBack } from '../../hooks/useGoBack.js';
import { getRecipe } from '../../api/recipes.js';
import { castVote, getMyVote } from '../../api/votes.js';
import { isNotFound } from '../../api/errors.js';
import { calcNutrition } from '../../utils/recipe.js';
import { formatCount, formatDate } from '../../utils/format.js';
import styles from './RecipePage.module.css';

export default function RecipePage() {
  const { id } = useParams();
  const goBack = useGoBack();
  const { status, data: recipe, error, reload } = useAsync(() => getRecipe(id), [id]);

  if (status === 'loading') return <RecipeSkeleton onBack={goBack} />;

  if (status === 'error') {
    return (
      <div className={styles.page}>
        <div className={styles.bar}>
          <IconButton icon={ChevronLeft} label="Назад" variant="soft" onClick={goBack} />
        </div>
        {isNotFound(error) ? (
          <EmptyState
            icon={SearchX}
            title="Рецепт не найден"
            text="Возможно, автор удалил его или ссылка с ошибкой"
            action={{ label: 'Перейти в каталог', to: '/recipes' }}
          />
        ) : (
          <ErrorState onRetry={reload} />
        )}
      </div>
    );
  }

  return <RecipeView key={recipe.id} recipe={recipe} onBack={goBack} />;
}

/** Голос текущего пользователя с оптимистичным обновлением счётчиков. */
function useVote(recipe) {
  const { user } = useAuth();
  const requireAuth = useRequireAuth();
  const [vote, setVote] = useState({ initial: 0, current: null, loaded: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setVote({ initial: 0, current: null, loaded: true });
      return undefined;
    }
    let active = true;
    getMyVote(user.id, recipe.id)
      .then((v) => active && setVote({ initial: v?.value ?? 0, current: v, loaded: true }))
      .catch(() => active && setVote({ initial: 0, current: null, loaded: true }));
    return () => {
      active = false;
    };
  }, [user, recipe.id]);

  const my = vote.current?.value ?? 0;
  // Счётчики с сервера уже учитывают начальный голос, поэтому прибавляем только разницу
  const likes = recipe.likes + (my === 1) - (vote.initial === 1);
  const dislikes = recipe.dislikes + (my === -1) - (vote.initial === -1);

  const cast = useCallback(
    async (value) => {
      if (!requireAuth({ type: 'vote', value })) return null;
      if (busy || !vote.loaded) return null;
      const prev = vote.current;
      const optimistic = prev?.value === value ? null : { id: prev?.id ?? 'pending', value };
      setVote((v) => ({ ...v, current: optimistic }));
      setBusy(true);
      try {
        const next = await castVote(prev, user.id, recipe.id, value);
        setVote((v) => ({ ...v, current: next }));
        return null;
      } catch {
        setVote((v) => ({ ...v, current: prev }));
        return 'Не удалось сохранить оценку';
      } finally {
        setBusy(false);
      }
    },
    [requireAuth, busy, vote, user, recipe.id],
  );

  return { my, likes, dislikes, cast, loaded: vote.loaded };
}

function RecipeView({ recipe, onBack }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, status: favStatus } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const [servings, setServings] = useState(recipe.servings ?? 1);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const vote = useVote(recipe);

  const isAuthor = user && recipe.author?.id === user.id;
  const hasServings = Boolean(recipe.servings);
  const factor = hasServings ? servings / recipe.servings : 1;
  // Считаем по ингредиентам — так и у старых рецептов без сохранённых БЖУ
  const nutrition = calcNutrition(recipe.ingredients, recipe.servings);
  const portion = nutrition ? (hasServings ? nutrition.perServing : nutrition.per100g) : null;
  const favorite = isFavorite(recipe.id);

  // Счётчик «Сохранили»: сервер уже учёл состояние на момент загрузки, показываем разницу
  const favAtLoad = useRef(null);
  if (favAtLoad.current === null && favStatus !== 'loading') favAtLoad.current = favorite;
  const favoritesCount = recipe.favoritesCount + (favAtLoad.current === null ? 0 : Number(favorite) - Number(favAtLoad.current));

  useEffect(() => {
    document.title = `${recipe.title} — Forkistry`;
    return () => {
      document.title = 'Forkistry';
    };
  }, [recipe.title]);

  // Гость нажал лайк → вошёл → вернулся: засчитываем голос (сценарий Use Case 1, шаги 10–11)
  const pending = location.state?.action;
  useEffect(() => {
    if (pending?.type !== 'vote' || !user || !vote.loaded) return;
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    if (vote.my !== pending.value) vote.cast(pending.value).then((err) => err && setToast(err));
  }, [pending, user, vote.loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const onVote = async (value) => {
    const err = await vote.cast(value);
    if (err) setToast(err);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast('Ссылка скопирована');
    } catch (e) {
      if (e?.name !== 'AbortError') setToast('Не удалось поделиться ссылкой');
    }
  };
  const hideToast = useCallback(() => setToast(''), []);

  return (
    <article className={styles.page}>
      <div className={styles.hero}>
        <Photo src={recipe.photoUrl} fit={recipe.photoFit} alt={recipe.title} className={styles.heroPhoto} />
        <div className={styles.heroActions}>
          <IconButton icon={ChevronLeft} label="Назад" onClick={onBack} className={styles.glass} />
          <div className={styles.heroRight}>
            <IconButton icon={Share2} label="Поделиться" onClick={share} className={styles.glass} />
            <IconButton
              icon={Heart}
              label={favorite ? 'Убрать из избранного' : 'В избранное'}
              aria-pressed={favorite}
              active={favorite}
              onClick={() => toggleFavorite(recipe)}
              className={styles.glass}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <header className={styles.head}>
          <p className={styles.meta}>
            {recipe.category}
            {recipe.author && (
              <>
                {' · '}
                <Link to={`/author/${recipe.author.id}`} className={styles.author}>
                  {recipe.author.name}
                </Link>
              </>
            )}
          </p>
          <h1 className={styles.title}>{recipe.title}</h1>
          {recipe.created && (
            <p className={styles.date}>
              Опубликовано <time dateTime={recipe.created}>{formatDate(recipe.created)}</time>
            </p>
          )}
          {isAuthor && (
            <div className={styles.ownerActions}>
              <Button variant="secondary" to={`/recipe/${recipe.id}/edit`} icon={Pencil} className={styles.ownerBtn}>
                Редактировать
              </Button>
              <Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)} className={styles.ownerBtn}>
                Удалить
              </Button>
            </div>
          )}
        </header>

        <RecipeParams
          timeMinutes={recipe.timeMinutes}
          difficulty={recipe.difficulty}
          kcal={portion?.kcal ?? null}
          macros={portion}
          perServing={hasServings}
        />

        <EquipmentTags recipe={recipe} />

        <VoteButtons likes={vote.likes} dislikes={vote.dislikes} favoritesCount={favoritesCount} myVote={vote.my} onVote={onVote} />

        <section className={styles.section} aria-labelledby="ingredients-title">
          <div className={styles.sectionHead}>
            <h2 id="ingredients-title" className={styles.h2}>
              Ингредиенты
            </h2>
            {hasServings ? (
              <ServingsStepper value={servings} onChange={setServings} />
            ) : (
              recipe.yieldText && <span className={styles.yield}>{recipe.yieldText}</span>
            )}
          </div>
          <IngredientList ingredients={recipe.ingredients} factor={factor} />
          {nutrition && (
            <p className={styles.total}>
              Всего примерно {formatCount(Math.round(nutrition.total.kcal * factor))} ккал · Б {Math.round(nutrition.total.protein * factor)} · Ж{' '}
              {Math.round(nutrition.total.fat * factor)} · У {Math.round(nutrition.total.carbs * factor)} г
            </p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="steps-title">
          <h2 id="steps-title" className={styles.h2}>
            Шаги <span className={styles.stepsCount}>{recipe.steps.length}</span>
          </h2>
          <StepList steps={recipe.steps} />
        </section>
      </div>

      <div className={styles.cta}>
        <Button to={`/recipe/${recipe.id}/cook`} state={{ servings }} fullWidth>
          Начать готовить
        </Button>
      </div>

      <DeleteRecipeDialog
        recipe={confirmDelete ? recipe : null}
        onClose={() => setConfirmDelete(false)}
        onDeleted={() => navigate('/profile', { replace: true })}
      />

      <Toast message={toast} onClose={hideToast} />
    </article>
  );
}

function RecipeSkeleton({ onBack }) {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Загрузка рецепта">
      <div className={styles.hero}>
        <Skeleton className={styles.heroPhoto} radius="0" />
        <div className={styles.heroActions}>
          <IconButton icon={ChevronLeft} label="Назад" onClick={onBack} className={styles.glass} />
        </div>
      </div>
      <div className={styles.content}>
        <Skeleton width="45%" height="16px" />
        <Skeleton width="85%" height="28px" />
        <Skeleton height="78px" radius="var(--radius-photo-sm)" />
        <Skeleton width="60%" height="32px" />
        <Skeleton height="180px" />
      </div>
    </div>
  );
}
