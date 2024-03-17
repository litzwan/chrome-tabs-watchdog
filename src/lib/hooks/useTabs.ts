import { useEffect, useState } from 'react';
import { MessageStatus } from '@/lib/messageStatus.ts';
import Storage, { type StorageTabsDictionary } from '@/background/storage.ts';

function useTabs() {
  const [tabs, setTabs] = useState<StorageTabsDictionary>({});
  const storage = new Storage();

  async function syncStorage() {
    await storage.sync();
    setTabs(storage.getTabs);
  }
  
  useEffect(() => {
    void chrome.runtime.sendMessage({ status: MessageStatus.DOM_IS_READY });
    
    chrome.runtime.onMessage.addListener((message) => {
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
    });
  }, []);
  
  return {
    tabs,
  };
}

export default useTabs;