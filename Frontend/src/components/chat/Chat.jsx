import { Avatar, Empty, Input, Rate, Segmented } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Cookies from "universal-cookie";
import { useChatContext } from "../../contexts/ChatContextProvider";
import MessagesContextProvider from "../../contexts/MessagesContextProvider";
import Cards from "./chatUtils/Cards";
import Messages from "./chatUtils/Messages";
import Loader from "../Loader";
import {
  BsArrowLeftSquare,
  BsArrowUpSquare,
  BsFillPersonBadgeFill,
  BsPersonPlus,
  BsPersonSquare,
} from "react-icons/bs";
import userPhoto from "../../images/userPhoto.png";
import doctorPhoto from "../../images/doctorPhoto.png";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowUp } from "react-icons/ai";
import ServerError from "../utils/ServerError";
import { MdError } from "react-icons/md";
import { useUserContext } from "../../contexts/UserContextProvider";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";

const Chat = ({ isAdmin, isChat }) => {
  const { messageApi, socket, timeZone } = useUtilsContext();
  const { fetchUserData, userData: user } = useUserContext();
  const { fetchChatData, chatData, isLoading, isError } = useChatContext();
  const isMobile = useMediaQuery({
    query: "(max-width:678px)",
  });
  const [withUser, setWithUser] = useState(
    () => parseInt(window.localStorage.getItem("chatTo")) || null
  );
  useEffect(() => {
    const cookies = new Cookies();
    if (user?.user_id) {
      socket.emit("join_user", user.user_id);
    }
    const fetchChat = () => {
      fetchChatData(
        true,
        cookies.get("accessToken"),
        {
          chat_to: withUser,
        },
        true
      );
    };
    socket?.on("new_chat", fetchChat);
    fetchChatData(true, cookies.get("accessToken"), {
      chat_to: withUser,
    });
    return () => socket.off("new_chat", fetchChat);
  }, []);
  useEffect(() => {
    if (withUser) window.localStorage.setItem("chatTo", withUser);
  }, [withUser]);
  const chatRecord = chatData?.find(({ user_id }) => user_id == withUser);
  const me = user?.user_id === withUser ? true : false;
  return (
    <div
      style={{
        height: isAdmin
          ? `calc(100vh - 65px)`
          : isMobile
          ? "100vh"
          : isChat
          ? "100vh"
          : "calc(100vh - 51.2px)",
      }}
      className={`flex ${isMobile && "flex-col"}`}
    >
      {isError ? (
        <div className="p-1 flex flex-col bg-red-500/70 justify-evenly items-center">
          <span className="text-white font-medium text-xl sm:text-2xl lg:text-3xl">
            No Users
          </span>
          <MdError
            fill="white"
            style={{
              fontSize: isMobile ? "125px" : "150px",
            }}
          />
          <Link
            to="/chat"
            className="p-3 sm:p-4 text-xl sm:mx-2 sm:text-3xl rounded-lg !text-white bg-blue-800/70 hover:bg-blue-800/90 rounded"
          >
            Refresh Now
          </Link>
        </div>
      ) : (
        <Cards
          isLoading={isLoading}
          withUser={withUser}
          setWithUser={setWithUser}
          chatData={chatData}
          isMobile={isMobile}
          me={me}
          userId={user?.user_id}
        />
      )}
      {chatRecord || isLoading ? (
        <div
          style={{
            height: !isMobile ? "100%" : "calc(100% - 83.7px)",
          }}
          className="grow justify-between flex flex-col bg-gray-200 text-gray-700 px-2"
        >
          {!isMobile && !isError && (
            <div className="flex justify-between border-b border-gray-300 rounded-md p-2 bg-white items-center border-gray-100 shadow-sm">
              <div className="flex gap-2 items-center">
                <Avatar
                  src={
                    chatRecord?.img_url ||
                    (chatRecord?.user_type == "doctor"
                      ? doctorPhoto
                      : userPhoto)
                  }
                >
                  {chatRecord?.nick_name?.[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <div className="text-gray-700 font-medium">
                    {me ? "ME" : chatRecord?.nick_name}
                  </div>
                  {chatRecord?.specialty && (
                    <div className="text-gray-500">{chatRecord?.specialty}</div>
                  )}
                </div>
              </div>

              <div className="text-lg font-medium">
                {chatRecord?.user_type?.toUpperCase()}
              </div>
              {chatRecord?.user_type == "doctor" && (
                <Rate disabled value={chatRecord?.rate} />
              )}
            </div>
          )}
          <MessagesContextProvider fetchUserData={fetchUserData}>
            <Messages
              key={withUser || "user"}
              isOpen={
                chatRecord?.user_type == "admin" && !chatRecord?.chat_from
                  ? true
                  : user?.user_type == "user" && withUser !== user?.user_id
                  ? chatRecord?.is_open == 1
                  : !chatRecord?.is_open ||
                    ((chatRecord?.user_type == "user" ||
                      user?.user_type == "admin") &&
                      chatRecord?.chat_from)
              }
              withNickName={chatRecord?.nick_name}
              socket={socket}
              withUser={withUser}
              withUserType={chatRecord?.user_type}
              user_id={user?.user_id}
              isMobile={isMobile}
              fetchUserData={fetchUserData}
              messageApi={messageApi}
              timeZone={timeZone || ""}
              isNew={!(chatRecord?.chat_from && chatRecord?.chat_to)}
            />
          </MessagesContextProvider>
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full grow items-center justify-center">
          {chatData?.length ? (
            <>
              {isMobile ? (
                <AiOutlineArrowUp className="!text-6xl text-blue-700  !m-0" />
              ) : (
                <AiOutlineArrowLeft className="!text-6xl text-blue-700 !m-0" />
              )}
              <span className="text-xl text-blue-900 font-medium">
                Choose User To Chat
              </span>
              <BsFillPersonBadgeFill
                fill="blue"
                style={{
                  fontSize: isMobile ? "125px" : "150px",
                }}
              />
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium text-xl">
                No Users
              </span>
              <Link to="/doctors">
                <BsPersonPlus
                  fill="#103155"
                  style={{
                    fontSize: isMobile ? "125px" : "150px",
                  }}
                />
              </Link>
              <Link
                to="/doctors"
                className="p-3 sm:p-4 text-xl sm:text-3xl rounded-lg !text-white bg-gray-800 hover:bg-gray-900 rouned"
              >
                Chat with Doctor Now
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
