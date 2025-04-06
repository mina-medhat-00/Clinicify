import React, { useEffect, useState } from "react";
import { Navbar, Sidebar } from "./adminUtils";
import "./AdminDashboard.css";
import { useMediaQuery } from "react-responsive";
import DoctorManagment from "./adminUtils/DoctorManagment";
import {
  ChatContextProvider,
  DoctorsContextProvider,
  ProfileContextProvider,
  UsersContextProvider,
} from "../../contexts";
import Chat from "../chat/Chat";
import { useUserContext } from "../../contexts/UserContextProvider";
import UserProfile from "../user/profile/UserProfile";
import UserManagment from "./adminUtils/UserManagment";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";
import AdminReports from "./adminUtils/AdminReports";
import ReportContextProvider from "../../contexts/ReportContextProvider";
const AdminDashboard = () => {
  const isMobile = useMediaQuery({
    query: "(max-width:878px)",
  });
  const { timeZone, socket, messageApi } = useUtilsContext();
  const { fetchUserData, isLoading, userData: user } = useUserContext();
  const [activeMenu, setActiveMenu] = useState(false);
  const [dashType, setDashType] = useState(
    window.localStorage.getItem("adminDashType")
  );
  useEffect(() => {
    if (dashType) window.localStorage.setItem("adminDashType", dashType);
  }, [dashType]);
  return (
    <div>
      <div className="flex relative dark:bg-main-dark-bg">
        {activeMenu ? (
          <div className="fixed w-full sm:w-64 sidebar dark:bg-secondary-dark-bg bg-white ">
            <Sidebar
              user={user}
              setDashType={setDashType}
              dashType={dashType}
              isMobile={isMobile}
              setActiveMenu={setActiveMenu}
              activeMenu={activeMenu}
            />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar
              user={user}
              setDashType={setDashType}
              dashType={dashType}
              isMobile={isMobile}
              setActiveMenu={setActiveMenu}
              activeMenu={activeMenu}
            />
          </div>
        )}
        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-64 w-full  "
              : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
          }
        >
          <div className="mb-16 md:mb-0">
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar
                user={user}
                dashType={dashType}
                isMobile={isMobile}
                setDashType={setDashType}
                setActiveMenu={setActiveMenu}
                activeMenu={activeMenu}
              />
            </div>
          </div>
          {dashType == "doctor" ? (
            <DoctorsContextProvider query={{ total: true }}>
              <DoctorManagment socket={socket} timeZone={timeZone} />
            </DoctorsContextProvider>
          ) : dashType == "user" ? (
            <UsersContextProvider>
              <DoctorsContextProvider query={{ total: true }}>
                <UserManagment socket={socket} />
              </DoctorsContextProvider>
            </UsersContextProvider>
          ) : dashType == "chat" ? (
            <ChatContextProvider fetchUserData={fetchUserData}>
              <Chat
                isAdmin={true}
                user={user}
                fetchUserData={fetchUserData}
                messageApi={messageApi}
                socket={socket}
                timeZone={timeZone}
              />
            </ChatContextProvider>
          ) : dashType == "profile" ? (
            <ProfileContextProvider>
              <UserProfile
                isUserLoading={isLoading}
                socket={socket}
                fetchUserData={fetchUserData}
                timeZone={timeZone}
                userid={user?.user_id}
              />
            </ProfileContextProvider>
          ) : dashType == "reports" ? (
            <ReportContextProvider>
              <AdminReports />
            </ReportContextProvider>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
