import { MessageStatus, TABS_STORAGE_KEY } from '@/lib/consts.ts';
import {StorageTabScheme, StorageTabsDictionary} from '@/lib/types.ts';

const IDLE_TAB_TIMOUT = 1000 * 60;
const TICK_IN_MILLISECONDS = 1000 * 6;
const TICK_IN_MINUTES = 0.1;

let domIsReady = false;

function sendTabsAreReadyMessage() {
  void chrome.runtime.sendMessage({ status: MessageStatus.TABS_ARE_READY });
}

async function removeTabFromStorage(key: string) {
  const tabs = (await chrome.storage.local.get(TABS_STORAGE_KEY))?.[TABS_STORAGE_KEY] as StorageTabsDictionary;
  delete tabs[key];

  return tabs;
}

void chrome.storage.local.clear();
void chrome.alarms.clearAll();

chrome.runtime.onMessage.addListener((message, _sender) => {
  console.log(message);

  if (message?.status === MessageStatus.DOM_IS_READY) {
    domIsReady = true;
  }
});

chrome.tabs.query({}, async (tabs) => {
  if (!tabs) {
    return;
  }
  
  const parsedTabs = {} as StorageTabsDictionary;

  for (const tab of tabs) {
    const url = tab.url as string;

    const tabAlarmCreated = await chrome.alarms.get(url);
    const wasParsed = parsedTabs[url];

    if (tabAlarmCreated && wasParsed) {
      continue;
    }

    const storageTabScheme: StorageTabScheme = {
      tab,
      timout: Math.random() * 10 + 10,
    };

    parsedTabs[url] = storageTabScheme;
    await chrome.alarms.create(url, { delayInMinutes: 0, periodInMinutes: TICK_IN_MINUTES });
  }

  await chrome.storage.local.set({ [TABS_STORAGE_KEY]: parsedTabs });

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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const tabs = (await chrome.storage.local.get(TABS_STORAGE_KEY))?.[TABS_STORAGE_KEY] as StorageTabsDictionary;
  const tabsItem = tabs?.[alarm.name];
  
  if (!tabsItem) {
    return;
  }

  tabsItem.timout = tabsItem.timout - TICK_IN_MILLISECONDS;
  await chrome.storage.local.set({ [TABS_STORAGE_KEY]: tabs });

  if (tabsItem.timout <= 0) {
    delete tabs[alarm.name];
    
    void chrome.tabs.remove(tabsItem.tab.id as number);
    void chrome.storage.local.set({ [TABS_STORAGE_KEY]: tabs });
    void chrome.alarms.clear(alarm.name);
    void removeTabFromStorage(alarm.name);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  console.log(changes, 'Message here to UI');
});