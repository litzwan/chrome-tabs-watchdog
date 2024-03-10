// import { UrlItem } from '@/components/UrlItem';
import Switch from 'react-switch';
import { useState } from 'react';
// import useTabs from '@/lib/hooks/useTabs.ts';

function Popup() {
  const [isTurnedOff, setIsTurnedOff] = useState(false);

  // const { urls } = useTabs();

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
      {/*<ul className="flex flex-col gap````-[20px]">*/}
      {/*  { urls.map((url) => {*/}
      {/*    return (*/}
      {/*      <UrlItem key={url.url} url={url.url} delay={url.delay} />*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</ul>*/}
    </div>
  );
}

export default Popup;