import {
  SQLiteStorageSetItemUpdateFunction,
  Storage,
} from 'expo-sqlite/kv-store';

export const getItemAsync = async (key: string) => {
  const value = await Storage.getItem(key);

  return value;
};

export const getItemSync = (key: string) => {
  const value = Storage.getItemSync(key);

  return value;
};

export const setItemAsync = async (
  key: string,
  value: string | SQLiteStorageSetItemUpdateFunction
) => {
  await Storage.setItem(key, value);
};

export const setItemSync = (
  key: string,
  value: string | SQLiteStorageSetItemUpdateFunction
) => {
  Storage.setItemSync(key, value);
};

export const deleteItemAsync = (key: string) => {
  Storage.removeItemAsync(key);
};
