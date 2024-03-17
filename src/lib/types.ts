export interface StorageTabScheme {
  tab: chrome.tabs.Tab;
  timeout: number;
}

export type StorageTabsDictionary = Record<string, StorageTabScheme>;