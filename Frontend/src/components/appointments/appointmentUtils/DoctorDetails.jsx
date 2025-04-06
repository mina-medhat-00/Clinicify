import { StopOutlined } from "@ant-design/icons";
import React from "react";

const DoctorDetails = ({ data }) => {
  return (
    <div className="flex md:flex-col flex-wrap gap-3 justify-end items-center">
      {data?.map(({ label, value, icon }) => (
        <div
          key={label}
          className="doctor--more--details shadow-lg bg-gray-300 rounded p-2"
        >
          <span className="capitalize text-gray-700 font-medium sm:text-sm xl:text-base">
            {label}:{" "}
            <span className="text-gray-500">{value || <StopOutlined />}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default DoctorDetails;
