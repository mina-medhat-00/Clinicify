import { HomeOutlined } from "@ant-design/icons";
import { Avatar, Segmented, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userPhoto from "../../../images/userPhoto.png";
import doctorPhoto from "../../../images/doctorPhoto.png";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const UserCard = ({ imgUrl, name, isMobile, active }) => (
  <div className="p-1 text-center">
    <Avatar src={imgUrl} alt={name?.[0]?.toUpperCase()} />
    <div
      style={{
        maxWidth: "110px",
        minWidth: "80px",
      }}
      className={`break-all overflow-hidden font-medium text-ellipsis mt-1 ${
        !isMobile
          ? active
            ? "text-white"
            : "text-gray-700"
          : active
          ? "text-gray-700"
          : "text-gray-800"
      }`}
    >
      {name}
    </div>
  </div>
);
const Cards = ({
  isMobile,
  chatData,
  setWithUser,
  withUser,
  userId,
  isLoading,
}) => {
  const [element, setElement] = useState();
  useEffect(() => {
    setElement(document?.getElementsByClassName("user--item")?.[0]);
  }, [isMobile, chatData]);
  return isMobile ? (
    <div
      style={{
        height: "83.7px",
      }}
      className={`wrapper shrink-0 flex gap-2 items-center bg-gray-600 p-2`}
    >
      <Link
        to="/"
        className="bg-gray-700 hover:!bg-gray-800 p-2 rounded-lg border"
      >
        <HomeOutlined className="flex jusyify-center items-center text-4xl !text-gray-100" />
      </Link>
      <div className="w-0.5 h-full bg-gray-700"></div>
      <div
        className={`${
          isLoading ? "overflow-hidden" : "overflow-auto"
        } scroll--v scroll--h py-1 scroll--h--chat scroll--h--chat--white`}
      >
        {isLoading ? (
          <div className="flex gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton.Button
                size={60}
                className="bg-gray-100/40 rounded"
                active
                key={i + 1}
              />
            ))}
          </div>
        ) : chatData?.length > 0 ? (
          <Segmented
            className="user--segment !bg-blue-200"
            size="small"
            value={withUser}
            options={chatData?.map(
              ({ user_id, img_url, nick_name, user_type }) => ({
                label: (
                  <UserCard
                    isMobile={isMobile}
                    imgUrl={
                      img_url ||
                      (user_type == "doctor" ? doctorPhoto : userPhoto)
                    }
                    name={user_id === userId ? "ME" : nick_name}
                    active={withUser == user_id}
                  />
                ),
                value: user_id,
              })
            )}
            onChange={(val) => setWithUser(val)}
          />
        ) : null}
      </div>
    </div>
  ) : (
    <div
      className={`bg-gray-100 h-full relative border-r ${
        isLoading ? "overflow-hidden" : "overflow-auto"
      } scroll--v scroll--v--chat bg-gray-200 border-gray-400`}
    >
      <div className="bg-white">
        {withUser && !isLoading && (
          <div
            style={{
              height: `${element?.clientHeight}px`,
              top: `${
                element?.offsetHeight *
                chatData?.findIndex(({ user_id }) => user_id == withUser)
              }px`,
              transition: "top 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
            }}
            className="absolute w-full p-1"
          >
            <div className="bg-gray-700 rounded-lg w-full h-full"></div>
          </div>
        )}
        {isLoading ? (
          <div
            style={{
              width: "240px",
            }}
            className="flex flex-col"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <Skeleton.Button
                size="large"
                className="!w-full !p-2 rounded"
                active
                key={i + 1}
              />
            ))}
          </div>
        ) : (
          chatData?.map(({ user_id, nick_name, img_url, user_type }, i) => (
            <div
              className={`p-2 ${
                user_id !== withUser && "hover:bg-gray-100"
              } select-none flex gap-2 relative user--item cursor-pointer border-b border-gray-400`}
              key={user_id}
              onClick={() => setWithUser(user_id)}
            >
              <UserCard
                active={withUser == user_id}
                isMobile={isMobile}
                imgUrl={
                  img_url || (user_type == "doctor" ? doctorPhoto : userPhoto)
                }
                name={user_id === userId ? "ME" : nick_name}
              />
              <div
                style={{
                  maxWidth: "140px",
                }}
                className="flex items-center border-l border-gray-400/80 pl-2"
              >
                <span
                  className={`truncate text-gray-500 ${
                    withUser == user_id && "text-gray-100"
                  }`}
                >
                  welcome to live chating {i + 1}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cards;
