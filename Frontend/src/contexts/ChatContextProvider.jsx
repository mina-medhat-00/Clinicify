import { message } from "antd";
import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useReducer,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { useUserContext } from "./UserContextProvider";
const handleQuery = (obj) =>
  !obj
    ? ""
    : Object.entries(obj)
        .filter(([_, val]) => val || val === 0)
        .map(([name, val], i) =>
          i == 0 ? `?${name}=${val}` : `${name}=${val}`
        )
        .join("&");
const ChatData = createContext(null);
const ChatContextProvider = ({ children, token }) => {
  const { fetchUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [chatData, setChatData] = useState(null);
  const host = window?.location?.hostname;
  const fetchChatData = async (active, directToken, query, noWaiting) => {
    if (!noWaiting) setIsLoading(true);
    if (!token && !active) {
      setChatData(null);
      return setIsLoading(false);
    }
    try {
      const { data } = await axios.request(
        `http://${host}:5000/get/chat${handleQuery(query)}`,
        {
          headers: {
            Authorization: `Bearer ${active ? directToken : token}`,
          },
          timeout: 10000,
        }
      );
      setChatData(data?.data);
      setIsError(false);
      setIsLoading(false);
    } catch (err) {
      const msg = err?.response?.data?.data?.name;
      switch (msg) {
        case "TokenExpiredError":
          fetchUserData(true, null, {
            response: {
              data: {
                data: {
                  name: "TokenExpiredError",
                },
              },
            },
          });
          break;
        case "JsonWebTokenError":
          setChatData(null);
          fetchUserData(true, null, {
            response: {
              data: {
                data: {
                  name: "JsonWebTokenError",
                },
              },
            },
          });
          break;
        default:
          setIsError(true);
          setChatData(null);
          break;
      }
      setIsLoading(false);
      throw err;
    }
  };
  // useLayoutEffect(() => {
  //   fetchChatData();
  // }, []);
  return (
    <ChatData.Provider
      value={{
        isLoading,
        isError,
        chatData,
        fetchChatData,
        setChatData,
      }}
    >
      {children}
    </ChatData.Provider>
  );
};

export default ChatContextProvider;

export const useChatContext = () => useContext(ChatData);
