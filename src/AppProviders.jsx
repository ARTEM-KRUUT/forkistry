import { AuthProvider } from './context/AuthContext.jsx';
import { FiltersProvider } from './context/FiltersContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

/** Все контексты приложения. Должны быть внутри Router: избранное и вход используют навигацию. */
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <FiltersProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </FiltersProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
