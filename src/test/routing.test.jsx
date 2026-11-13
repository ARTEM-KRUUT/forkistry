import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { loginAsTestUser, location, renderApp } from './renderApp.jsx';

describe('маршрутизация', () => {
  it('главная: заголовок, шапка и нижняя панель', async () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Что приготовим сегодня?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forkistry, на главную' })).toBeInTheDocument();
    expect(screen.getAllByRole('navigation', { name: 'Основная навигация' }).length).toBeGreaterThan(0);
    expect(await screen.findByRole('heading', { name: 'Популярное' })).toBeInTheDocument();
  });

  it('переход по нижней панели в каталог', async () => {
    const { user } = renderApp('/');
    const nav = screen.getAllByRole('navigation', { name: 'Основная навигация' }).at(-1);
    await user.click(within(nav).getByRole('link', { name: 'Рецепты' }));
    expect(location.current.pathname).toBe('/recipes');
    expect(screen.getByRole('heading', { level: 1, name: 'Рецепты' })).toBeInTheDocument();
  });

  it('режим готовки, вход и регистрация — без шапки и нижней панели', async () => {
    for (const url of ['/recipe/r1/cook', '/login', '/register']) {
      const { unmount } = renderApp(url);
      expect(screen.queryByRole('navigation', { name: 'Основная навигация' })).not.toBeInTheDocument();
      unmount();
    }
  });

  it('гостя с защищённых экранов уводит на вход', async () => {
    renderApp('/profile');
    expect(await screen.findByRole('heading', { name: 'Вход в профиль' })).toBeInTheDocument();
    expect(location.current.pathname).toBe('/login');
    expect(location.current.state.from.pathname).toBe('/profile');
  });

  it('«+ Рецепт» у гостя → вход → после входа открывается редактор', async () => {
    const { user } = renderApp('/recipes');
    await user.click(screen.getByRole('link', { name: 'Рецепт' }));
    expect(location.current.pathname).toBe('/login');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByRole('heading', { name: 'Новый рецепт' })).toBeInTheDocument();
    expect(location.current.pathname).toBe('/recipe/new');
  });

  it('вошедший пользователь видит профиль; выход ведёт на главную', async () => {
    loginAsTestUser();
    const { user } = renderApp('/profile');
    expect(screen.getByRole('heading', { name: 'Тест Тестов' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Выйти из профиля' }));
    expect(location.current.pathname).toBe('/');
  });

  it('неизвестный адрес — 404', () => {
    renderApp('/nope/xyz');
    expect(screen.getByRole('heading', { name: 'Такой страницы нет' })).toBeInTheDocument();
  });
});
