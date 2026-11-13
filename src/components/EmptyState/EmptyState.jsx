import { createElement } from 'react';
import Button from '../Button/Button.jsx';
import styles from './EmptyState.module.css';

/**
 * Пустое состояние (Figma 10:470): иконка в круге, заголовок, пояснение, кнопка и необязательная ссылка.
 * action / secondaryAction — { label, to } или { label, onClick }.
 */
export default function EmptyState({ icon, title, text, action, secondaryAction, role }) {
  return (
    <div className={styles.root} role={role}>
      {icon && (
        <span className={styles.iconCircle}>
          {createElement(icon, { size: 30, strokeWidth: 1.75, 'aria-hidden': true })}
        </span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {action && (
        <Button to={action.to} {...(action.to && action.state ? { state: action.state } : {})} onClick={action.onClick} className={styles.action}>
          {action.label}
        </Button>
      )}
      {secondaryAction && (
        <Button variant="link" to={secondaryAction.to} onClick={secondaryAction.onClick}>
          {secondaryAction.label}
        </Button>
      )}
    </div>
  );
}
