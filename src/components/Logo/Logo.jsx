import forkIcon from '../../assets/fork.svg';
import styles from './Logo.module.css';

/** Логотип (Figma 20:804): буква «i» в слове Forkistry заменена на вилку акцентного цвета. */
export default function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.word} aria-hidden="true">
        <span>Fork</span>
        <span className={styles.forkBox}>
          <img src={forkIcon} width="13" height="21" alt="" />
        </span>
        <span>stry</span>
      </span>
      <span className="visually-hidden">Forkistry</span>
    </span>
  );
}
