import { UrlItem } from '@/components/UrlItem';
import Switch from 'react-switch';
import { useState } from 'react';
import useUrls from '@/lib/hooks/useUrls';

function Popup() {
  const [isTurnedOff, setIsTurnedOff] = useState(false);
  const [urlToAdd, setUrlToAdd] = useState('');

  const { urls, addUrl } = useUrls();

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
        { urls.map((url) => {
          return (
            <UrlItem key={url.url} url={url.url} delay={url.delay} />
          );
        })}
        <li className="flex items-stretch justify-between">
          <input
            type="text"
            className="px-[15px] py-[5px] bg-primary-700 rounded-[7px] text-[16px] text-primary-200 font-semibold"
            value={urlToAdd}
            onChange={(evt) => setUrlToAdd(evt.target.value)}
          />
          <button
            className="px-[15px] bg-primary-400 rounded-[7px] text-primary-100 font-semibold"
            onClick={() => addUrl({ url: urlToAdd, delay: 100000 })}
          >
            Add
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Popup;