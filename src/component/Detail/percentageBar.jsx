import React from "react";

const ProgressBar = ({ skillName, percentage }) => {
  const progressBarStyle = {
    width: `${percentage > 100 ? 100 : percentage}%`,
  };

  return (
    <div className="flex items-center my-4 text-xs">
      <div className="w-2/5 mr-4 font-semibold">{skillName} :</div>
      <div className="ml-10 w-3/5 h-[10px] bg-customCard">
        <div className="h-full bg-orange-500" style={progressBarStyle} />
      </div>
      <p className="ml-4">  {percentage}%</p>
    </div>
  );
};

export default ProgressBar;
