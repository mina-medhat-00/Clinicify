import { message } from "antd";
import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useReducer,
} from "react";
import Cookies from "universal-cookie";
const handleQuery = (obj) =>
  !obj
    ? ""
    : Object.entries(obj)
        .filter(([_, val]) => val || val === 0)
        .map(([name, val], i) =>
          i == 0 ? `?${name}=${val}` : `${name}=${val}`
        )
        .join("&");
const cookies = new Cookies();
const MessagesData = createContext(null);
const MessagesContextProvider = ({
  children,
  fetchUserData,
  noFirstRender,
  query,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [messagesData, setMessagesData] = useState(null);
  const host = window?.location?.hostname;
  const fetchMessagesData = async (token, query, noRender) => {
    if (!noRender) setIsLoading(true);
    try {
      const { data } = await axios.request(
        `http://${host}:5000/get/messages${handleQuery(query)}`,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.get("accessToken")}`,
          },
        }
      );
      setMessagesData(() => data?.data);
      setIsError(false);
      setIsLoading(false);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.data?.name;
      setIsError(true);
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
          break;
      }
      setIsLoading(false);
      throw err;
    }
  };
  // useLayoutEffect(() => {
  //   if (!noFirstRender) fetchMessagesData(query);
  // }, []);
  return (
    <MessagesData.Provider
      value={{ isLoading, messagesData, fetchMessagesData, isError }}
    >
      {children}
    </MessagesData.Provider>
  );
};

export default MessagesContextProvider;

export const useMessagesContext = () => useContext(MessagesData);
