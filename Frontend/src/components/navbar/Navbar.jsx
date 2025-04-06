import React, { useEffect, useRef, useState } from "react";
import { Button, Typography, Menu, Avatar, Select } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clinicLogo from "../../images/clinic.png";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined } from "@ant-design/icons";
import items from "./navbarUtils/navItems.jsx";
import { FaEllipsisV } from "react-icons/fa";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";
import { useUserContext } from "../../contexts/UserContextProvider";
import LangItem from "./navbarUtils/LangItem";

const { Title, Item } = { ...Typography, ...Menu };
const Navbar = ({ DoctorRef }) => {
  const { messageApi, lan, t } = useUtilsContext();
  const { setUserData, userData: user, isLoading } = useUserContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width:678px)",
  });
  const [showMenu, setShowMenu] = useState(false);
  const navElement = useRef(null);
  const [navWidth, setNavWidth] = useState(290);
  const menuElement = useRef(null);
  const location = useLocation();
  const toggle = () => {
    setShowMenu((state) => !state);
  };
  useEffect(() => {
    setShowMenu(false);
    setTimeout(() => {
      if (menuElement?.current?.menu?.list?.style) {
        menuElement.current.menu.list.style.transition = "none !important";
        navElement.current.style.transition = "none";
        setTimeout(() => {
          if (menuElement?.current?.menu?.list?.style) {
            navElement.current.style.transition = "";
            menuElement.current.menu.list.style.transition =
              "background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s,height 0.5s ease";
          }
        });
      }
    });
  }, [isMobile]);
  return (
    !(
      (
        (isMobile && location.pathname.includes("/chat")) ||
        location.pathname.includes("/admin")
      )
      // ||
      //(location.pathname.includes("/dashboard") &&
      //window.localStorage.getItem("dashType") == "chat")
    ) && (
      <div
        ref={navElement}
        className={`
      ${isMobile ? "relative bg-gray-800" : "flex flex-col fixed h-full"}
      navbar--container app--navbar z-20`}
        style={{
          marginLeft: `${!isMobile ? -navWidth : 0}px`,
          minWidth: isMobile ? undefined : "290px",
          maxWidth: isMobile ? undefined : "290px",
          boxShadow: "inset -1px 0px white",
          // backgroundColor: !isMobile ? "rgb(8 14 20)" : "",
          backgroundColor: "rgb(20, 57, 94)",
        }}
      >
        {!isMobile ? (
          <>
            {/* <div
              className="icon--mask"
              style={{
                // backgroundColor: "rgb(6 16 20)",
                backgroundColor: "white",
                width: "1px",
                top: "5%",
                height: "50px",
                left: "calc(100% - 1px)",
              }}
            ></div> */}
            <div
              className="show--navbar items-center justify-end flex
          -z-10 absolute cursor-pointer"
              style={{
                // backgroundColor: "rgb(6 16 20)",
                backgroundColor: "rgb(20 57 94)",
                width: "45px",
                height: "45px",
                top: "5%",
                /* border: 12px transparent solid; */
                left: "calc(100% - 15px)",
                borderTopRightRadius: "50%",
                borderBottomRightRadius: "50%",
              }}
              onClick={() => {
                setNavWidth((width) =>
                  width == 0 ? navElement?.current?.offsetWidth : 0
                );
              }}
            >
              <FaEllipsisV className="!text-gray-100 !text-2xl mr-1" />
              {/* {navWidth != 0 ? (
            <TbLayoutSidebarRightCollapse
            size={50}
              className={`
              ${
                location?.pathname == "/" ||
                location?.pathname.includes("doctors")
                  ? "!bg-gray-300 rounded-xl"
                  : "text-gray-200 !bg-gray-700 rounded-xl"
              }`}
              color={`${
                location?.pathname == "/" ||
                location?.pathname.includes("doctors")
                  ? "rgb(8 14 20)"
                  : ""
              }`}
              />
          ) : (
            <TbLayoutSidebarLeftCollapse
            size={50}
            className={`
               ${
                 location?.pathname == "/" ||
                 location?.pathname.includes("doctors")
                 ? "!bg-gray-300 rounded-xl"
                   : "text-gray-200 !bg-gray-700 rounded-xl"
                  }`}
              color={`${
                location?.pathname == "/" ||
                location?.pathname.includes("doctors")
                ? "rgb(8 14 20)"
                : ""
              }`}
              />
            )} */}
            </div>
          </>
        ) : null}
        {/* {!isMobile && (
          <SignBanner
            messageApi={messageApi}
            isUserLoading={isUserLoading}
            setShowMenu={setShowMenu}
            user={user}
            setUserData={setUserData}
          />
        )} */}
        <div
          className={
            isMobile
              ? `mx-1 w-full flex items-center
      justify-between flex-wrap gap-2`
              : "text-center"
          }
        >
          <Link to="/" className="navbar--logo text-center">
            <Avatar
              src={clinicLogo}
              size="large"
              shape="square"
              style={{ marginTop: "15px" }}
              className="navbar--logo--view !mt-2 !mb-1"
            ></Avatar>
            <Title
              level={3}
              className={`navbar--logo--title ${
                isMobile ? "!text-gray-100" : "!text-blue-100"
              }`}
            >
              {t("Online Clinic")}
            </Title>
          </Link>
          <LangItem isMobile={isMobile} />
          {isMobile ? (
            <Button
              onClick={toggle}
              className="menu--button grow
          !h-10 !flex  justify-center items-center"
            >
              <MenuOutlined />
            </Button>
          ) : null}
        </div>
        <Menu
          ref={menuElement}
          theme="dark"
          mode={!isMobile ? "inline" : "vertical"}
          className={`navbar--menu ${lan == "ar" ? "ar--nav" : ""} ${
            isMobile
              ? "top-full absolute sm"
              : "!overflow-x-hidden !overflow-y-auto"
          }`}
          style={{
            paddingInline: "5px",
            height: `
        ${
          !isMobile
            ? ""
            : showMenu
            ? `${menuElement?.current?.menu?.list?.children?.length * 48}px`
            : "0px"
        }`,
            transition:
              "background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s,height 0.5s ease",
            fontSize: "medium",
            // backgroundColor:"#285885",
            backgroundColor: "rgb(20, 57, 94)",
            // backgroundColor: !isMobile ? "rgb(8 14 20)" : "",
            boxShadow: "inset -1px 0px white",
          }}
          items={items(
            t,
            navigate,
            location,
            DoctorRef,
            user,
            messageApi,
            setUserData,
            isMobile,
            isLoading
          )}
          onClick={toggle}
        ></Menu>
      </div>
    )
  );
};

export default Navbar;
