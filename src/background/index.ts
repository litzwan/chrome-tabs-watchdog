import { MessageStatus } from '@/lib/messageStatus.ts';
import { TICK_IN_MILLISECONDS } from './const.ts';
import Storage from './storage.ts';
import Alarm from './alarm.ts';

const storage = new Storage();
const alarm = new Alarm();

let domIsReady = false;
let activeTabs: Record<string, chrome.tabs.Tab> = {};

function sendTabsAreReadyMessage() {
  void chrome.runtime.sendMessage({ status: MessageStatus.TABS_ARE_READY });
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
void alarm.clear();

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
  await alarm.init(...tabs);
  
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
  await alarm.create(tabId);
  
  await chrome.runtime.sendMessage({ status: MessageStatus.UPDATE_TABS });
});

chrome.tabs.onActivated.addListener(async(activeInfo) => {
  activeTabs = await getActiveTabs();

  await storage.reset(activeInfo.tabId);
  await alarm.update(activeInfo.tabId);

  await chrome.runtime.sendMessage({ status: MessageStatus.UPDATE_TABS });
});

chrome.alarms.onAlarm.addListener(async (a) => {
  const tab = storage.resolve(a.name);

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
    await alarm.remove(a.name);
  }
});

chrome.storage.onChanged.addListener((_changes) => {
  // console.log(changes, 'Message here to UI');
});