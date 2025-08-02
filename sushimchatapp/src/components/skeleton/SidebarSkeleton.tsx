const SidebarSkeleton = () => {
  return (
    <div className="overflow-auto  scroll-auto  p-8 gap-4 flex flex-col w-[400px] sm:h-[630px] h-[750px] bg-linear-to-r from-black/20 to-black/20  rounded-4xl opacity-100 shadow-inner-custom">
      <div
        className="animate-pulse p-3 justify-center w-full  h-12 flex gap-[10px] rounded-[20px] bg-[#1a1a1a]
       bg-custom-gradient shadow-inner-custom drop-shadow-custom"
      >
        <div
          className="p-2 placeholder:text-[18.2px] w-full h-full 
           gap-[203px] text-start opacity-100"
        />
        <svg
          width="24"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5125 22.75C16.628 22.75 20.775 18.1422 20.775 12.4583C20.775 6.77436 16.628 2.16663 11.5125 2.16663C6.39696 2.16663 2.25 6.77436 2.25 12.4583C2.25 18.1422 6.39696 22.75 11.5125 22.75Z"
            stroke="white"
            stroke-opacity="0.5"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            opacity="0.4"
            d="M21.75 23.8333L19.8 21.6666"
            stroke="#94919A"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="w-full gap-[15px] flex h-[91px] pl-4 py-[13px] pr-[7px] rounded-[20px] bg-gradient-to-br from-black/[0.28] to-[#818181]/0 shadow-inner">
              <div className="bg-[#444] rounded-full h-[65px] w-[65px]" />
              <div className="flex gap-2.5 h-full w-full flex-col justify-center">
                <div className="bg-[#444] h-[27px] w-[125px] rounded-md" />
                <div className="bg-[#444] h-[16px] w-[200px] rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SidebarSkeleton;
