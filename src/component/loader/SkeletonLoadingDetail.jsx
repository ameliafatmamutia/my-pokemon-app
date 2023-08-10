import React from "react";

const SkeletonLoadingDetail = () => {
  return (
    <div className="h-[150px] bg-customCard my-2 rounded-xl flex flex-row justify-around items-center animate-pulse">
      <div className="flex items-center">
        <div className="w-[70px] h-[70px] mr-5 rounded-xl bg-gray-300 pr-4 animate-pulse" />
        <div className="w-[90px] h-[90px] rounded-xl bg-gray-300 animate-pulse " />
      </div>
    </div>
  );
};

export default SkeletonLoadingDetail;
