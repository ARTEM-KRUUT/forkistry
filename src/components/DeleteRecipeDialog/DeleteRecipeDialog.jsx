import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.jsx';
import { deleteRecipe } from '../../api/recipes.js';

/**
 * «Удалить рецепт?» — Отмена / Удалить. Одно окно для страницы рецепта, редактора и профиля.
 * recipe — что удаляем (null — окно закрыто). onDeleted вызывается после успешного удаления.
 */
export default function DeleteRecipeDialog({ recipe, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    if (busy) return;
    setError('');
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await deleteRecipe(recipe.id);
      setBusy(false);
      onDeleted(recipe);
    } catch (e) {
      setError(e.message || 'Не удалось удалить рецепт');
      setBusy(false);
    }
  };

  return (
    <ConfirmDialog
      open={Boolean(recipe)}
      title="Удалить рецепт?"
      text={recipe ? `«${recipe.title}» исчезнет из каталога и у всех, кто сохранил его в избранное. Отменить это нельзя.` : ''}
      confirmLabel="Удалить"
      cancelLabel="Отмена"
      danger
      busy={busy}
      error={error}
      onConfirm={confirm}
      onCancel={close}
    />
  );
}
