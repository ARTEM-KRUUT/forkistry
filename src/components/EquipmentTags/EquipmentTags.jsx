import { CookingPot, Shuffle } from 'lucide-react';
import { equipmentItems } from '../../utils/equipment.js';
import styles from './EquipmentTags.module.css';

/**
 * «Понадобится»: техника рецепта до начала готовки (Figma 8:342).
 * Обязательная — отдельными тегами, «на выбор» — одним тегом «Духовка или аэрогриль».
 */
export default function EquipmentTags({ recipe }) {
  const items = equipmentItems(recipe);
  return (
    <div className={styles.root}>
      <p className={styles.label}>Понадобится</p>
      {items.length ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.key} className={styles.tag} title={item.any ? 'Подойдёт любая из этой техники' : undefined}>
              {item.any ? <Shuffle size={16} strokeWidth={1.75} aria-hidden="true" /> : <CookingPot size={16} strokeWidth={1.75} aria-hidden="true" />}
              {item.label}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.none}>Без специальной техники</p>
      )}
    </div>
  );
}
