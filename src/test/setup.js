import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { resetDb, server } from './server.js';
import { setAuth } from '../api/authStore.js';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => {
  resetDb();
  localStorage.clear();
  setAuth('', null); // хранилище сессии — модульное состояние, сбрасываем между тестами
  sessionStorage.clear();
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
