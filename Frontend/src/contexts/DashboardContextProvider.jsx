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

const DashboardData = createContext(null);
const DashboardContextProvider = ({ children, token }) => {
  const { fetchUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const host = window?.location?.hostname;
  const fetchDashboardData = async (active, directToken) => {
    setIsLoading(true);
    if (!token && !active) {
      setDashboardData(null);
      return setIsLoading(false);
    }
    try {
      const { data } = await axios.request(`http://${host}:5000/dashboard`, {
        headers: { Authorization: `Bearer ${active ? directToken : token}` },
        timeout: 10000,
      });
      setDashboardData(data?.data);
      setIsLoading(false);
      return data;
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
          setDashboardData(null);
          break;
        case "JsonWebTokenError":
          setDashboardData(null);
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
          setDashboardData(null);
          break;
      }
      setIsLoading(false);
    }
  };
  useLayoutEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <DashboardData.Provider
      value={{
        isLoading,
        dashboardData,
        fetchDashboardData,
        setDashboardData,
      }}
    >
      {children}
    </DashboardData.Provider>
  );
};

export default DashboardContextProvider;

export const useDashboardContext = () => useContext(DashboardData);
