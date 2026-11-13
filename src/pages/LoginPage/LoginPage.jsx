import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthScreen from '../../components/AuthScreen/AuthScreen.jsx';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useForm } from '../../hooks/useForm.js';
import { validateLogin } from '../../utils/validation.js';
import { safeRedirect } from '../../utils/redirect.js';
import { ApiError } from '../../api/errors.js';
import styles from '../RegisterPage/AuthForm.module.css';

export default function LoginPage() {
  const { isAuthed, login } = useAuth();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const form = useForm({ email: '', password: '' }, validateLogin);

  // Вошли (или уже были в профиле) — возвращаемся туда, откуда пришли, с отложенным действием
  if (isAuthed) {
    const action = location.state?.action;
    return <Navigate to={safeRedirect(location.state?.from)} replace state={action ? { action } : null} />;
  }

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setFormError('');
    try {
      await login(email, password);
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) form.setServerErrors({ password: 'Неверный email или пароль' });
      else setFormError(e.message || 'Не удалось войти');
    }
  });

  return (
    <AuthScreen title="Вход в профиль" subtitle="Чтобы ставить оценки, сохранять рецепты в избранное и публиковать свои">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Input label="Email" type="email" autoComplete="email" inputMode="email" placeholder="name@mail.ru" {...form.field('email')} />
        <Input label="Пароль" type="password" autoComplete="current-password" {...form.field('password')} />
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth loading={form.submitting}>
          Войти
        </Button>
        <p className={styles.switch}>
          Нет профиля?{' '}
          <Link to="/register" state={location.state} replace>
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </AuthScreen>
  );
}
