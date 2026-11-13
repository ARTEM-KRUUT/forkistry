import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Обёртка маршрута «только после входа»: гостя ведёт на /login с возвратом обратно.
 * Если пользователь сам нажал «Выйти» на защищённом экране — уводим на главную, а не на вход.
 */
export default function RequireAuth({ children }) {
  const { isAuthed, logoutReason } = useAuth();
  const location = useLocation();
  if (isAuthed) return children;
  if (logoutReason === 'logout') return <Navigate to="/" replace />;
  return <Navigate to="/login" replace state={{ from: { pathname: location.pathname, search: location.search } }} />;
}
