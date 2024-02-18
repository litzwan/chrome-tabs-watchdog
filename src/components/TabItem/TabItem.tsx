import CloseIcon from '@/assets/close-icon.svg?react';

function TabItem() {
  return (
    <li className="w-[100%] p-[15px] border-solid border-[2px] border-primary-600 rounded-[10px] relative">
      <button className="w-[30px] h-[30px] flex items-center justify-center rounded-full absolute top-[-15px] right-[-15px] bg-primary-600">
        <CloseIcon className="fill-primary-100" />
      </button>
      <input
        type="text"
        className="w-[100%] mb-[15px] bg-transparent border-none py-[10px] text-primary-100 text-[18px] font-bold placeholder:text-primary-300 [&:not(:focus)]:text-primary-300"
        placeholder="https://example.com"
      />
      <div className="flex justify-between items-center">
        <button className="px-[15px] py-[10px] bg-primary-400 rounded-[10px] text-[16px] text-primary-100 font-bold">
          Save
        </button>
        <button className="px-[15px] py-[10px] bg-primary-500 rounded-[10px] text-[16px] text-primary-100 font-bold">
          Close Tabs
        </button>
      </div>
    </li>
  );
}



export default TabItem;