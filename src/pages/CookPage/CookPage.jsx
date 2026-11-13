import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List, RectangleVertical, SearchX, X } from 'lucide-react';
import IconButton from '../../components/IconButton/IconButton.jsx';
import CookModeA from '../../components/CookModeA/CookModeA.jsx';
import CookModeB from '../../components/CookModeB/CookModeB.jsx';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx';
import Skeleton from '../../components/Skeleton/Skeleton.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { useStepTimers } from '../../hooks/useStepTimers.js';
import { useWakeLock } from '../../hooks/useWakeLock.js';
import { getRecipe } from '../../api/recipes.js';
import { isNotFound } from '../../api/errors.js';
import { playAlarm, primeAudio } from '../../utils/alarm.js';
import styles from './CookPage.module.css';

/** Режим готовки: вариант А — по одному шагу, вариант Б — списком (исследование, docs/concept.md, разд. 7). */
export default function CookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, data: recipe, error, reload } = useAsync(() => getRecipe(id), [id]);

  if (status === 'success' && recipe.steps.length > 0) return <CookView key={recipe.id} recipe={recipe} />;

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <IconButton icon={X} label="Закрыть режим готовки" variant="soft" onClick={() => navigate(`/recipe/${id}`)} />
      </div>
      {status === 'loading' && (
        <div className={styles.loading} aria-busy="true" aria-label="Загрузка шагов">
          <Skeleton height="4px" />
          <Skeleton height="176px" radius="var(--radius-card)" />
          <Skeleton width="90%" height="28px" />
          <Skeleton width="70%" height="28px" />
        </div>
      )}
      {status === 'error' &&
        (isNotFound(error) ? (
          <EmptyState icon={SearchX} title="Рецепт не найден" action={{ label: 'Перейти в каталог', to: '/recipes' }} />
        ) : (
          <ErrorState onRetry={reload} />
        ))}
      {status === 'success' && <EmptyState icon={SearchX} title="В рецепте нет шагов" action={{ label: 'К рецепту', to: `/recipe/${id}` }} />}
    </div>
  );
}

function CookView({ recipe }) {
  const navigate = useNavigate();
  const { cookVariant, setCookVariant, sound } = useSettings();
  const [current, setCurrent] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);
  const [announce, setAnnounce] = useState('');

  const onTimerEnd = useCallback(
    (i) => {
      playAlarm({ sound });
      setAnnounce(`Таймер шага ${i + 1} закончился`);
    },
    [sound],
  );
  const timers = useStepTimers(recipe.steps, onTimerEnd);
  // Звук разрешается только после жеста пользователя — «будим» аудио при запуске таймера
  const wrapped = {
    ...timers,
    toggle: (i) => {
      primeAudio();
      timers.toggle(i);
    },
  };

  useWakeLock(true);

  useEffect(() => {
    document.title = `Готовим: ${recipe.title} — Forkistry`;
    return () => {
      document.title = 'Forkistry';
    };
  }, [recipe.title]);

  // Закрытие вкладки или перезагрузка с идущим таймером — браузер спросит подтверждение
  useEffect(() => {
    if (!timers.anyRunning) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [timers.anyRunning]);

  const exit = () => navigate(`/recipe/${recipe.id}`, { replace: true });
  const requestExit = () => (timers.anyRunning ? setConfirmExit(true) : exit());
  const goTo = useCallback((i) => setCurrent(Math.max(0, Math.min(recipe.steps.length - 1, i))), [recipe.steps.length]);

  const isA = cookVariant !== 'B';
  const total = recipe.steps.length;

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <IconButton icon={X} label="Закрыть режим готовки" variant="soft" onClick={requestExit} />
        <div className={styles.title}>
          <h1 className={styles.recipe}>{recipe.title}</h1>
          <p className={styles.sub}>{isA ? `Шаг ${current + 1} из ${total}` : `Выполнено ${current} из ${total}`}</p>
        </div>
        <IconButton
          icon={isA ? List : RectangleVertical}
          label={isA ? 'Показать все шаги списком (вариант Б)' : 'Показывать по одному шагу (вариант А)'}
          variant="soft"
          onClick={() => setCookVariant(isA ? 'B' : 'A')}
        />
      </header>

      {isA ? (
        <CookModeA steps={recipe.steps} current={current} onGo={goTo} onFinish={requestExit} timers={wrapped} />
      ) : (
        <CookModeB steps={recipe.steps} current={current} onGo={goTo} onFinish={requestExit} timers={wrapped} />
      )}

      <p className="visually-hidden" role="status" aria-live="assertive">
        {announce}
      </p>

      <ConfirmDialog
        open={confirmExit}
        title="Выйти из режима готовки?"
        text="Таймер ещё идёт. Если выйти, он остановится."
        cancelLabel="Остаться"
        confirmLabel="Выйти"
        onConfirm={exit}
        onCancel={() => setConfirmExit(false)}
      />
    </div>
  );
}
