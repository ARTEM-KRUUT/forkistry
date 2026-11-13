import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthScreen from '../../components/AuthScreen/AuthScreen.jsx';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useForm } from '../../hooks/useForm.js';
import { validateRegister } from '../../utils/validation.js';
import { safeRedirect } from '../../utils/redirect.js';
import { fieldErrors } from '../../api/errors.js';
import styles from './AuthForm.module.css';

export default function RegisterPage() {
  const { isAuthed, register } = useAuth();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const form = useForm({ name: '', email: '', password: '', passwordConfirm: '' }, validateRegister);

  if (isAuthed) {
    const action = location.state?.action;
    return <Navigate to={safeRedirect(location.state?.from)} replace state={action ? { action } : null} />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError('');
    try {
      await register(values);
    } catch (e) {
      const errs = fieldErrors(e);
      if (errs.email === 'Уже занято') errs.email = 'Этот email уже зарегистрирован';
      if (Object.keys(errs).length) form.setServerErrors(errs);
      else setFormError(e.message || 'Не удалось зарегистрироваться');
    }
  });

  return (
    <AuthScreen title="Регистрация" subtitle="Профиль нужен, чтобы публиковать рецепты, ставить оценки и собирать избранное">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Input label="Имя" autoComplete="name" placeholder="Как вас подписывать в рецептах" {...form.field('name')} />
        <Input label="Email" type="email" autoComplete="email" inputMode="email" placeholder="name@mail.ru" {...form.field('email')} />
        <Input label="Пароль" type="password" autoComplete="new-password" hint="Пароль не короче 8 символов" {...form.field('password')} />
        <Input label="Повторите пароль" type="password" autoComplete="new-password" {...form.field('passwordConfirm')} />
        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" fullWidth loading={form.submitting}>
          Зарегистрироваться
        </Button>
        <p className={styles.switch}>
          Уже есть профиль?{' '}
          <Link to="/login" state={location.state} replace>
            Войти
          </Link>
        </p>
      </form>
    </AuthScreen>
  );
}
