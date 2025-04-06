import React from "react";
import { Spin } from "antd";
import { GridLoader } from "react-spinners";
const Loader = ({ height, gray }) => {
  return (
    <div className="!my-4 flex w-full items-center justify-center">
      <GridLoader color={gray ? "#4a5568" : "#2b6cb0"} />
      {/* <Spin
        size="large"
        style={{
          height: `${height || "fit-content"}`,
          margin: "50px auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      /> */}
    </div>
  );
};

export default Loader;
