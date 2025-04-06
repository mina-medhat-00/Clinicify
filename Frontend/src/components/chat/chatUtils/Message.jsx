import React from "react";

const Message = ({ isMobile, me, content, issued_time }) => {
  return (
    <div className={!me ? "pl-2" : "pr-2"}>
      <div
        style={{
          maxWidth: "65%",
          minWidth: isMobile ? "50%" : "30%",
        }}
        className={`flex relative gap-3 flex-col w-fit rounded-bl-lg rounded-tr-lg mt-2 font-medium
         ${
           me
             ? "rounded-tl-lg ml-auto rounded-lg text-white bg-blue-500"
             : "rounded-br-lg bg-white"
         } p-2`}
      >
        <span className={`${me ? "block" : ""}`}>{content}</span>
        <span
          className={`${
            !me ? "text-gray-400  block ml-auto" : "ml-auto text-gray-200"
          } text-xs`}
        >
          {issued_time}
        </span>
        <div
          className={!me ? "!border-t-white" : "!border-t-blue-500"}
          style={{
            position: "absolute",
            top: !me ? 0 : 0,
            // bottom: me ? "" : 0,
            left: !me ? "-13px" : "calc(100% - 13px)",
            //borderBottom: me ? "" : "13px solid",
            borderTop: !me ? "13px solid" : "13px solid",
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Message;
