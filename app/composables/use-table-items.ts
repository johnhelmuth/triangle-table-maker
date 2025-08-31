

import defaultItems from "~/data/venture-city-items.json";
import type {ItemInterface} from "~/components/TriangleTable.vue";
import { TRIANGLE_TABLE_CELL_COUNT } from "~/utils/triangle-table-utils";

const LOCALSTORAGE_ITEMS_KEY = 'ttm-items';

let localStorage = undefined as Storage | undefined;

export default function useTableItems() {

  const items = reactive<ItemInterface[]>([...defaultItems]);

  onMounted(() => {
    localStorage = window.localStorage as Storage;
  })

  function getTableItems() {
    if (localStorage) {
      const lsItemsJSON = localStorage.getItem(LOCALSTORAGE_ITEMS_KEY);
      if (lsItemsJSON) {
        const lsItems = JSON.parse(lsItemsJSON);
        if (lsItems && Array.isArray(lsItems)) {
          items.splice(0, items.length);
          lsItems.forEach((item) => {items.push(item);});
          ensureTableItems();
        }
      }
    }
    return items;
  }

  function ensureTableItems() {
    while (items.length < TRIANGLE_TABLE_CELL_COUNT) {
      items.push({ name: ""});
    }
  }

  function saveTableItems() {
    if (localStorage) {
      ensureTableItems();
      const lsItems = items.map((item) => ({name: item.name} as ItemInterface));
      if (lsItems && Array.isArray(lsItems)) {
        localStorage.setItem(LOCALSTORAGE_ITEMS_KEY, JSON.stringify(lsItems));
        return true;
      }
    }
    return false;
  }

  function resetTableItems() {
    items.splice(0, items.length);
    defaultItems.forEach((item) => items.push(item));
  }

  return {items, getTableItems, saveTableItems, resetTableItems};
}
