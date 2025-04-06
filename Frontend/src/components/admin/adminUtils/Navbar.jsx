import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiDashboardLine, RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Popover } from "antd";
const NavButton = ({
  name,
  title,
  customFunc,
  icon,
  color,
  dotColor,
  dashType,
}) => (
  <Popover
    open={title == "Menu" || dashType == name ? false : null}
    showArrow={false}
    content={<span className="!text-gray-700 !font-medium">{title}</span>}
  >
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className={`relative text-xl rounded-full p-3 ${
        dashType == name ? "bg-gray-700 text-gray-100" : "hover:bg-light-gray"
      }`}
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Popover>
);

const Navbar = ({
  dashType,
  isMobile,
  setActiveMenu,
  activeMenu,
  setDashType,
  user,
}) => {
  useEffect(() => {
    if (isMobile) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [isMobile]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div
      style={{
        height: "61.5px",
      }}
      className={`flex justify-between border-b-2 !bg-white shadow-md border-gray-700/50 p-2 ${
        dashType == "chat" ? "" : "xl:mx-6"
      } relative`}
    >
      <NavButton
        title="Menu"
        name="menu"
        dashType={dashType}
        customFunc={handleActiveMenu}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Chat"
          name="chat"
          dashType={dashType}
          dotColor="#03C9D7"
          customFunc={() => setDashType("chat")}
          icon={<BsChatLeft />}
        />
        <NavButton
          name="reports"
          dashType={dashType}
          title="reports"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => setDashType("reports")}
          icon={<RiNotification3Line />}
        />
        <div
          className={`${
            dashType == "profile"
              ? "bg-gray-700 text-gray-100"
              : "hover:bg-gray-100 text-gray-400"
          } flex items-center gap-2 cursor-pointer p-1 rounded-lg`}
          onClick={() => setDashType("profile")}
        >
          {user?.img_url ? (
            <img
              className="rounded-full w-8 h-8"
              src={user.img_url}
              alt="user-profile"
            />
          ) : null}
          <p>
            <span className="text-14">Hi,</span>{" "}
            <span className="font-bold ml-1 text-14">{user?.nick_name}</span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
