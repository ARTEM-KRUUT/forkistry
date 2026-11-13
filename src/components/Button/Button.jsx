import { Link } from 'react-router-dom';
import styles from './Button.module.css';

/**
 * Кнопка: variant = primary | secondary | danger | link.
 * С `to` рендерится как ссылка роутера, иначе — <button>.
 */
export default function Button({
  variant = 'primary',
  fullWidth = false,
  to,
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = [styles.button, styles[variant], fullWidth ? styles.full : '', className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {Icon && <Icon size={20} strokeWidth={2} aria-hidden="true" />}
      <span>{loading ? 'Подождите…' : children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
