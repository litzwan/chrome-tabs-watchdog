export interface StorageTabScheme {
  tab: chrome.tabs.Tab;
  timout: number;
}

export type StorageTabsDictionary = Record<string, StorageTabScheme>;