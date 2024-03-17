import { useState } from 'react';
import { CountdownRenderer } from '@/components/CountdownRenderer';
import Countdown, { type CountdownApi } from 'react-countdown';
import PauseIcon from '@/assets/pause-icon.svg?react';
import PlayIcon from '@/assets/play-icon.svg?react';
import XMarkIcon from '@/assets/x-mark-icon.svg?react';

interface TabItemProps {
  tab: chrome.tabs.Tab;
  timeout: number;
}

function TabItem(props: TabItemProps) {
  const { tab, timeout } = props; 

  const [isPaused, setIsPaused] = useState(false);
  const [countdownApi, setCountdownApi] = useState<CountdownApi | null>(null);
  const [countdownDate, _setCountdownDate] = useState(Date.now() + timeout);

  const pauseButtonIcon = () => {
    return isPaused ? <PlayIcon className="fill-primary-200 w-[25px]" /> : <PauseIcon className="fill-primary-200 w-[25px]" />;
  };

  const pauseColor = () => {
    return isPaused ? 'bg-primary-500' : 'bg-primary-400';
  };

  function togglePause() {
    setIsPaused((prevState) => !prevState);
    setTimeout(() => {
      if (!countdownApi) {
        return;
      }

      if (isPaused) {
        countdownApi.start();
      } else {
        countdownApi.pause();
      }
    });
  }

  function onPauseHandler() {
    setIsPaused(true);
  }

  return (
    <li className="relative flex items-stretch gap-[10px] px-[10px] py-[5px] pl-[15px] bg-primary-700 rounded-[7px] overflow-hidden">
      <div className="w-[80%] flex flex-col gap-[10px]">
        <div>
          <span className={`absolute top-0 bottom-0 left-0 w-[4px] ${pauseColor()}`}></span>
          <span
            className={`absolute w-[5px] h-[5px] left-[13px] rounded-full top-[50%] translate-y-[-50%] ${pauseColor()}`}
          ></span>
          <p className="text-[16px] text-primary-200 font-semibold whitespace-nowrap pl-[15px] w-[100%] overflow-ellipsis overflow-hidden">
            { tab.url }
          </p>
        </div>
        <Countdown
          date={countdownDate}
          renderer={(props) => <CountdownRenderer {...props} setCountdownApi={setCountdownApi} />}
          controlled={false}
          onPause={onPauseHandler}
        />
      </div>
      <div className="flex-grow-[1] relative flex items-center justify-center">
        <button onClick={togglePause}>
          { pauseButtonIcon() }
        </button>
        <button className="absolute top-[5px] right-[5px]">
          <XMarkIcon className="fill-primary-600" />
        </button>
      </div>
    </li>
  );
}



export default TabItem;