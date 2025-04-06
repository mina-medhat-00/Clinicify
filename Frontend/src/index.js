import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./antd.css";
import { UserContextProvider } from "./contexts";
import Cookies from "universal-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import UtilsContextProvider from "./contexts/UtilsContextProvider";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
const cookies = new Cookies();
const DOMElement = document.getElementById("root");
const ReactRootElement = ReactDOM.createRoot(DOMElement);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
    react: { useSuspense: false },
  });

ReactRootElement.render(
  <Router>
    <UtilsContextProvider>
      <UserContextProvider token={cookies.get("accessToken")}>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <App />
        </SkeletonTheme>
      </UserContextProvider>
    </UtilsContextProvider>
  </Router>
);
