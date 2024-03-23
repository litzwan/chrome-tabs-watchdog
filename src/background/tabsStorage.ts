import { type TabId } from '@/lib/types.ts';
import { IDLE_TAB_TIMEOUT, TABS_STORAGE_KEY } from './const.ts';

export interface StorageTabScheme {
  tab: chrome.tabs.Tab;
  isPaused: boolean;
  timeout: number;
}

export type StorageTabsDictionary = Record<string, StorageTabScheme>;

class TabsStorage {
  protected tabs: StorageTabsDictionary = {};
  
  async init(...tabs: chrome.tabs.Tab[]) {
    tabs.forEach((tab) => {
      this.tabs[tab.id as number] = this.factory(tab);
    });
    
    await chrome.storage.local.set({ [TABS_STORAGE_KEY]: this.tabs });
  }
  
  resolve(tabId: TabId): StorageTabScheme | null {
    const tab = this.tabs[tabId as number];
    
    if (!tab) {
      return null;
    }
    
    return tab;
  }
  
  async save(tab: chrome.tabs.Tab) {
    this.tabs[tab.id as number] = this.factory(tab);

    await chrome.storage.local.set({ [TABS_STORAGE_KEY]: this.tabs });
  }
  
  async update(tab: StorageTabScheme) {
    this.tabs[tab.tab.id as number] = tab;
    await chrome.storage.local.set({ [TABS_STORAGE_KEY]: this.tabs });
  }
  
  async reset(tabId: TabId) {
    const tab = this.tabs[tabId as number];
    
    if(!tab) {
      return;
    }

    tab.timeout = IDLE_TAB_TIMEOUT;
    await chrome.storage.local.set({ [TABS_STORAGE_KEY]: this.tabs });
  }
  
  async remove(tabId: TabId) {
    const tab = this.tabs[tabId as number];
    
    if(!tab) {
      return;
    }
    
    delete this.tabs[tabId as number];
    await chrome.storage.local.set({ [TABS_STORAGE_KEY]: this.tabs });
  }
  
  async sync() {
    this.tabs = (await chrome.storage.local.get(TABS_STORAGE_KEY))[TABS_STORAGE_KEY] as StorageTabsDictionary;
  }
  
  async clear() {
    this.tabs = {};
    await chrome.storage.local.clear();
  }

  factory(tab: chrome.tabs.Tab): StorageTabScheme {
    return {
      tab,
      isPaused: false,
      timeout: IDLE_TAB_TIMEOUT,
    };
  }
  
  get getTabs() {
    return this.tabs;
  }
}

export default TabsStorage;