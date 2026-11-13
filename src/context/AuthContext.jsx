import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { clearAuth, getAuth, setAuth, setUser, subscribe } from '../api/authStore.js';
import { ApiError } from '../api/errors.js';

/**
 * Текущий пользователь. Токен лежит в localStorage (api/authStore.js);
 * при старте приложения он продлевается, а при 401 от сервера сессия сбрасывается.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(getAuth);

  useEffect(() => subscribe(setAuthState), []);

  // Продлеваем сохранённую сессию и обновляем данные профиля
  useEffect(() => {
    if (!getAuth().token) return;
    authApi
      .refreshAuth()
      .then(({ token, user }) => setAuth(token, user))
      .catch((e) => {
        // Нет сети — оставляем сессию до следующей попытки; отозванный токен client.js уже сбросил
        if (e instanceof ApiError && e.status !== 0) clearAuth();
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    setAuth(token, user);
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const { token, user } = await authApi.register(data);
    setAuth(token, user);
    return user;
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const user = await authApi.updateProfile(getAuth().user.id, patch);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      isAuthed: Boolean(auth.token && auth.user),
      logoutReason: auth.reason ?? null,
      login,
      register,
      logout: () => clearAuth('logout'),
      updateProfile,
    }),
    [auth, login, register, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно вызывать внутри AuthProvider');
  return ctx;
}

/**
 * Проверка перед действием, доступным только после входа (лайк, избранное, «+ Рецепт»).
 * Гостя отправляет на /login; после входа он вернётся сюда, а action выполнится на экране
 * (location.state.action), — как в сценарии «нажал лайк → вошёл → лайк засчитался».
 */
export function useRequireAuth() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (action) => {
      if (isAuthed) return true;
      navigate('/login', { state: { from: { pathname: location.pathname, search: location.search }, action } });
      return false;
    },
    [isAuthed, navigate, location.pathname, location.search],
  );
}
