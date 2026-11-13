import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { location, renderApp } from './renderApp.jsx';

describe('режим готовки', () => {
  it('вариант А: шаги по одному, «Назад»/«Далее»', async () => {
    const { user } = renderApp('/recipe/r1/cook');
    expect(await screen.findByText('Шаг 1 из 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Шаг 2 из 6')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByText('Шаг 4 из 6')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Таймер шага' })).toBeInTheDocument();
  });

  it('переключение на вариант Б сохраняет шаг и запоминается', async () => {
    const { user } = renderApp('/recipe/r1/cook');
    await screen.findByText('Шаг 1 из 6');
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: /списком/ }));
    expect(screen.getByText('Выполнено 1 из 6')).toBeInTheDocument();
    expect(screen.getByText('Шаг 2 · сейчас')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('forkistry:settings')).cookVariant).toBe('B');
  });

  it('выход с запущенным таймером требует подтверждения', async () => {
    const { user } = renderApp('/recipe/r1/cook');
    await screen.findByText('Шаг 1 из 6');
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await user.click(screen.getByRole('button', { name: 'Запустить таймер' }));
    await user.click(screen.getByRole('button', { name: 'Закрыть режим готовки' }));
    const dialog = screen.getByRole('dialog', { name: 'Выйти из режима готовки?' });
    await user.click(within(dialog).getByRole('button', { name: 'Остаться' }));
    expect(location.current.pathname).toBe('/recipe/r1/cook');

    await user.click(screen.getByRole('button', { name: 'Закрыть режим готовки' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Выйти' }));
    expect(location.current.pathname).toBe('/recipe/r1');
  });

  it('без запущенного таймера выходит сразу', async () => {
    const { user } = renderApp('/recipe/r1/cook');
    await screen.findByText('Шаг 1 из 6');
    await user.click(screen.getByRole('button', { name: 'Закрыть режим готовки' }));
    expect(location.current.pathname).toBe('/recipe/r1');
  });
});
