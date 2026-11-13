import { useState } from 'react';
import { initials } from '../../utils/format.js';
import styles from './Avatar.module.css';

/**
 * Аватар: фото по ссылке, при отсутствии или ошибке загрузки — инициалы.
 * tone: accent — свой профиль в шапке, neutral — другие авторы (Figma 17:851, 11:680).
 */
export default function Avatar({ name = '', url, size = 40, tone = 'accent' }) {
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;

  return (
    <span className={`${styles.avatar} ${styles[tone]}`} style={{ '--size': `${size}px` }} aria-hidden="true">
      {showImage ? <img src={url} alt="" className={styles.img} onError={() => setFailed(true)} /> : initials(name)}
    </span>
  );
}
