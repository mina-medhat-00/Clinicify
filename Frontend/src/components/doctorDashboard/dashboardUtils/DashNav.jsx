import React from "react";
import "./DashNav.css";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { ImStatsDots } from "react-icons/im";
import { ImProfile } from "react-icons/im";
import { useMediaQuery } from "react-responsive";
import { Popover } from "antd";
import { HomeOutlined } from "@ant-design/icons";
const DashNav = ({ setDashType, dashType }) => {
  const items = [
    {
      name: "profile",
      label: "Profile",
      icon: <ImProfile className="w-full !text-lg sm:!text-2xl" />,
    },
    {
      name: "schedule",
      label: "Schedule Appointments",
      icon: <AiOutlineSchedule className="w-full !text-lg sm:!text-2xl" />,
    },
    {
      name: "appointments",
      label: "My Appointments",
      icon: <ImProfile className="w-full !text-lg sm:!text-2xl" />,
    },
    {
      name: "chat",
      label: "Answer Your Patient",
      icon: <RiQuestionAnswerLine className="w-full !text-lg sm:!text-2xl" />,
    },
    {
      name: "statistics",
      label: "Statistics",
      icon: <ImStatsDots className="w-full !text-lg sm:!text-2xl" />,
    },
  ];
  const isMobile = useMediaQuery({
    query: "(max-width:678px)",
  });
  return (
    <div
      className={`nav--container shrink-0 relative z-10 bg-gray-500 flex flex-col  ${
        isMobile ? "border-r" : "h-fit border-y-2"
      }`}
    >
      <div
        className={`nav--items flex ${
          isMobile ? "flex-col justify-start" : "w-full"
        } flex-wrap
   cursor-pointer`}
      >
        {items?.map(({ label, icon, name }, i) => (
          <Popover
            placement={isMobile ? "rightBottom" : undefined}
            key={i}
            showArrow={isMobile ? false : true}
            content={<span className="text-white">{name}</span>}
            color="blue-inverse"
            overlayInnerStyle={{
              backgroundColor: "#4a5568",
              fontWeight: "500",
            }}
          >
            <div
              onClick={() => {
                window.localStorage.setItem("dashType", name);
                setDashType(name);
              }}
              className={`flex item--${i + 1} flex-wrap hover:underline ${
                dashType == name ? "bg-yellow-600" : "hover:bg-gray-400"
              } sm:hover:no-underline
        hover:shadow-md box-border ${
          isMobile ? "w-full px-3 py-6 text-xs font-medium" : "p-3 grow w-1/5"
        } sm:text-sm lg:text-lg sm:font-medium text-white`}
            >
              <button
                className={`w-full h-full  ${
                  dashType == name ? "" : "hover:text-gray-700"
                }`}
              >
                {icon}
                {/* <span className="w-full text-center inline-block">{label}</span> */}
              </button>
            </div>
          </Popover>
        ))}
        <div
          className={`${isMobile ? "item--line--v" : "item--line"} bg-gray-600`}
        ></div>
      </div>
    </div>
  );
};

export default DashNav;
