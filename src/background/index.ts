import { MessageStatus } from '@/lib/messageStatus.ts';
import {IDLE_TAB_TIMEOUT, TICK_IN_MILLISECONDS} from './const.ts';
import TabsStorage from './tabsStorage.ts';
import TabsAlarm from './tabsAlarm.ts';

const tabsStorage = new TabsStorage();
const tabsAlarm = new TabsAlarm();

const activeTabs: Record<string, chrome.tabs.Tab> = {};
let domIsReady = false;

async function sendMessageToPopup(message: Record<string, unknown>) {
  if (!domIsReady) {
    return;
  }
  
  await chrome.runtime.sendMessage(message);
}

async function queryActiveTabs() {
  return new Promise<Record<string, chrome.tabs.Tab>>((resolve) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      tabs.forEach((tab) => {
        activeTabs[tab.id as number] = tab;
      });
      console.log(activeTabs, 'activeTabs');
      resolve(activeTabs);
    });
  });
}

async function pauseActiveTabs() {
  for (const [tabId, tab] of Object.entries(activeTabs)) { 
    await tabsStorage.update({ tab, isPaused: true, timeout: IDLE_TAB_TIMEOUT });
    await tabsAlarm.remove(tabId);
  }
}

async function unpauseActiveTabs() {
  for (const [tabId, tab] of Object.entries(activeTabs)) {
    await tabsStorage.update({ tab, isPaused: false, timeout: IDLE_TAB_TIMEOUT });
    await tabsAlarm.create(tabId);
  }
}

void tabsStorage.clear();
void tabsAlarm.clear();

chrome.tabs.query({}, async (tabs) => {
  if (!tabs) {
    return;
  }
  
  await tabsStorage.init(...tabs);
  await tabsAlarm.init(...tabs);
  
  await queryActiveTabs();
  await pauseActiveTabs();

  if (domIsReady) {
    await sendMessageToPopup({ status: MessageStatus.TABS_ARE_READY });
    return;
  }

  const interval = setInterval(() => {
    if (domIsReady) {
      void sendMessageToPopup({ status: MessageStatus.TABS_ARE_READY });
      clearInterval(interval);
    }
  }, 100);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  const tabId = String(tab.id as number);

  await tabsStorage.save(tab);
  await tabsAlarm.create(tabId);
});

chrome.tabs.onActivated.addListener(async(activeInfo) => {
  console.log('onActivated', activeInfo);
  await unpauseActiveTabs();
  await queryActiveTabs();
  await pauseActiveTabs();

  await tabsStorage.reset(activeInfo.tabId);
  await tabsAlarm.recreate(activeInfo.tabId);

  await sendMessageToPopup({ status: MessageStatus.UPDATE_TABS });
});

chrome.alarms.onAlarm.addListener(async (a) => {
  const tab = tabsStorage.resolve(a.name);

  if (!tab) {
    return;
  }

  tab.timeout = tab.timeout - TICK_IN_MILLISECONDS;
  console.log(tab, 'alarm tick');
  await tabsStorage.update(tab);

  if (tab.tab.url === 'chrome://extensions/') {
    return;
  }

  if (tab.timeout <= 0) {
    await chrome.tabs.remove(tab.tab.id as number);
    await tabsStorage.remove(tab.tab.id);
    await tabsAlarm.remove(a.name);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    domIsReady = false;
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('background', message);

  switch (message?.status) {
    case MessageStatus.DOM_IS_READY:
      domIsReady = true;
      break;
    case MessageStatus.DOM_WAS_DESTROYED:
      domIsReady = false;
      break;
    case MessageStatus.TABS_STATUS_REQUEST:
      sendResponse({ status: MessageStatus.TABS_ARE_READY });
      break;
    default:
      break;
  }
});