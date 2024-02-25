import { useEffect } from 'react';
import NumberScroller from './NumberScroller';
import type { CountdownRenderProps, CountdownApi } from 'react-countdown';

interface CountdownRendererPropsCustom extends CountdownRenderProps {
  setCountdownApi: (api: CountdownApi) => void;
}

const daysMax = Array.from({ length: 100 }, (_, index) => index);
const hoursMax = Array.from({ length: 25 }, (_, index) => index);
const minutesMax = Array.from({ length: 61 }, (_, index) => index);

function CountdownRenderer (props: CountdownRendererPropsCustom) {
  const {
    days,
    hours,
    api,
    seconds,
    setCountdownApi,
  } = props;

  function pauseCountdown() {
    api.pause();
  }

  useEffect(() => {
    if (api) {
      setCountdownApi(api);
    }
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <NumberScroller numbers={daysMax} count={days} onScrollerMove={pauseCountdown} />
        <span className="absolute top-[calc(100%+5px)] left-[50%] translate-x-[-50%] text-[14px] text-primary-600 font-bold">
          Days
        </span>
      </div>
      <span className="text-primary-300 text-[24px] font-bold opacity-30">:</span>
      <div className="relative">
      <NumberScroller numbers={hoursMax} count={hours} onScrollerMove={pauseCountdown} />
        <span className="absolute top-[calc(100%+5px)] left-[50%] translate-x-[-50%] text-[14px] text-primary-600 font-bold">
          Hours
        </span>
      </div>
      <span className="text-primary-300 text-[24px] font-bold opacity-30">:</span>
      <div className="relative">
      <NumberScroller numbers={minutesMax} count={seconds} onScrollerMove={pauseCountdown} />
        <span className="absolute top-[calc(100%+5px)] left-[50%] translate-x-[-50%] text-[14px] text-primary-600 font-bold">
          Minutes
        </span>
      </div>
    </div>
  );
}

export default CountdownRenderer;