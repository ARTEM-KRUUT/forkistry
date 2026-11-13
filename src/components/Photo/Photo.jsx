import { forwardRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { fitStyles } from '../../utils/photoFit.js';
import styles from './Photo.module.css';

/**
 * Фото по ссылке в рамке любой формы (форму задаёт className: aspect-ratio или высота).
 * fit — настройки показа из редактора: точка кадра, масштаб, поворот (utils/photoFit.js).
 * Пока грузится, при ошибке и без ссылки показывает заглушку.
 */
const Photo = forwardRef(function Photo({ src, alt = '', fit, className = '', children, ...rest }, ref) {
  // Запоминаем, какая ссылка загрузилась или упала: новая ссылка (например, в редакторе) снова «загружается».
  // Без эффекта-сброса: фото из кэша загружается раньше эффекта, и сброс прятал бы уже показанное фото.
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !src || failedSrc === src;
  const loaded = loadedSrc === src;
  const { box, img } = fitStyles(fit);

  return (
    <div ref={ref} className={`${styles.photo} ${className}`} {...rest}>
      {failed ? (
        <ImageOff className={styles.icon} size={28} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <div className={styles.box} style={box}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            className={`${styles.img} ${loaded ? styles.loaded : ''}`}
            style={img}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
          />
        </div>
      )}
      {children}
    </div>
  );
});

export default Photo;
