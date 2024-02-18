import TabList from '@/components/TabsList';
import { useEffect } from 'react';

function Popup() {

  useEffect(() => {
      chrome.tabs.query({
        url: 'https://developer.chrome.com/*'
      }, (tabs) => {
        console.log(tabs);
      });
    }
  );

  return (
    <div className="w-[400px] bg-primary-200 flex flex-col gap-[30px] px-[15px] pb-[15px]">
      <header className="border-b-[1px] border-primary-600 border-solid py-[15px]">
        <h1 className="text-[24px] font-bold text-primary-100 text-center ">
          Tabs Manager
        </h1>
      </header>
      <TabList />
    </div>
  );
}

export default Popup;