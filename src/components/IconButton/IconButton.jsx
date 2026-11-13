import styles from './IconButton.module.css';

/**
 * Круглая кнопка с иконкой. variant: glass — поверх фото, soft — на фоне страницы.
 * label обязателен: у кнопки нет текста, это её доступное имя.
 */
export default function IconButton({ icon: Icon, label, variant = 'glass', size = 40, iconSize = 20, active = false, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${active ? styles.active : ''} ${className}`}
      style={{ '--size': `${size}px` }}
      aria-label={label}
      {...rest}
    >
      <Icon size={iconSize} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
