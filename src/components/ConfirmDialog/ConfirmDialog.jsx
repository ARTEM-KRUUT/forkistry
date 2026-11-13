import BottomSheet from '../BottomSheet/BottomSheet.jsx';
import Button from '../Button/Button.jsx';
import styles from './ConfirmDialog.module.css';

/** Подтверждение необратимого действия: удаление рецепта, выход из готовки с таймером. */
export default function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel = 'Отмена', danger = false, busy = false, error, onConfirm, onCancel }) {
  return (
    <BottomSheet
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" fullWidth onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'dangerSolid' : 'primary'} fullWidth onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {text && <p className={styles.text}>{text}</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </BottomSheet>
  );
}
