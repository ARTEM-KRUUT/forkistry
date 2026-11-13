import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar.jsx';
import { plural, shortName } from '../../utils/format.js';
import styles from './AuthorTile.module.css';

/** Автор в блоке «Популярные авторы» на главной (Figma 17:850). */
export default function AuthorTile({ author }) {
  const count = author.recipesCount ?? 0;
  return (
    <Link to={`/author/${author.id}`} className={styles.tile}>
      <Avatar name={author.name} url={author.avatarUrl} size={64} tone="neutral" />
      <span className={styles.name}>{shortName(author.name)}</span>
      <span className={styles.meta}>
        {count} {plural(count, ['рецепт', 'рецепта', 'рецептов'])}
      </span>
    </Link>
  );
}
