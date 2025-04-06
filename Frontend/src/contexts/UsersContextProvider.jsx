import axios from "axios";
import { createContext, useState, useContext, useLayoutEffect } from "react";

const UsersData = createContext(null);
const UsersContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [usersData, setUsersData] = useState(null);
  const [isError, setIsError] = useState(false);
  const host = window?.location?.hostname;
  const fetchUsersData = async (notWaiting) => {
    if (!notWaiting) setIsLoading(true);
    setIsError(false);
    try {
      const { data } = await axios.request(`http://${host}:5000/users`, {
        timeout: 8000,
      });
      setUsersData(data?.data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.log(err);
      //setUsersData(null);
      setIsLoading(false);
      setIsError(true);
    }
  };
  useLayoutEffect(() => {
    fetchUsersData();
  }, []);
  return (
    <UsersData.Provider
      value={{ isLoading, usersData, isError, fetchUsersData }}
    >
      {children}
    </UsersData.Provider>
  );
};

export default UsersContextProvider;

export const useUsersContext = () => useContext(UsersData);
