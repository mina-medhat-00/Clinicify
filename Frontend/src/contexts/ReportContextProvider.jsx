import axios from "axios";
import { createContext, useState, useContext, useLayoutEffect } from "react";
import { useUserContext } from "./UserContextProvider";
import Cookies from "universal-cookie";

const ReportData = createContext(null);
const ReportContextProvider = ({ children, reportFrom }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [isError, setIsError] = useState(false);
  const { fetchUserData } = useUserContext();
  const host = window?.location?.hostname;
  const fetchReportData = async (directToken, notWaiting) => {
    if (!notWaiting) setIsLoading(true);
    setIsError(false);
    try {
      const { data } = await axios.request(
        `http://${host}:5000/get/${
          reportFrom ? `details/report?reportFrom=${reportFrom}` : "reports"
        }`,
        {
          headers: {
            Authorization: `Bearer ${directToken}`,
          },
          timeout: 10000,
        }
      );
      setReportData(data?.data);
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
          setIsError(true);
          break;
      }
      setIsLoading(false);
      throw err;
    }
  };
  useLayoutEffect(() => {
    fetchReportData(new Cookies().get("accessToken"));
  }, []);
  return (
    <ReportData.Provider
      value={{ isLoading, reportData, isError, fetchReportData }}
    >
      {children}
    </ReportData.Provider>
  );
};

export default ReportContextProvider;

export const useReportContext = () => useContext(ReportData);
