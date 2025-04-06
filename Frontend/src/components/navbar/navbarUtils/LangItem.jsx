import React, { useEffect, useState } from "react";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
import { GiUsaFlag } from "react-icons/gi";
import { Avatar, Button } from "antd";
import arImg from "./../../../images/arabic.png";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";
let timeId;
const LangItem = ({ isMobile }) => {
  const { i18n, lan } = useUtilsContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelay, setIsOpenDelay] = useState(false);
  useEffect(() => {
    if (isOpen) timeId = setTimeout(() => setIsOpenDelay(isOpen));
    else timeId = setTimeout(() => setIsOpenDelay(isOpen), 500);
    return () => clearTimeout(timeId);
  }, [isOpen]);
  return (
    <div
      style={{
        direction: lan == "ar" ? "ltr" : "",
      }}
    >
      <div
        className={`${
          isMobile
            ? `rounded-lg ${lan == "ar" ? "p-0.25" : "p-2"}`
            : `${lan == "ar" ? "py-1" : "py-3"} px-2`
        } font-medium flex gap-2 text-white justify-between items-center shadow-lg 
        cursor-pointer hover:bg-blue-600/80 bg-blue-600/80 mr-px`}
        onClick={() => setIsOpen((val) => !val)}
      >
        <div className="flex gap-2 items-center justify-center">
          {lan == "ar" ? (
            <Avatar
              className="!-ml-2"
              src={arImg}
              shape="square"
              size="large"
            />
          ) : (
            <GiUsaFlag className="!mr-2 text-white text-xl" />
          )}
          {lan?.toUpperCase() || "EN"}
        </div>
        {!isOpen ? (
          <ArrowDownOutlined className="!text-white !text-xl !flex !items-center" />
        ) : (
          <ArrowUpOutlined className="!text-white !text-xl !flex !items-center" />
        )}
      </div>
      {(isOpen ? isOpen : isOpenDelay) ? (
        <div className="relative flex justify-end w-full">
          <div
            style={{
              top: (!isOpen ? isOpen : isOpenDelay) ? "" : "calc(100% + 20px)",
            }}
            className={`absolute w-full z-20 ${
              (!isOpen ? isOpen : isOpenDelay)
                ? "top-full opacity-100"
                : "opacity-0"
            } transition-all duration-500  overflow-hidden 
            flex flex-col gap-2 bg-blue-500/80 p-2`}
          >
            <Button
              style={{
                border: lan == "en" ? "solid 0.2px white" : "",
              }}
              className={`!font-medium ${
                lan == "en"
                  ? "!bg-blue-900 !hover:bg-gray-700 !shadow-2xl"
                  : "hover:!bg-blue-800/80 !bg-blue-700/80 !shadow-lg"
              } !rounded !text-white !flex gap-2 !items-center !justify-center`}
              onClick={() => {
                i18n.changeLanguage("en");
                setIsOpen(null);
              }}
            >
              <GiUsaFlag className="!mr-2 text-white text-xl" />
              En
            </Button>
            <Button
              style={{
                border: lan == "ar" ? "solid 0.2px white" : "",
              }}
              className={`!font-medium ${
                lan == "ar"
                  ? "!bg-blue-900 !hover:bg-gray-700 !shadow-2xl"
                  : "hover:!bg-blue-800/80 !bg-blue-700/80 !shadow-lg"
              } !rounded !text-white !flex gap-2 !items-center !justify-center`}
              onClick={() => {
                i18n.changeLanguage("ar");
                setIsOpen(null);
              }}
            >
              <Avatar
                className="!-ml-2"
                src={arImg}
                shape="square"
                size="large"
              />
              Ar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LangItem;
