import axios from "axios";
import { createContext, useState, useContext, useLayoutEffect } from "react";

const ProfileData = createContext(null);
const ProfileContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [isError, setIsError] = useState(false);
  const host = window?.location?.hostname;
  const fetchProfileData = async ({ path, username }, notWaiting) => {
    if (!notWaiting) setIsLoading(true);
    setIsError(false);
    try {
      const { data } = await axios.request(
        `http://${host}:5000/${path}/${username}`,
        { timeout: 8000 }
      );
      setProfileData(data?.data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.log(err);
      //setProfileData(null);
      setIsLoading(false);
      if (err?.response?.status !== 400) setIsError(true);
    }
  };
  // useLayoutEffect(() => {
  //   fetchProfileData();
  // }, []);
  return (
    <ProfileData.Provider
      value={{ isLoading, profileData, isError, fetchProfileData }}
    >
      {children}
    </ProfileData.Provider>
  );
};

export default ProfileContextProvider;

export const useProfileContext = () => useContext(ProfileData);
