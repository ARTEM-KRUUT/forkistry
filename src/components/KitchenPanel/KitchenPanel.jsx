import Chip from '../Chip/Chip.jsx';
import { useFilters } from '../../context/FiltersContext.jsx';
import { EQUIPMENT } from '../../data/constants.js';
import styles from './KitchenPanel.module.css';

/** «Что есть на кухне» (Figma 16:704). Выбор общий с фильтром техники в каталоге. */
export default function KitchenPanel() {
  const { filters, toggleEquipment } = useFilters();

  return (
    <section className={styles.panel} aria-labelledby="kitchen-title">
      <div className={styles.text}>
        <h2 id="kitchen-title" className={styles.title}>
          Что есть на кухне
        </h2>
        <p className={styles.hint}>Покажем только то, что получится приготовить</p>
      </div>
      <div className={styles.chips} role="group" aria-labelledby="kitchen-title">
        {EQUIPMENT.map((item) => (
          <Chip key={item} active={filters.equipment.includes(item)} onClick={() => toggleEquipment(item)}>
            {item}
          </Chip>
        ))}
      </div>
    </section>
  );
}
