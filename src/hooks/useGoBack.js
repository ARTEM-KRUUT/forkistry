import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * «Назад» внутри приложения. Если экран открыт по прямой ссылке (истории в приложении нет),
 * ведём на fallback, а не уводим пользователя с сайта.
 */
export function useGoBack(fallback = '/recipes') {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);
    else navigate(fallback, { replace: true });
  }, [location.key, navigate, fallback]);
}
