import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useReducer,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

const UserData = createContext(null);
const UserContextProvider = ({ children, token }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = useState(null);
  const [isError, setIsError] = useState(false);
  const host = window?.location?.hostname;
  const fetchUserData = async (active, directToken, directError, noRender) => {
    if (!noRender) setIsLoading(true);
    if (!token && !directToken) {
      setUserData(null);
      return setIsLoading(false);
    }
    try {
      if (directError) throw directError;
      const { data } = await axios.request(`http://${host}:5000/user`, {
        headers: { Authorization: `Bearer ${active ? directToken : token}` },
        timeout: 10000,
      });
      setUserData(data?.data);
      setIsLoading(false);
      setIsError(false);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.data?.name;
      switch (msg) {
        case "TokenExpiredError":
          let userData;
          setUserData((dat) => {
            userData = dat;
            return dat;
          });
          if (userData && !location?.pathname.includes("login")) {
            setTokenExpired(true);
            messageApi.open({
              key: 1,
              type: "error",
              content: "your Time has Expired, Redirecting to login page ...",
              duration: 3,
            });
            setTimeout(() => {
              setUserData(null);
              navigate(`/login?redirect=${location?.pathname}`);
            }, 3000);
          }
          const cookie = new Cookies();
          cookie.remove("accessToken");
          break;
        case "JsonWebTokenError":
          // window.localStorage.removeItem("user");
          setUserData(null);
          break;
        default:
          setIsError(true);
          setUserData(null);
          break;
      }
      setIsLoading(false);
    }
  };
  useLayoutEffect(() => {
    fetchUserData(true, new Cookies().get("accessToken"));
  }, []);
  useLayoutEffect(() => {
    let timeId;
    const handleExpired = async () => {
      try {
        const record = jwtDecode(new Cookies().get("accessToken"));
        timeId = setTimeout(() => {
          fetchUserData(true, new Cookies().get("accessToken"), null, true);
        }, Math.abs(+(record?.exp + "000") - Date.now()));
      } catch (err) {
        //     console.log(err, "err");
      }
    };
    handleExpired();
    return () => {
      clearTimeout(timeId);
    };
  }, [new Cookies().get("accessToken")]);
  return (
    <UserData.Provider
      value={{
        isLoading,
        userData,
        fetchUserData,
        setUserData,
        isError,
        tokenExpired,
        messageApi,
      }}
    >
      {children}
      {contextHolder}
    </UserData.Provider>
  );
};

export default UserContextProvider;

export const useUserContext = () => useContext(UserData);
