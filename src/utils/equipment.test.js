import { describe, expect, it } from 'vitest';
import { anyLabel, equipmentItems } from './equipment.js';

describe('подписи техники', () => {
  it('обязательная — отдельно, «на выбор» — одним пунктом через «или»', () => {
    expect(anyLabel(['Духовка', 'Аэрогриль'])).toBe('Духовка или аэрогриль');
    expect(equipmentItems({ equipment: ['Плита'], equipmentAny: ['Духовка', 'Аэрогриль'] }).map((i) => i.label)).toEqual(['Плита', 'Духовка или аэрогриль']);
    expect(equipmentItems({ equipment: [], equipmentAny: [] })).toEqual([]);
    expect(equipmentItems({ equipment: ['Плита'] }).map((i) => i.label)).toEqual(['Плита']);
  });
});
