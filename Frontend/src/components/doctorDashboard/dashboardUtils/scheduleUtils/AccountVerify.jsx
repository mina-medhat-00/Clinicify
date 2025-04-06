import React from "react";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Tag } from "antd";
const AccountVerify = ({ isVerified }) => {
  return isVerified == null ? (
    <div className="flex p-2  text-center bg-yellow-600/60 rounded-lg flex-wrap gap-2 items-center justify-center">
      <div className="text-2xl text-yellow-100 font-medium">
        Your Account being Verified
      </div>
      <Tag
        color="gold"
        className="!flex gap-2 !items-center !p-4 !text-4xl !font-medium"
      >
        pending <LoadingOutlined />
      </Tag>
    </div>
  ) : isVerified == 0 ? (
    <div className="flex p-2 bg-red-600/60 rounded-lg flex-wrap gap-2 items-center justify-center">
      <div className="text-2xl text-red-100 font-medium">
        Your Account has been Rejected
      </div>
      <Tag
        color="red"
        className="!flex gap-2 !items-center !p-4 !text-4xl !font-medium"
      >
        Rejected <CloseCircleOutlined />
      </Tag>
    </div>
  ) : null;
};

export default AccountVerify;
