import { useEffect, useState } from 'react';
import { MessageStatus } from '@/lib/messageStatus.ts';
import TabsStorage, { type StorageTabsDictionary } from '@/background/tabsStorage.ts';

function useTabs() {
  const [tabs, setTabs] = useState<StorageTabsDictionary>({});
  const storage = new TabsStorage();

  async function syncStorage() {
    await storage.sync();
    console.log(storage.getTabs);
    setTabs(storage.getTabs);
  }
  
  function handleMessage(message: Record<string, unknown>) {
    switch (message?.status) {
      case MessageStatus.TABS_ARE_READY:
        void syncStorage();
        break;
      case MessageStatus.UPDATE_TABS:
        void syncStorage();
        break;
      default:
        break;
    }
  }
  
  useEffect(() => {
    void chrome.runtime.sendMessage({ status: MessageStatus.DOM_IS_READY });
    void chrome.runtime.sendMessage({ status: MessageStatus.TABS_STATUS_REQUEST }, (response) => {
      handleMessage(response);
    });

    chrome.runtime.connect({ name: 'popup' });
    
    chrome.runtime.onMessage.addListener((message) => {
      handleMessage(message);
    });
  }, []);
  
  return {
    tabs,
  };
}

export default useTabs;