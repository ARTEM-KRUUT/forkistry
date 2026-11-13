import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { location, loginAsTestUser, renderApp } from './renderApp.jsx';
import { db } from './server.js';

describe('избранное', () => {
  it('гостю — приглашение войти', () => {
    renderApp('/favorites');
    expect(screen.getByRole('heading', { name: 'Здесь будут сохранённые рецепты' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login');
  });

  it('гость нажал сердечко в каталоге → вход → рецепт добавлен в избранное', async () => {
    const { user } = renderApp('/recipes');
    await screen.findByText('14 рецептов');
    const card = screen.getAllByRole('article')[0];
    const title = within(card).getByRole('heading').textContent;
    await user.click(within(card).getByRole('button', { name: 'В избранное' }));
    expect(location.current.pathname).toBe('/login');

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    await screen.findByText('14 рецептов');
    expect(location.current.pathname).toBe('/recipes');
    await within(screen.getAllByRole('article')[0]).findByRole('button', { name: 'Убрать из избранного' });
    expect(db.favorites).toHaveLength(1);

    const nav = screen.getAllByRole('navigation', { name: 'Основная навигация' }).at(-1);
    await user.click(within(nav).getByRole('link', { name: 'Избранное' }));
    expect(await screen.findByText('1 сохранённый рецепт')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: new RegExp(title) })).toBeInTheDocument();
  });

  it('пусто у вошедшего — подсказка и ссылка в каталог', async () => {
    loginAsTestUser();
    renderApp('/favorites');
    expect(await screen.findByRole('heading', { name: 'Пока ничего не сохранено' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти в каталог' })).toHaveAttribute('href', '/recipes');
  });
});
