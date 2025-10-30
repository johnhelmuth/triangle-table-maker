import {getCellProbability} from "~/utils/triangle-table-utils";

export interface ItemInterface {
  name: string;
  index?: number;
  probability?: number;
  d100Range?: number[];
}

export type TableTypeType = 'triangle';

export interface ItemListInterface {
  uuid: string;
  title: string;
  version: string;
  tableType: TableTypeType;
  probabilityMax: number;
}

export interface RandomItemListInterface extends ItemListInterface {
  items: ItemInterface[];
}

export interface TriangleListInterface extends ItemListInterface {
  items: ItemInterface[][];
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

export function listToTriangle(itemList: RandomItemListInterface): TriangleListInterface {
  const rows = [] as Array<Array<ItemInterface>>;
  let row = [] as Array<ItemInterface>;
  let rowCols = 4;
  let cols = rowCols;

  let index = 0;
  for (const item of itemList.items) {
    row.push({
      ...item,
      index,
      probability: getCellProbability(4 - rowCols, rowCols - cols),
    });
    index++;
    if (cols < 1) {
      rows.push(row);
      row = [] as Array<ItemInterface>;
      rowCols--;
      cols = rowCols;
    } else {
      cols--;
    }
  }
  if (row.length) {
    rows.push(row);
  }
  const triangleList = {
    ...itemList,
    items: rows,
  } as TriangleListInterface;
  return triangleList;
}