import { ThumbsUp } from 'lucide-react';
import styles from './LikeBadge.module.css';

/** Зелёный бейдж доли лайков. Если голосов нет (percent = null) — не показывается. */
export default function LikeBadge({ percent, className = '' }) {
  if (percent === null || percent === undefined) return null;

  return (
    <span className={`${styles.badge} ${className}`} aria-label={`Понравилось ${percent}%`}>
      <ThumbsUp size={14} strokeWidth={2} aria-hidden="true" />
      {percent}%
    </span>
  );
}
