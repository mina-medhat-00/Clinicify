import io from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";
import { message } from "antd";
import { useTranslation } from "react-i18next";
const socket = io.connect(`http://${window.location.hostname}:5000`);
const timeZone = " gmt+0300";
const UtilsData = createContext(null);
const UtilsContextProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [lan, setLan] = useState(i18n.language || "en");
  const [messageApi, contextHolder] = message.useMessage();
  const isMobile = useMediaQuery({
    query: "(max-width:778px)",
  });
  const lang = i18n.language;
  useEffect(() => {
    setLan(lang);
  }, [lang]);
  return (
    <UtilsData.Provider
      value={{ timeZone, socket, isMobile, messageApi, lan, t, i18n }}
    >
      {contextHolder}
      {children}
    </UtilsData.Provider>
  );
};

export default UtilsContextProvider;

export const useUtilsContext = () => useContext(UtilsData);
