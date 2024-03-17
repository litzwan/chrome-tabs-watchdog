import { MessageStatus, TABS_STORAGE_KEY } from '@/lib/consts.ts';
import { StorageTabScheme, StorageTabsDictionary} from '@/lib/types.ts';
import {
  IDLE_TAB_TIMEOUT,
  TICK_IN_MILLISECONDS,
  TICK_IN_MINUTES,
  DELAY_IN_MINUTES,
} from './const.ts';
import Storage from './storage.ts';

const storage = new Storage();

let domIsReady = false;
let activeTabs: Record<string, chrome.tabs.Tab> = {};

function sendTabsAreReadyMessage() {
  void chrome.runtime.sendMessage({ status: MessageStatus.TABS_ARE_READY });
}

async function getTabsFromStorage() {
  return (await chrome.storage.local.get(TABS_STORAGE_KEY))?.[TABS_STORAGE_KEY] as StorageTabsDictionary;
}

async function getActiveTabs() {
  return new Promise<Record<string, chrome.tabs.Tab>>((resolve) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      tabs.forEach((tab) => {
        activeTabs[tab.id as number] = tab;
      });
      resolve(activeTabs);
    });
  });
}

void storage.clear();
void chrome.alarms.clearAll();

chrome.runtime.onMessage.addListener((message, _sender) => {
  console.log('background', message);

  if (message?.status === MessageStatus.DOM_IS_READY) {
    domIsReady = true;
  }
});

chrome.tabs.query({}, async (tabs) => {
  if (!tabs) {
    return;
  }
  
  await storage.init(...tabs);
  
  for (const tab of tabs) {
    const tabId = String(tab.id as number);
    const tabAlarmCreated = await chrome.alarms.get(tabId);
    
    if (tabAlarmCreated) {
      return;
    }
    
    await chrome.alarms.create(tabId, { delayInMinutes: DELAY_IN_MINUTES, periodInMinutes: TICK_IN_MINUTES });
  }
  
  activeTabs = await getActiveTabs();

  if (domIsReady) {
    sendTabsAreReadyMessage();
    return;
  }

  const interval = setInterval(() => {
    if (domIsReady) {
      sendTabsAreReadyMessage();
      clearInterval(interval);
    }
  }, 100);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  const tabId = String(tab.id as number);
  
  await storage.save(tab);
  await chrome.alarms.create(tabId, { delayInMinutes: DELAY_IN_MINUTES, periodInMinutes: TICK_IN_MINUTES });
});

chrome.tabs.onActivated.addListener(async(activeInfo) => {
  activeTabs = await getActiveTabs();
  
  const tabs = storage.getTabs;
  const tabId = String(activeInfo.tabId);
  
  if (!tabs[tabId]) {
    return;
  }
  
  await storage.reset(activeInfo.tabId);
  await chrome.alarms.clear(tabId);
  await chrome.alarms.create(tabId, { delayInMinutes: DELAY_IN_MINUTES, periodInMinutes: TICK_IN_MINUTES });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const tab = storage.resolve(alarm.name);

  if (!tab) {
    return;
  }

  tab.timeout = tab.timeout - TICK_IN_MILLISECONDS;
  console.log(tab, 'tabItem Alarm');
  await storage.update(tab);
  
  if (tab.tab.url === 'chrome://extensions/') {
    return;
  }

  if (tab.timeout <= 0) {
    await chrome.tabs.remove(tab.tab.id as number);
    await storage.remove(tab.tab.id);
    await chrome.alarms.clear(alarm.name);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  // console.log(changes, 'Message here to UI');
});