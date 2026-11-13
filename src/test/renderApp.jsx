import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import AppProviders from '../AppProviders.jsx';
import App from '../App.jsx';
import { setAuth } from '../api/authStore.js';
import { TEST_USER } from './server.js';

/** Текущий адрес для проверок навигации. */
export const location = { current: null };
function LocationSpy() {
  location.current = useLocation();
  return null;
}

/** Вход «как будто уже выполнен»: токен в хранилище до старта приложения. */
export function loginAsTestUser() {
  setAuth('test-token', TEST_USER);
}

/** Всё приложение с роутером в памяти, начиная с адреса url. */
export function renderApp(url = '/') {
  const user = userEvent.setup();
  const utils = render(
    <MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProviders>
        <App />
        <LocationSpy />
      </AppProviders>
    </MemoryRouter>,
  );
  return { user, ...utils };
}
