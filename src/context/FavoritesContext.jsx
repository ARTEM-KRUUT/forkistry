import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useRequireAuth } from './AuthContext.jsx';
import { addFavorite, getMyFavorites, removeFavorite } from '../api/favorites.js';

/**
 * Избранное вошедшего пользователя (коллекция favorites).
 * Переключение оптимистичное: сердечко меняется сразу, при ошибке сервера — откатывается.
 */
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const requireAuth = useRequireAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'idle', items: [], error: null });
  const [attempt, setAttempt] = useState(0);
  const itemsRef = useRef([]);
  itemsRef.current = state.items;

  useEffect(() => {
    if (!user) {
      setState({ status: 'idle', items: [], error: null });
      return undefined;
    }
    let active = true;
    setState((s) => ({ ...s, status: 'loading', error: null }));
    getMyFavorites(user.id)
      .then((items) => active && setState({ status: 'success', items, error: null }))
      .catch((error) => active && setState({ status: 'error', items: [], error }));
    return () => {
      active = false;
    };
  }, [user?.id, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const byRecipe = useMemo(() => new Map(state.items.map((f) => [f.recipe.id, f.id])), [state.items]);

  const add = useCallback(
    async (recipe) => {
      const temp = { id: `pending-${recipe.id}`, recipe };
      setState((s) => ({ ...s, items: [temp, ...s.items] }));
      try {
        const id = await addFavorite(user.id, recipe.id);
        setState((s) => ({ ...s, items: s.items.map((f) => (f === temp ? { ...f, id } : f)) }));
      } catch {
        setState((s) => ({ ...s, items: s.items.filter((f) => f !== temp) }));
      }
    },
    [user],
  );

  const toggleFavorite = useCallback(
    async (recipe) => {
      if (!requireAuth({ type: 'favorite', recipe })) return;
      const existing = itemsRef.current.find((f) => f.recipe.id === recipe.id);
      if (!existing) return add(recipe);
      if (existing.id.startsWith('pending-')) return undefined;
      setState((s) => ({ ...s, items: s.items.filter((f) => f !== existing) }));
      try {
        await removeFavorite(existing.id);
      } catch {
        setState((s) => ({ ...s, items: [existing, ...s.items] }));
      }
      return undefined;
    },
    [requireAuth, add],
  );

  // Гость нажал сердечко → вошёл → вернулся: добавляем рецепт и убираем действие из истории.
  // На /login и /register не трогаем: там действие ещё «в пути» (переход назад идёт в transition)
  const pending = location.state?.action;
  const onAuthScreen = /^\/(login|register)\b/.test(location.pathname);
  useEffect(() => {
    if (!user || onAuthScreen || state.status !== 'success' || pending?.type !== 'favorite') return;
    if (!byRecipe.has(pending.recipe.id)) add(pending.recipe);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [user, onAuthScreen, state.status, pending]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      status: state.status,
      items: state.items,
      error: state.error,
      isFavorite: (id) => byRecipe.has(id),
      toggleFavorite,
      reload: () => setAttempt((n) => n + 1),
    }),
    [state, byRecipe, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites нужно вызывать внутри FavoritesProvider');
  return ctx;
}
