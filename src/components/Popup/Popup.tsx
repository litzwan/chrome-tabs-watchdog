import { TabItem } from '@/components/TabItem';
import Switch from 'react-switch';
import { useState } from 'react';
import useTabs from '@/lib/hooks/useTabs.ts';
import { type StorageTabScheme } from '@/background/tabsStorage.ts';

function Popup() {
  const [isTurnedOff, setIsTurnedOff] = useState(false);

  const { tabs } = useTabs();
  
  function asArray<R = unknown>(obj: Record<string, unknown>): R {
    return Object.keys(obj).map((key) => obj[key]) as R;
  }

  return (
    <div className="w-[100%] px-[15px] pb-[20px]">
      <header className="flex items-center justify-between py-[15px]">
        <h3 className="text-[20px] font-bold text-primary-200">
          TabsWatchdog
        </h3>
        <Switch
          checked={isTurnedOff}
          onChange={setIsTurnedOff}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#66CC99"
        />
      </header>
      <ul className="flex flex-col gap-[20px]">
        { asArray<StorageTabScheme[]>(tabs)?.map((tab) => {
          return (
            <TabItem tab={tab} timeout={tab.timeout} />
          );
        })}
      </ul>
    </div>
  );
}

export default Popup;