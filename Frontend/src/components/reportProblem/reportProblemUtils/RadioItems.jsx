import { Radio } from "antd";
import React from "react";

const RadioItems = ({ bgClass, items, radioClass }) => {
  return (
    <Radio.Group>
      <div
        className={`font-medium text-white ${
          bgClass ? bgClass : "bg-gray-700"
        } p-4 rounded shadow-xl flex gap-4
    items-center flex-wrap justify-between sm:justify-around`}
      >
        {items.map(({ value, name }) => (
          <Radio
            className={`${
              radioClass ? radioClass : "sm:!w-1/3 !text-gray-200"
            } !text-xs sm:!text-sm`}
            key={name}
            value={name}
          >
            {value}
          </Radio>
        ))}
      </div>
    </Radio.Group>
  );
};

export default RadioItems;
