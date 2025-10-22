
export interface ItemInterface {
  name: string;
  index?: number;
  probability?: number;
  d100Range?: number[];
}

export type TableTypeType = 'triangle';

export interface RandomItemListInterface {
  uuid: string;
  title: string;
  version: string;
  items: ItemInterface[];
  tableType: TableTypeType;
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
  version: string;
  entries: Array<ItemListDirItemInterface>;
  lastUpdated: number;
}


export function isItemList(itemList: any) : itemList is RandomItemListInterface {
  if (itemList && typeof itemList === "object" &&
    "title" in itemList && typeof itemList.title === "string" &&
    "version" in itemList && typeof itemList.version === "string" &&
    "items" in itemList && Array.isArray(itemList.items) &&
    "uuid" in itemList && typeof itemList.uuid === "string" &&
    "tableType" in itemList && typeof itemList.tableType === "string" && itemList.tableType === 'triangle'
  ) {
    return true;
  }
  return false;
}

export function isItemListDirectory(itemListDirectory: any) : itemListDirectory is ItemListDirListInterface {
  if (itemListDirectory && typeof itemListDirectory === 'object' &&
    'version' in itemListDirectory && typeof itemListDirectory.version === "string" &&
    'lastUpdated' in itemListDirectory && typeof itemListDirectory.lastUpdated === 'number' &&
    'entries' in itemListDirectory && Array.isArray(itemListDirectory.entries)
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