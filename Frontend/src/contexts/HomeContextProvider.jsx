import axios from "axios";
import { createContext, useState, useContext, useLayoutEffect } from "react";

const HomeData = createContext(null);
const HomeContextProvider = ({ children, query }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState({});
  const host = window?.location?.hostname;
  const fetchHomeData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.request(
        `http://${host}:5000/general/statistics`,
        {
          timeout: 10000,
        }
      );
      setHomeData(data?.data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useLayoutEffect(() => {
    fetchHomeData();
  }, []);
  return (
    <HomeData.Provider value={{ isLoading, homeData }}>
      {children}
    </HomeData.Provider>
  );
};

export default HomeContextProvider;

export const useHomeContext = () => useContext(HomeData);
