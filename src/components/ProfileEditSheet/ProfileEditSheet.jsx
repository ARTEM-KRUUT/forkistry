import { useState } from 'react';
import BottomSheet from '../BottomSheet/BottomSheet.jsx';
import Input from '../Input/Input.jsx';
import Button from '../Button/Button.jsx';
import Avatar from '../Avatar/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useForm } from '../../hooks/useForm.js';
import { validateProfile } from '../../utils/validation.js';
import { fieldErrors } from '../../api/errors.js';
import styles from './ProfileEditSheet.module.css';

/** Редактирование профиля: имя, описание и ссылка на фото (фото на сервере не храним). */
export default function ProfileEditSheet({ open, onClose, onSaved }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Профиль">
      {open && <ProfileForm onClose={onClose} onSaved={onSaved} />}
    </BottomSheet>
  );
}

function ProfileForm({ onClose, onSaved }) {
  const { user, updateProfile } = useAuth();
  const [formError, setFormError] = useState('');
  const form = useForm({ name: user.name, bio: user.bio, avatarUrl: user.avatarUrl }, validateProfile);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError('');
    try {
      await updateProfile(values);
      onSaved?.();
      onClose();
    } catch (e) {
      const errs = fieldErrors(e);
      if (Object.keys(errs).length) form.setServerErrors(errs);
      else setFormError(e.message || 'Не удалось сохранить');
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.preview}>
        <Avatar name={form.values.name} url={form.values.avatarUrl.trim()} size={72} />
      </div>
      <Input label="Имя" autoComplete="name" {...form.field('name')} />
      <Input label="О себе" multiline rows={3} placeholder="Например, готовлю по выходным, люблю выпечку" {...form.field('bio')} />
      <Input label="Ссылка на фото" type="url" inputMode="url" placeholder="https://…" {...form.field('avatarUrl')} />
      {formError && (
        <p className={styles.error} role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" fullWidth loading={form.submitting}>
        Сохранить
      </Button>
    </form>
  );
}
