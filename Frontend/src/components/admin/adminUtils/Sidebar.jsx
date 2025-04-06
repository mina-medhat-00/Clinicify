import React from "react";
import { Link } from "react-router-dom";
import {
  MdMessage,
  MdOutlineCancel,
  MdOutlineManageAccounts,
  MdPostAdd,
  MdReportProblem,
} from "react-icons/md";
import { DashboardOutlined, HomeOutlined } from "@ant-design/icons";
import { GiDoctorFace } from "react-icons/gi";
import { GrUserSettings } from "react-icons/gr";
import { FiUserCheck } from "react-icons/fi";
import { BsHouseDoorFill } from "react-icons/bs";
import { FaUserLock } from "react-icons/fa";
const links = [
  {
    title: "Dashboard",
    links: [
      {
        link: "profile",
        key: "profile",
        value: "My Profile",
        icon: <FaUserLock />,
      },
      {
        link: "users",
        key: "user",
        value: "Users Managment",
        icon: <FiUserCheck />,
      },
      {
        link: "doctors",
        key: "doctor",
        value: "Doctors Managment",
        icon: <MdOutlineManageAccounts />,
      },
      {
        link: "chat",
        key: "chat",
        value: "Chatting",
        icon: <MdMessage />,
      },
      {
        link: "reports",
        key: "reports",
        value: "Reports",
        icon: <MdReportProblem />,
      },
    ],
  },
  {
    title: "General",
    links: [
      {
        link: "",
        key: "home",
        value: "Home",
        icon: <HomeOutlined />,
      },
      {
        link: "doctors",
        key: "doctors",
        value: "Doctors",
        icon: <GiDoctorFace />,
      },
      {
        link: "posts",
        key: "posts",
        value: "Questions",
        icon: <MdPostAdd />,
      },
    ],
  },
];
const Sidebar = ({
  activeMenu,
  setActiveMenu,
  isMobile,
  setDashType,
  dashType,
}) => {
  const handleCloseSideBar = (value) => {
    if (value) setDashType(value);
    if (activeMenu !== undefined && isMobile) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 px-4 pt-3 pb-2.5 rounded-lg  text-white bg-blue-700  text-md m-2";
  const normalLink =
    "flex items-center gap-5 px-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-gray-100 m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <div
              onClick={() => handleCloseSideBar("profile")}
              className="transition-all duration-500 cursor-pointer hover:!text-blue-500 items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <DashboardOutlined />
              <span>Admin</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl text-gray-700 rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.title == "Dashboard"
                  ? item.links.map((link) => (
                      <button
                        key={link.key}
                        onClick={() => handleCloseSideBar(link.key)}
                        className={
                          link.key == dashType ? activeLink : normalLink
                        }
                      >
                        {link.icon}
                        <span className="capitalize">{link.value}</span>
                      </button>
                    ))
                  : item.links.map((link) => (
                      <Link
                        to={`/${link.link}`}
                        key={link.key}
                        onClick={() => handleCloseSideBar()}
                        className={
                          link.key == dashType ? activeLink : normalLink
                        }
                      >
                        {link.icon}
                        <span className="capitalize ">{link.value}</span>
                      </Link>
                    ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
