const ChatMessages = () => {
  return (
    <>
      <div className="flex flex-col gap-[10px]">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className=" w-fit max-w-[70%] text-white text-[18.2px] opacity-100 pl-4 pr-7 py-[13px]  shadow-inner-custom  h-full rounded-[30px] bg-custom-gradient drop-shadow-custom "
            >
              Hello How was your day ??? {index}
            </div>
          ))}
      </div>
      <div className="flex items-end flex-col gap-[10px]">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className=" w-fit max-w-[70%] text-white text-[18.2px] opacity-100 pl-4 pr-7 py-[13px]  shadow-inner-custom  h-full rounded-[30px] bg-custom-gradient drop-shadow-custom "
            >
              Hello How was your day ??? {index}
            </div>
          ))}
      </div>
      <div className="flex items-start flex-col gap-[10px]">
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className=" w-fit max-w-[70%] text-white text-[18.2px] opacity-100 pl-4 pr-7 py-[13px]  shadow-inner-custom  h-full rounded-[30px] bg-custom-gradient drop-shadow-custom "
            >
              Hello How was your day ??? {index}
            </div>
          ))}
      </div>
    </>
  );
};

export default ChatMessages;
