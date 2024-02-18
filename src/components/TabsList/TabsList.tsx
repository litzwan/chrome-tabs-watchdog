import TabItem from '@/components/TabItem';
import PlusCircleIcon from '@/assets/plus-circle-icon.svg?react';

function TabList() {
  return (
    <ul className="flex flex-col gap-[15px]">
      <TabItem />
      <button className="w-[100%] p-[15px] flex items-center justify-center border-solid border-[2px] border-primary-600 rounded-[10px]">
        <PlusCircleIcon className="fill-primary-300" />
      </button>
    </ul>
  );
}

export default TabList;