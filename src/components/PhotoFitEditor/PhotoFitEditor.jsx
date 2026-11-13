import { useId, useRef } from 'react';
import { Move, RotateCw, Undo2 } from 'lucide-react';
import Photo from '../Photo/Photo.jsx';
import { DEFAULT_FIT, MAX_ZOOM, isDefaultFit, normalizeFit, panFit, rotateFit } from '../../utils/photoFit.js';
import styles from './PhotoFitEditor.module.css';

/**
 * Настройка показа фото: перетаскивание кадра (палец, мышь, стрелки), масштаб, поворот на 90°.
 * aspect — форма превью, как фото будет выглядеть чаще всего (шаг — 4:5, обложка — как в карточке).
 */
export default function PhotoFitEditor({ src, fit, onChange, aspect = '4 / 5', label = 'Кадр' }) {
  const f = normalizeFit(fit);
  const frameRef = useRef(null);
  const drag = useRef(null);
  const zoomId = useId();
  const hintId = useId();

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    try {
      frameRef.current.setPointerCapture(e.pointerId); // палец может уйти за край — движение не теряется
    } catch {
      // указатель уже отпущен — перетаскивание просто не начнётся
    }
    drag.current = { x: e.clientX, y: e.clientY, fit: f };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    onChange(panFit(drag.current.fit, e.clientX - drag.current.x, e.clientY - drag.current.y, rect.width, rect.height));
  };
  const endDrag = () => {
    drag.current = null;
  };

  // Стрелки двигают фото на 4 %, как перетаскивание в ту же сторону
  const onKeyDown = (e) => {
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!step) return;
    e.preventDefault();
    const rect = frameRef.current.getBoundingClientRect();
    onChange(panFit(f, (step[0] * rect.width * 4 * f.zoom) / 150, (step[1] * rect.height * 4 * f.zoom) / 150, rect.width, rect.height));
  };

  return (
    <div className={styles.root}>
      <Photo
        ref={frameRef}
        src={src}
        fit={f}
        className={styles.frame}
        style={{ aspectRatio: aspect }}
        tabIndex={0}
        role="group"
        aria-label={`${label}: перетащите, чтобы выбрать видимую часть фото`}
        aria-describedby={hintId}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
      >
        <span className={styles.badge} aria-hidden="true">
          <Move size={14} strokeWidth={2} />
          Двигайте фото
        </span>
      </Photo>
      <p id={hintId} className="visually-hidden">
        Стрелки на клавиатуре тоже сдвигают кадр
      </p>

      <div className={styles.controls}>
        <label htmlFor={zoomId} className={styles.zoomLabel}>
          Масштаб
        </label>
        <input
          id={zoomId}
          type="range"
          min="1"
          max={MAX_ZOOM}
          step="0.05"
          value={f.zoom}
          onChange={(e) => onChange({ ...f, zoom: Number(e.target.value) })}
          className={styles.zoom}
        />
        <button type="button" className={styles.btn} onClick={() => onChange(rotateFit(f))} aria-label={`Повернуть на 90°, сейчас ${f.rotate}°`}>
          <RotateCw size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" className={styles.btn} onClick={() => onChange(DEFAULT_FIT)} disabled={isDefaultFit(f)} aria-label="Сбросить кадр">
          <Undo2 size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
