import type {ItemListDirListInterface, RandomItemListInterface} from "~/models/RandomItemList";

export const ITEM_LIST_DIRECTORY_VERSION = '0.1';
export const RANDOM_ITEM_LIST_VERSION = '0.1';

export type VersionedInterface = {
  version: string;
  name?: string;
  title?: string;
}

/**
 * Migration handler for the ItemListDirectory data type.
 *
 * @param itemListDirectoryRaw {object} - The raw item list directory pulled from storage, an older version.
 *
 * @returns {[boolean, ItemListDirListInterface | undefined]} - The migrated raw data.
 */
export function migrateItemListDirectoryRaw(itemListDirectoryRaw: object | undefined | null): [boolean, ItemListDirListInterface | undefined] {
  return migrateRaw(itemListDirectoryRaw, 'ItemListDirListInterface', ITEM_LIST_DIRECTORY_VERSION, itemListDirectoryVersionMigrations);
}

/**
 * Migration handler for the RandomItemList data type.
 *
 * @param itemListRaw {object} - The raw item list pulled from storage, an older version.
 *
 * @returns {[boolean, RandomItemListInterface | undefined]} - The migrated raw data.
 */
export function migrateRandomItemListRaw(itemListRaw: object | undefined | null): [boolean, RandomItemListInterface | undefined] {
  return migrateRaw(itemListRaw, 'RandomItemListInterface', RANDOM_ITEM_LIST_VERSION, randomItemListVersionMigrations);
}


/**
 * Migration functions for the ItemListDirListInterface type.
 *
 * Currently this map of functions migrates from no version ('') to version '0.1'.
 */
const itemListDirectoryVersionMigrations = new Map<string, (arg: any) => ItemListDirListInterface>([
  [
    '', // Migrate from version '' to '0.1'
    (itemListDirectoryRaw) => {
      if (Object.hasOwn(itemListDirectoryRaw, 'currentListUuid')) {
        delete itemListDirectoryRaw['currentListUuid'];
      }
      itemListDirectoryRaw.version = '0.1';
      return itemListDirectoryRaw;
    }
  ],
  /**
   * When updating the schema for the item list directory, duplicate and uncomment the code below, write the migration there,
   * and update the value ITEM_LIST_DIRECTORY_VERSION above to '0.2'.
   *
   * [
   *   '0.1', // Migrate from version '0.1' to '0.2'
   *   (itemListDirectoryRaw) => {
   *     itemListDirectoryRaw.version = '0.2'
   *     return itemListDirectoryRaw;
   *   }
   * ]
   */
]);

/**
 * Migration functions for the RandomItemListInterface type.
 *
 * Currently this map of functions migrates from no version ('') to version '0.1'.
 */
const randomItemListVersionMigrations = new Map<string, (arg: any) => RandomItemListInterface>([

  /** Migrate from version '' to version '0.1'. */
  [
    '',
    (itemListRaw) => {
      itemListRaw.tableType = 'triangle';
      itemListRaw.version = '0.1';
      return itemListRaw;
    }
  ],

  /**
   * When updating the schema for the random item list, duplicate and uncomment the code below, write the migration there,
   * and update the value RANDOM_ITEM_LIST_VERSION above to '0.2'.
   *
   * /** Migrate from version '0.1' to '0.2' **\/
   * [
   *   '0.1',
   *   (itemListRaw) => {
   *     itemListRaw.version = '0.2'
   *     return itemListRaw;
   *   }
   * ]
   */
]);


/**
 * Migrate Raw data to a new version, of a specific type.
 *
 * This function steps of the `migrations` map of functions, passing the initial raw data to the next version in the
 * map.  It returns the final migrated data.
 *
 * @param raw {object | undefined | null} The raw data to be migrated.
 * @param typeName {string} The name of the data type, to be included in error messages.
 * @param CURRENT_VERSION {string} The version to be migrated to.
 * @param migrations - {Map<string, (arg: any) => T>}
 *      A Map of migration functions, keyed to the version to be migrated FROM. The empty string means unversioned.
 *      The migration function takes the raw object and migrates it to the current version at the time the migration
 *      function was written, and returns the migrated raw data.
 *      It is assumed that each function will migrate one step in the version history.
 *
 * @returns {T} - The migrated raw data.
 */
function migrateRaw<T extends VersionedInterface>(
  raw: object | undefined | null,
  typeName: string,
  CURRENT_VERSION: string,
  migrations: Map<string, (arg: any) => T>
): [boolean, T | undefined] {
  let isChanged = false;
  let updatedRaw = (raw || undefined) as T | undefined;
  if (updatedRaw && typeof updatedRaw === 'object') {
    const oldVersion = (updatedRaw?.version || '')
    if (oldVersion < CURRENT_VERSION) {
      for (const [fromVersion, migrateFunc] of migrations) {
        if (fromVersion < oldVersion) {
          // If oldVersion is '0.2' and current CURRENT_VERSION is '0.3',
          // and we have migrations from '' to '0.1', '0.1' to '0.2', '0.2' to '0.3', '0.3' to '0.4'...
          // we should skip '' to '0.1' and '0.1' to '0.2', and execute '0.2' to '0.3' and '0.3' to '0.4'
          continue;
        }
        updatedRaw = migrateFunc(updatedRaw);
        isChanged = true;
      }
    }
    if (updatedRaw) {
      if (updatedRaw?.version !== CURRENT_VERSION) {
        throw new Error(`${typeName} structure was not migrated. Version from storage: ${oldVersion}. Attempting to migrate to ${CURRENT_VERSION}.`);
      }
      if (isChanged) {
        console.log(`migrateRaw() ${typeName} ${updatedRaw?.title || updatedRaw?.name || 'object'} has been migrated to ${CURRENT_VERSION}.`);
      }
      return [isChanged, updatedRaw];
    }
  }
  console.log('migrateRaw() isChanged, undefined: ', isChanged, undefined);
  return [isChanged, undefined];
}