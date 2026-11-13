import { ChevronLeft } from 'lucide-react';
import IconButton from '../IconButton/IconButton.jsx';
import { useGoBack } from '../../hooks/useGoBack.js';
import styles from './AuthScreen.module.css';

/** Каркас экранов входа и регистрации (Figma 11:644, 18:933): «назад», заголовок, пояснение, форма. */
export default function AuthScreen({ title, subtitle, children }) {
  const goBack = useGoBack('/');
  return (
    <div className={styles.screen}>
      <div className={styles.bar}>
        <IconButton icon={ChevronLeft} label="Назад" variant="soft" onClick={goBack} />
      </div>
      <div className={styles.content}>
        <div className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
