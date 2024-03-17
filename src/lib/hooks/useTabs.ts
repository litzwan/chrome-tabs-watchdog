import {useEffect} from 'react';
import {MessageStatus} from '@/lib/consts';
// import {StorageTabScheme} from '@/lib/types.ts';

function useTabs() {
  // const [tabs, setTabs] = useState<StorageTabScheme[]>([]);
  
  useEffect(() => {
    void chrome.runtime.sendMessage({ status: MessageStatus.DOM_IS_READY });
    
    chrome.runtime.onMessage.addListener((message) => {
      console.log('popup', message);
    });
  }, []);
}

export default useTabs;