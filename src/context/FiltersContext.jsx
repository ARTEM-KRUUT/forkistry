import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_FILTERS, toggleValue } from '../utils/filters.js';

/**
 * Фильтры каталога. Живут выше маршрутов, поэтому сохраняются при уходе на рецепт и возврате.
 * Техника «что есть на кухне» общая для главной и каталога и запоминается между визитами (localStorage).
 */
const FiltersContext = createContext(null);
const KITCHEN_KEY = 'forkistry:kitchen';

function loadKitchen() {
  try {
    const saved = JSON.parse(localStorage.getItem(KITCHEN_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.patch };
    case 'toggleEquipment':
      return { ...state, equipment: toggleValue(state.equipment, action.value) };
    case 'reset':
      // Сброс фильтров панели и категории; поиск и сортировку пользователь меняет отдельно
      return { ...DEFAULT_FILTERS, search: state.search, sort: state.sort };
    default:
      return state;
  }
}

export function FiltersProvider({ children }) {
  const [filters, dispatch] = useReducer(reducer, null, () => ({ ...DEFAULT_FILTERS, equipment: loadKitchen() }));

  useEffect(() => {
    try {
      localStorage.setItem(KITCHEN_KEY, JSON.stringify(filters.equipment));
    } catch {
      // приватный режим или заблокированное хранилище — просто не запоминаем
    }
  }, [filters.equipment]);

  // dispatch стабилен, поэтому и действия не меняются между рендерами
  const actions = useMemo(
    () => ({
      setFilters: (patch) => dispatch({ type: 'set', patch }),
      toggleEquipment: (value) => dispatch({ type: 'toggleEquipment', value }),
      resetFilters: () => dispatch({ type: 'reset' }),
    }),
    [],
  );
  const value = useMemo(() => ({ filters, ...actions }), [filters, actions]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters нужно вызывать внутри FiltersProvider');
  return ctx;
}
