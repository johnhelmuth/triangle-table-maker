import {v4 as uuidv4} from 'uuid';
import defaultItems from "~/data/venture-city-items.json";
import {
  type ItemInterface,
  type RandomItemListInterface,
  type ItemListDirItemInterface,
  type ItemListDirListInterface,
  isItemListDirectory, isItemList, isItemListDirItem
} from "~/models/RandomItemList";
import {TRIANGLE_TABLE_CELL_COUNT} from "~/utils/triangle-table-utils";

const LOCALSTORAGE_ITEMS_KEY = 'ttm-random-items';
const LOCALSTORAGE_ITEMS_DIR_KEY = 'ttm-random-items-directory';

export default function useTableItems() {

  const itemListDirectory = reactive<ItemListDirListInterface>({
    lastUpdated: 0,
    currentListUuid: 'default',
    entries: [] as Array<ItemListDirItemInterface>
  });

  const {getLocalStorage, hasLocalStorage} = useLocalStorage();

  const itemList = reactive<RandomItemListInterface>(structuredClone(defaultItems));
  itemList.uuid = uuidv4();

  onMounted(() => {
    initializeStorage();
  })

  function initializeStorage() {
    initializeDirectory();
    initializeCurrentTableItems();
  }

  function initializeDirectory() {
    if (hasLocalStorage()) {
      const lsItemDirectoryJSON = getLocalStorage().getItem(LOCALSTORAGE_ITEMS_DIR_KEY);
      if (lsItemDirectoryJSON) {
        const lsItemDirectory = JSON.parse(lsItemDirectoryJSON);
        if (isItemListDirectory(lsItemDirectory)) {
          itemListDirectory.currentListUuid = lsItemDirectory.currentListUuid;
          itemListDirectory.lastUpdated = lsItemDirectory.lastUpdated;
          itemListDirectory.entries.splice(0, itemListDirectory.entries.length);
          lsItemDirectory.entries.forEach((entry) => {
            if (isItemListDirItem(entry)) {
              itemListDirectory.entries.push(entry);
            }
          })
        }
      }
    }
  }

  function findDirEntry(uuid: string) {
    return itemListDirectory.entries
      .find((entry) => entry.uuid === uuid);
  }

  function findDirEntryIndex(uuid: string) {
    return itemListDirectory.entries.
      findIndex((entry) => entry.uuid === uuid);
  }

  function initializeCurrentTableItems() {
    if (hasLocalStorage()) {
      if (itemListDirectory.currentListUuid === itemList.uuid) {
        // First time this has been run on a given browser, or has already been loaded.
        return itemList;
      }
      const lsItems = getItemList(itemListDirectory.currentListUuid);
      if (lsItems && isItemList(lsItems) && lsItems.uuid === itemListDirectory.currentListUuid) {
        loadItemList(lsItems)
      }
    }
    return itemList;
  }

  function getItemList(uuid: string) {
    const dirEntry = findDirEntry(uuid);
    if (dirEntry) {
      if (dirEntry?.loaded && isItemList(dirEntry?.itemList)) {
        return dirEntry.itemList;
      }
      const lsItemsJSON = getLocalStorage().getItem(dirEntry.key);
      if (lsItemsJSON) {
        const lsItems = JSON.parse(lsItemsJSON);
        if (lsItems && isItemList(lsItems) && lsItems.uuid === dirEntry.uuid) {
          ensureTriangleTable(lsItems);
          dirEntry.loaded = true;
          dirEntry.itemList = lsItems;
          saveDirectory();
          return lsItems;
        }
      }
    }
  }

  function deleteItemList(uuid: string) {
    if (isActive(uuid)) {
      return;
    }
    const dirEntryIndex = findDirEntryIndex(uuid);
    if (dirEntryIndex >= 0) {
      const dirEntry = itemListDirectory.entries[dirEntryIndex];
      if (dirEntry && dirEntry.uuid === uuid) {
        getLocalStorage().removeItem(getKey(uuid));
        itemListDirectory.entries.splice(dirEntryIndex, 1)
        saveDirectory();
      }
    }
  }

  function saveItemList() {
    if (hasLocalStorage()) {
      ensureTriangleTable(itemList);
      if (itemList.uuid === 'default') {
        itemList.uuid = uuidv4();
      }
      const lsItemList = {
        ...itemList,
        items: itemList.items.map((item) => ({name: item.name} as ItemInterface))
      }
      if (lsItemList && isItemList(lsItemList)) {
        getLocalStorage().setItem(getKey(itemList.uuid), JSON.stringify(lsItemList));
        saveDirEntry(itemList);
        return true;
      }
    }
    return false;
  }

  function ensureTriangleTable(anItemList: RandomItemListInterface) {
    while (anItemList.items.length < TRIANGLE_TABLE_CELL_COUNT) {
      anItemList.items.push({name: ""});
    }
  }

  function getKey(uuid: string): string {
    return `${LOCALSTORAGE_ITEMS_KEY}:${uuid}`;
  }

  function saveDirEntry(itemList: RandomItemListInterface) {
    const dirEntry = findDirEntry(itemList.uuid);
    if (!dirEntry) {
      const newEntry = {
        title: itemList.title,
        uuid: itemList.uuid,
        key: getKey(itemList.uuid),
        lastUpdated: Date.now(),
      }
      itemListDirectory.currentListUuid = newEntry.uuid;
      itemListDirectory.entries.push(newEntry);
    } else {
      dirEntry.title = itemList.title;
      dirEntry.lastUpdated = Date.now();
    }
    saveDirectory();
  }

  function saveDirectory() {
    if (hasLocalStorage()) {
      const lsItemListDirectory = structuredClone(toRaw(itemListDirectory));
      lsItemListDirectory.entries = itemListDirectory.entries.map(e => ({
        title: e.title, key: e.key, uuid: e.uuid, lastUpdated: e.lastUpdated,
      }));
      lsItemListDirectory.lastUpdated = Date.now();
      getLocalStorage().setItem(LOCALSTORAGE_ITEMS_DIR_KEY, JSON.stringify(lsItemListDirectory));
      itemListDirectory.lastUpdated = lsItemListDirectory.lastUpdated;
    }
  }

  function loadItemList(newIL: RandomItemListInterface) {
    if (newIL.uuid === 'default') {
      itemList.uuid = uuidv4();
    } else {
      itemList.uuid = newIL.uuid;
    }
    itemList.title = newIL.title;
    itemList.probabilityMax = newIL.probabilityMax;
    itemList.items.splice(0, itemList.items.length);
    newIL.items.forEach((item) => {
      itemList.items.push(item)
    });
    itemListDirectory.currentListUuid = itemList.uuid;
  }

  function loadItemListByUuid(uuid: string) {
    const loadedItemList = getItemList(uuid);
    if (loadedItemList && isItemList(loadedItemList)) {
      loadItemList(loadedItemList);
      saveDirectory();
    }
  }

  function createNewItemList() {
    const newIL = {
      uuid: uuidv4(),
      title: 'New title',
      probabilityMax: defaultItems.probabilityMax,
      items: [] as ItemInterface[],
    };
    ensureTriangleTable(newIL);
    if (itemListDirectory.entries.length === 0) {
      saveItemList();
    }
    loadItemList(newIL);
    saveItemList();
  }

  function isActive(uuid: string): boolean {
    return uuid === itemListDirectory.currentListUuid;
  }

  return {
    itemList,
    itemListDirectory,
    saveItemList,
    createNewItemList,
    loadItemListByUuid,
    deleteItemList
  };
}
