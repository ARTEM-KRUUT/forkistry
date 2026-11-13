import { Compass } from 'lucide-react';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <EmptyState
        icon={Compass}
        title="Такой страницы нет"
        text="Возможно, ссылка устарела или в адресе опечатка"
        action={{ label: 'На главную', to: '/' }}
        secondaryAction={{ label: 'Перейти в каталог', to: '/recipes' }}
      />
    </div>
  );
}
