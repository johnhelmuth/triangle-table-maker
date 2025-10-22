import {v4 as uuidv4} from 'uuid';
import ventureCityPowers from "~/data/fate-codex-3-3-random-character-creation/venture-city-superpowers.json";
import ventureCityUpbringing from "~/data/fate-codex-3-3-random-character-creation/venture-city-upbringing.json";
import ventureCityCareerCorp from "~/data/fate-codex-3-3-random-character-creation/venture-city-career-corporate.json";
import ventureCityCareerNonCorp
  from "~/data/fate-codex-3-3-random-character-creation/venture-city-career-non-corporate.json";
import ventureCityTrouble from "~/data/fate-codex-3-3-random-character-creation/venture-city-trouble.json";
import AtoPPersonalComplications from "~/data/according-to-plan/personal-complications.json";
import AtoPEnvironmentalComplications from "~/data/according-to-plan/environmental-complications.json";

import {
  isItemList,
  isItemListDirectory,
  isItemListDirItem,
  type ItemInterface,
  type ItemListDirItemInterface,
  type ItemListDirListInterface,
  type RandomItemListInterface,
  type TableTypeType
} from "~/models/RandomItemList";
import {TRIANGLE_TABLE_CELL_COUNT} from "~/utils/triangle-table-utils";
import {ITEM_LIST_DIRECTORY_VERSION, migrateItemListDirectoryRaw, RANDOM_ITEM_LIST_VERSION} from "~/utils/migrations";

const defaultItemLists = [
  ventureCityUpbringing,
  ventureCityPowers,
  ventureCityCareerCorp,
  ventureCityCareerNonCorp,
  ventureCityTrouble,
  AtoPPersonalComplications,
  AtoPEnvironmentalComplications
] as RandomItemListInterface[];

const defaultItems = defaultItemLists[0] as RandomItemListInterface;

const LOCALSTORAGE_ITEMS_KEY = 'ttm-random-items';
const LOCALSTORAGE_ITEMS_DIR_KEY = 'ttm-random-items-directory';

const itemListDirectory = reactive<ItemListDirListInterface>({
  version: ITEM_LIST_DIRECTORY_VERSION,
  lastUpdated: 0,
  entries: [] as Array<ItemListDirItemInterface>
});

export default function useTableItems() {

  const {getLocalStorage, hasLocalStorage} = useLocalStorage();

  onMounted(() => {
    if (import.meta.client) {
      initializeStorage();
    }
  })

  function initializeStorage() {
    if (hasLocalStorage()) {
      const lsItemDirectoryJSON = getLocalStorage().getItem(LOCALSTORAGE_ITEMS_DIR_KEY);
      if (lsItemDirectoryJSON) {
        const [isChanged, lsItemDirectory] = migrateItemListDirectoryRaw(JSON.parse(lsItemDirectoryJSON));
        if (isItemListDirectory(lsItemDirectory)) {
          itemListDirectory.lastUpdated = lsItemDirectory.lastUpdated;
          itemListDirectory.entries.splice(0, itemListDirectory.entries.length);
          lsItemDirectory.entries.forEach((entry) => {
            if (isItemListDirItem(entry)) {
              itemListDirectory.entries.push(entry);
            }
          })
        }
        if (isChanged) {
          saveDirectory();
        }
      } else {
        initializeDefaultDirectory();
      }
    }
  }

  function initializeDefaultDirectory() {
    defaultItemLists.forEach(saveItemList)
  }

  function findDirEntry(uuid?: string) {
    return itemListDirectory.entries
        .find((entry) => {
          return entry.uuid === uuid
        });
  }

  function findDirEntryIndex(uuid: string) {
    return itemListDirectory.entries.findIndex((entry) => entry.uuid === uuid);
  }

  function hasItemList(uuid: string) {
    return !!(findDirEntry(uuid));
  }

  function getItemList(uuid?: string) {
    const dirEntry = findDirEntry(uuid);
    if (dirEntry) {
      if (dirEntry?.loaded && isItemList(dirEntry?.itemList)) {
        return dirEntry.itemList;
      }
      const lsItemsJSON = getLocalStorage().getItem(dirEntry.key);
      if (lsItemsJSON) {
        const [isChanged, lsItems] = migrateRandomItemListRaw(JSON.parse(lsItemsJSON));
        if (lsItems && isItemList(lsItems) && lsItems.uuid === dirEntry.uuid) {
          ensureTriangleTable(lsItems);
          dirEntry.loaded = true;
          dirEntry.itemList = lsItems;
          if (isChanged) {
            saveItemList(lsItems);
          }
          saveDirectory();
          return dirEntry.itemList;
        }
      }
    }
  }

  function deleteItemList(uuid: string) {
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

  function saveItemList(itemList: RandomItemListInterface) {
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
      itemListDirectory.entries.push(newEntry);
    } else {
      console.log('saveDirEntry() dirEntry before update: ', dirEntry);
      dirEntry.title = itemList.title;
      dirEntry.lastUpdated = Date.now();
      console.log('saveDirEntry() dirEntry after update: ', dirEntry);
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

  function createNewItemList() {
    const newIL = {
      uuid: uuidv4(),
      title: 'New title',
      version: RANDOM_ITEM_LIST_VERSION,
      tableType: 'triangle' as TableTypeType,
      probabilityMax: defaultItems.probabilityMax,
      items: [] as ItemInterface[],
    };
    ensureTriangleTable(newIL);
    saveItemList(newIL);
    return newIL;
  }

  function resetToDefault() {
    itemListDirectory.entries.forEach(itemList => {
      getLocalStorage().removeItem(getKey(itemList.uuid));
    })
    itemListDirectory.entries = [];
    initializeDefaultDirectory();
  }

  return {
    itemListDirectory,
    getItemList,
    saveItemList,
    createNewItemList,
    deleteItemList,
    hasItemList,
    resetToDefault
  };
}
