import { useEffect, useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

interface NumberScrollerProps {
  numbers: number[];
  count: number;
  onScrollerMove: () => void;
}

function NumberScroller(props: NumberScrollerProps) {
  const { numbers, count, onScrollerMove } = props;

  const splideOptions = useRef({
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '0',
    padding: '0px',
    pagination: false,
    height: '45px',
    arrows: false,
    direction: 'ttb',
    focus: 'center',
    wheel: true,
    drag: 'free',
    snap: true,
    start: count,
  });

  const [_currentNumber, setCurrentNumber] = useState(0);
  const splideRef = useRef<typeof Splide | null>(null);

  function onActiveHandler(evt: any) {
    setCurrentNumber(evt.index);
  }

  function onDragHandler() {
    onScrollerMove();
  }

  useEffect(() => {
    splideRef.current.go(count);
  }, [count]);

  return (
    <div
      className="w-[80px]"
      onWheel={onScrollerMove}
    >
      <Splide
        options={splideOptions.current}
        ref={splideRef}
        onActive={onActiveHandler}
        onDrag={onDragHandler}
      >
        {numbers.map((day) => (
          <SplideSlide key={day}>
            <span className={'text-[30px] leading-[35px] font-bold flex items-center justify-center text-primary-300'}>
              {day}
            </span>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default NumberScroller;