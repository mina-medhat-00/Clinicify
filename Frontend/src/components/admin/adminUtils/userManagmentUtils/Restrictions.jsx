import React, { useState } from "react";
import { ChatContextProvider } from "../../../../contexts";
import ChatRestrict from "./ChatRestrict";
import { Avatar, Select } from "antd";
const { Option } = Select;
const Restrictions = ({ selectedUser }) => {
  const [restrictType, setRestrictType] = useState("chat");
  return (
    <div className="">
      <div className="mb-2 flex flex-wrap justify-evenly sm:justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar
            className={`!w-12 !h-12 !p-1 !bg-gray-600`}
            src={selectedUser?.img_url}
          />
          <span className="text-xl text-gray-400">
            {selectedUser?.nick_name}
          </span>
        </div>
        {/* <Select
          style={{
            background: "gray",
          }}
          value={restrictType}
          onChange={(val) => {
            setRestrictType(val);
            console.log(val);
          }}
          className="!text-white"
          placeholder="Restriction Type"
        >
          <Option value="appointment">Appointment</Option>
          <Option value="chat">Chatting</Option>
        </Select> */}
        <div className="p-1 bg-gray-100 shadow-md rounded-md font-medium">
          {restrictType?.toUpperCase()} RESTRICTIONS
        </div>
      </div>
      <hr className="border-2" />
      {restrictType == "chat" ? (
        <ChatContextProvider>
          <ChatRestrict userid={selectedUser?.user_id} />
        </ChatContextProvider>
      ) : //   :
      //   restrictType == "appointment" ? (
      //     <>
      //
      //     </>
      //   )
      null}
    </div>
  );
};

export default Restrictions;
