import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Настройки интерфейса. Сейчас — вариант режима готовки для исследования (docs/concept.md, раздел 7):
 * A — один шаг на экране, B — список шагов. Выбор запоминается в браузере.
 */
const SettingsContext = createContext(null);
const KEY = 'forkistry:settings';
const DEFAULTS = { cookVariant: 'A', sound: true };

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return DEFAULTS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // без сохранения — настройки живут до перезагрузки
    }
  }, [settings]);

  const value = useMemo(
    () => ({
      ...settings,
      setCookVariant: (cookVariant) => setSettings((s) => ({ ...s, cookVariant })),
      setSound: (sound) => setSettings((s) => ({ ...s, sound })),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings нужно вызывать внутри SettingsProvider');
  return ctx;
}
