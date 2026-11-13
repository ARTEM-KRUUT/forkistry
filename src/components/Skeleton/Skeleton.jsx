import styles from './Skeleton.module.css';

/** Блок-заглушка с мерцанием для состояния loading. */
export default function Skeleton({ width = '100%', height, radius, className = '' }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
