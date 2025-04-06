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

const SlotsData = createContext(null);
const SlotsContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [slotsData, setSlotsData] = useState({
    bookedSlots: null,
    totalSlots: null,
    freeSlots: null,
  });
  const host = window?.location?.hostname;
  const fetchSlotsData = async (postData, noLoading) => {
    if (!noLoading) setIsLoading(true);
    try {
      const { data } = await axios.post(
        `http://${host}:5000/get/slots`,
        {
          data: postData,
        },
        {
          timeout: 10000,
        }
      );
      setSlotsData(() => data?.data);
      setIsLoading(false);
      return data;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };
  // useLayoutEffect(() => {
  //   fetchSlotsData();
  // }, []);
  return (
    <SlotsData.Provider
      value={{ isLoading, slotsData, fetchSlotsData, tokenExpired }}
    >
      {children}
    </SlotsData.Provider>
  );
};

export default SlotsContextProvider;

export const useSlotsContext = () => useContext(SlotsData);
