// Подписи техники рецепта: обязательная (equipment) и «на выбор» (equipmentAny — хватит одной).

/** «Духовка, Аэрогриль» → «Духовка или аэрогриль». */
export function anyLabel(list = []) {
  if (!list.length) return '';
  return list.map((e, i) => (i === 0 ? e : e.toLowerCase())).join(' или ');
}

/** Пункты для «Понадобится»: каждая обязательная техника отдельно, вся «на выбор» — одним пунктом. */
export function equipmentItems(recipe) {
  const items = (recipe.equipment ?? []).map((e) => ({ key: e, label: e }));
  const any = (recipe.equipmentAny ?? []).filter((e) => !(recipe.equipment ?? []).includes(e));
  if (any.length) items.push({ key: `any:${any.join('|')}`, label: anyLabel(any), any: true });
  return items;
}
