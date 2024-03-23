import { type TabId } from '@/lib/types.ts';
import {
  TICK_IN_MINUTES,
  DELAY_IN_MINUTES,
} from './const.ts';

class TabsAlarm {
  
  async init(...tabs: chrome.tabs.Tab[]) {
    for (const tab of tabs) {
      await this.create(tab.id);
    }
  }
  
  async create(tabId: TabId) {
    if (!tabId) {
      return;
    }
    
    await chrome.alarms.create(String(tabId), { delayInMinutes: DELAY_IN_MINUTES, periodInMinutes: TICK_IN_MINUTES });
  }
  
  async recreate(tabId: TabId) {
    if (!tabId) {
      return;
    }
    
    await this.remove(tabId);
    await this.create(tabId);
  }
  
  async remove(tabId: TabId) {
    if (!tabId) {
      return;
    }
    
    await chrome.alarms.clear(String(tabId));
  }
  
  async clear() {
    await chrome.alarms.clearAll();
  }
}

export default TabsAlarm;
