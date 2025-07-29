import { Users } from "lucide-react";

const SidebarSkeleton = () => {


  return (
  <div className=" p-8 gap-5 flex flex-col w-[400px] h-[630px] bg-gradient-to-r from-black/20 to-black/20 rounded-4xl opacity-100 shadow-inner">
    <div className="p-5 justify-center w-full h-12 flex gap-[10px] rounded-[20px] bg-[#1a1a1a] shadow-inner shadow-black/30">
      <div className="animate-pulse bg-[#333] rounded-[10px] w-[354.4px] h-[26px]" />
    </div>

    {Array(5)
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