import { WifiOff } from 'lucide-react';
import EmptyState from '../EmptyState/EmptyState.jsx';

/** Состояние ошибки загрузки с кнопкой повтора. Визуально — как пустое состояние. */
export default function ErrorState({
  title = 'Не удалось загрузить',
  text = 'Проверьте подключение к интернету и попробуйте ещё раз',
  onRetry,
}) {
  return (
    <EmptyState
      icon={WifiOff}
      title={title}
      text={text}
      action={onRetry ? { label: 'Повторить', onClick: onRetry } : undefined}
      role="alert"
    />
  );
}
