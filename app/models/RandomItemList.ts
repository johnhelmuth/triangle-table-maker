
export interface ItemInterface {
  name: string;
  index?: number;
  probability?: number;
  d100Range?: number[];
}

export interface RandomItemListInterface {
  uuid: string;
  title: string;
  items: ItemInterface[];
  probabilityMax: number;
}

export interface ItemListDirItemInterface {
  title: string;
  key: string;
  uuid: string;
  lastUpdated: number;
  loaded?: boolean;
  itemList?: RandomItemListInterface;
}

export interface ItemListDirListInterface {
  entries: Array<ItemListDirItemInterface>;
  currentListUuid: string;
  lastUpdated: number;
}


export function isItemList(itemList: any) : itemList is RandomItemListInterface {
  if (itemList && typeof itemList === "object" &&
    "title" in itemList && typeof itemList.title === "string" &&
    "items" in itemList && Array.isArray(itemList.items) &&
    "uuid" in itemList && typeof itemList.uuid === "string"
  ) {
    return true;
  }
  return false;
}

export function isItemListDirectory(itemListDirectory: any) : itemListDirectory is ItemListDirListInterface {
  if (itemListDirectory && typeof itemListDirectory === 'object' &&
    'lastUpdated' in itemListDirectory && typeof itemListDirectory.lastUpdated === 'number' &&
    'entries' in itemListDirectory && Array.isArray(itemListDirectory.entries) &&
    'currentListUuid' in itemListDirectory && typeof itemListDirectory.currentListUuid === 'string'
  ) {
    return true;
  }
  return false;
}

export function isItemListDirItem(itemListDirItem: any) : itemListDirItem is ItemListDirItemInterface {
  if (itemListDirItem && typeof itemListDirItem === 'object' &&
    'title' in itemListDirItem && typeof itemListDirItem.title === 'string' &&
    'key' in itemListDirItem && typeof itemListDirItem.key === 'string' &&
    'uuid' in itemListDirItem && typeof itemListDirItem.uuid === 'string'
  ) {
    return true;
  }
  return false;
}