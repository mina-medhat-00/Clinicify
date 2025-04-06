import React from "react";

const Arrow = ({ color, arrowColor }) => {
  return (
    <div>
      <div className={`text-lg sm:text-2xl ${color ? color : "text-blue-400"}`}>
        \&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
      </div>
      <div className={`text-lg sm:text-2xl ${color ? color : "text-blue-400"}`}>
        \&nbsp;&nbsp;&nbsp;/
      </div>
      <div className={`text-lg sm:text-2xl ${color ? color : "text-blue-400"}`}>
        \/
      </div>
      <div
        className={`text-lg sm:text-2xl ${
          arrowColor ? arrowColor : color ? color : "text-blue-400"
        }`}
      >
        \/
      </div>
    </div>
  );
};

export default Arrow;
