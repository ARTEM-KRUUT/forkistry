import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { location, renderApp } from './renderApp.jsx';

describe('формы входа и регистрации', () => {
  it('пустая отправка — ошибки под полями, фокус на первом', async () => {
    const { user } = renderApp('/login');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    expect(screen.getByText('Введите email')).toBeInTheDocument();
    expect(screen.getByText('Введите пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    await new Promise((r) => setTimeout(r, 10));
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('неверный пароль — понятное сообщение от сервера', async () => {
    const { user } = renderApp('/login');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'wrong-pass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByText('Неверный email или пароль')).toBeInTheDocument();
  });

  it('успешный вход возвращает туда, откуда пришли', async () => {
    const { user } = renderApp('/favorites');
    await user.click(screen.getByRole('link', { name: 'Войти' }));
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByRole('heading', { name: 'Пока ничего не сохранено' })).toBeInTheDocument();
    expect(location.current.pathname).toBe('/favorites');
  });

  it('регистрация: проверка пароля и занятый email', async () => {
    const { user } = renderApp('/register');
    await user.type(screen.getByLabelText('Имя'), 'Ольга');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'short');
    await user.type(screen.getByLabelText('Повторите пароль'), 'other');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    expect(screen.getByText('Пароль не короче 8 символов')).toBeInTheDocument();
    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Пароль'));
    await user.type(screen.getByLabelText('Пароль'), 'secret123');
    await user.clear(screen.getByLabelText('Повторите пароль'));
    await user.type(screen.getByLabelText('Повторите пароль'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    expect(await screen.findByText('Этот email уже зарегистрирован')).toBeInTheDocument();
  });
});
