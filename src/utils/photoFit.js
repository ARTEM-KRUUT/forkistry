// Настройки показа фото: какая часть кадра видна, масштаб и поворот.
// Само изображение не меняется (храним только ссылку) — меняется то, как его показать.
// { x, y } — точка кадра в процентах (как object-position), zoom — 1…3, rotate — 0 | 90 | 180 | 270.

export const DEFAULT_FIT = { x: 50, y: 50, zoom: 1, rotate: 0 };
export const MAX_ZOOM = 3;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Привести к допустимым значениям (данные с сервера могут быть неполными). */
export function normalizeFit(fit) {
  if (!fit || typeof fit !== 'object') return DEFAULT_FIT;
  const rotate = ((Math.round((Number(fit.rotate) || 0) / 90) * 90) % 360 + 360) % 360;
  return {
    x: clamp(Number.isFinite(+fit.x) ? +fit.x : 50, 0, 100),
    y: clamp(Number.isFinite(+fit.y) ? +fit.y : 50, 0, 100),
    zoom: clamp(Number.isFinite(+fit.zoom) ? +fit.zoom : 1, 1, MAX_ZOOM),
    rotate,
  };
}

export const isDefaultFit = (fit) => {
  const f = normalizeFit(fit);
  return f.x === 50 && f.y === 50 && f.zoom === 1 && f.rotate === 0;
};

/**
 * Стили для Photo: box — поворачиваемый слой, img — кадрирование и масштаб.
 * Масштаб идёт от выбранной точки кадра, поэтому она остаётся на месте при приближении.
 */
export function fitStyles(fit) {
  const f = normalizeFit(fit);
  const sideways = f.rotate === 90 || f.rotate === 270;
  return {
    box: {
      transform: `translate(-50%, -50%)${f.rotate ? ` rotate(${f.rotate}deg)` : ''}`,
      ...(sideways ? { width: '100cqh', height: '100cqw' } : null),
    },
    img: {
      objectPosition: `${f.x}% ${f.y}%`,
      ...(f.zoom !== 1 ? { transform: `scale(${f.zoom})`, transformOrigin: `${f.x}% ${f.y}%` } : null),
    },
  };
}

/**
 * Сдвиг кадра перетаскиванием: экранное смещение (px) → изменение точки кадра.
 * Учитывает поворот (оси картинки повёрнуты относительно экрана) и масштаб.
 */
export function panFit(fit, dx, dy, frameW, frameH) {
  const f = normalizeFit(fit);
  const rad = (-f.rotate * Math.PI) / 180;
  const ix = dx * Math.cos(rad) - dy * Math.sin(rad);
  const iy = dx * Math.sin(rad) + dy * Math.cos(rad);
  const sideways = f.rotate === 90 || f.rotate === 270;
  const w = sideways ? frameH : frameW;
  const h = sideways ? frameW : frameH;
  // Тянем картинку вправо — видим её левую часть, точка кадра уходит влево
  const k = 150 / f.zoom;
  return {
    ...f,
    x: clamp(Math.round((f.x - (ix / w) * k) * 10) / 10, 0, 100),
    y: clamp(Math.round((f.y - (iy / h) * k) * 10) / 10, 0, 100),
  };
}

export const rotateFit = (fit) => {
  const f = normalizeFit(fit);
  return { ...f, rotate: (f.rotate + 90) % 360 };
};
