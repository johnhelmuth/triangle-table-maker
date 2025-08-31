

import defaultItems from "~/data/venture-city-items.json";
import type {ItemInterface, RandomItemListInterface} from "~/models/RandomItemList";
import { TRIANGLE_TABLE_CELL_COUNT } from "~/utils/triangle-table-utils";

const LOCALSTORAGE_ITEMS_KEY = 'ttm-random-items';

let localStorage = undefined as Storage | undefined;

function isItemList(itemList: any) : itemList is RandomItemListInterface {
  if (itemList && typeof itemList === "object" &&
      "title" in itemList && typeof itemList.title === "string" &&
      "items" in itemList && Array.isArray(itemList.items)
  ) {
    return true;
  }
  return false;
}

export default function useTableItems() {

  const itemList = reactive<RandomItemListInterface>(structuredClone(defaultItems));

  onMounted(() => {
    localStorage = window.localStorage as Storage;
  })

  function getItemList() {
    if (localStorage) {
      const lsItemsJSON = localStorage.getItem(LOCALSTORAGE_ITEMS_KEY);
      if (lsItemsJSON) {
        const lsItems = JSON.parse(lsItemsJSON);
        if (lsItems && isItemList(lsItems)) {
          itemList.title = lsItems.title;
          itemList.probabilityMax = lsItems.probabilityMax;
          itemList.items.splice(0, itemList.items.length);
          lsItems.items.forEach((item) => {itemList.items.push(item);});
          ensureItemList();
        }
      }
    }
    return itemList;
  }

  function ensureItemList() {
    while (itemList.items.length < TRIANGLE_TABLE_CELL_COUNT) {
      itemList.items.push({ name: ""});
    }
  }

  function saveItemList() {
    if (localStorage) {
      ensureItemList();
      const lsItemList = {
        ...itemList,
        items: itemList.items.map((item) => ({name: item.name} as ItemInterface))
      }
      if (lsItemList && isItemList(lsItemList)) {
        localStorage.setItem(LOCALSTORAGE_ITEMS_KEY, JSON.stringify(lsItemList));
        return true;
      }
    }
    return false;
  }

  function resetItemList() {
    itemList.title = defaultItems.title;
    itemList.probabilityMax = defaultItems.probabilityMax;
    itemList.items.splice(0, itemList.items.length);
    defaultItems.items.forEach((item) => itemList.items.push(structuredClone(item)));
    ensureItemList();
  }

  return {itemList, getItemList, saveItemList, resetItemList};
}
