import React from "react";

const SkeletonLoadingDetail = () => {
  return (
    <div className="bg-customCard my-10 p-2 rounded-xl animate-pulse">
      <div className="flex flex-row p-10">
        <div className="w-24 h-32 mr-5 rounded-xl bg-gray-300 pr-4 animate-pulse" />
        <div className="w-28 h-32 rounded-xl bg-gray-300 animate-pulse " />
      </div>
    </div>
  );
};

export default SkeletonLoadingDetail;
