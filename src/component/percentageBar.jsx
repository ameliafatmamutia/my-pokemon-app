import React from "react";

const ProgressBar = ({ skillName, percentage }) => {
  const progressBarStyle = {
    width: `${percentage}%`,
  };

  return (
    <div className="flex items-center my-4">
      <div className="w-1/5 mr-4 font-semibold">{skillName} :</div>
      <div className="w-4/5 h-6 bg-customCard">
        <div className="h-full bg-orange-500" style={progressBarStyle} />
      </div>
      <p className="ml-4">{percentage}%</p>
    </div>
  );
};

export default ProgressBar;
