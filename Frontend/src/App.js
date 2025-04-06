import React, { useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import {
  Navbar,
  HomePage,
  Doctors,
  Feedbacks,
  UserProfile,
  Login,
  Signup,
  DoctorDashboard,
  Loader,
  Chat,
  Posts,
  OnlineMeeting,
} from "./components";
import Footer from "./components/footer/Footer";
import Cookies from "universal-cookie";
import {
  DoctorsContextProvider,
  HomeContextProvider,
  ProfileContextProvider,
  DashboardContextProvider,
  FeedbackContextProvider,
  PostsContextProvider,
  ChatContextProvider,
} from "./contexts";
import { useUserContext } from "./contexts/UserContextProvider";
import Appointments from "./components/appointments/Appointments";
import AppointmentContextProvider from "./contexts/AppointmentContextProvider";
import AppointmentPayment from "./components/bookAppointment/appointmentUtils/AppointmentPayment";
import ServerError from "./components/utils/ServerError";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useUtilsContext } from "./contexts/UtilsContextProvider";
import ReportProblem from "./components/reportProblem/ReportProblem";

const cookies = new Cookies();
const handleRoute = (element, permission, isLoading, isError) =>
  permission ? (
    element
  ) : isLoading ? (
    <Loader />
  ) : isError ? (
    <Navigate to="/error" replace />
  ) : (
    <Navigate to="/forbbiden" replace />
  );
const App = () => {
  const [navActive, setNavActive] = useState(true);
  const DoctorRef = useRef();
  const location = useLocation();
  const { userData, isLoading, isError } = useUserContext();
  const { lan } = useUtilsContext();
  // if (userData) window.localStorage.setItem("user", JSON.stringify(userData));
  const userAuth = userData;
  return (
    <div
      className={`overflow-x-hidden //scroll--h app flex flex-col min-h-screen`}
    >
      <div className="app--wrapper grow">
        {navActive && <Navbar DoctorRef={DoctorRef} />}
        <div
          className="app--main flex flex-col grow"
          style={{
            backgroundColor: "#f5f5f5",
            direction: lan == "ar" ? "rtl" : "",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomeContextProvider>
                  <HomePage />
                </HomeContextProvider>
              }
            />
            <Route path="/join/meeting/:session" element={<OnlineMeeting />} />

            <Route
              path="/forbbiden"
              element={
                <ServerError
                  statusTitle={"403"}
                  status={403}
                  message="Cannot access Resource Right now"
                />
              }
            />
            <Route path="/error" element={<ServerError />} />
            <Route
              path="/doctors"
              element={
                <DoctorsContextProvider noFirstRender>
                  <Doctors ref={DoctorRef} />
                </DoctorsContextProvider>
              }
            />
            <Route
              path="/chat"
              element={handleRoute(
                <ChatContextProvider token={cookies.get("accessToken")}>
                  <Chat isChat={true} />
                </ChatContextProvider>,
                userAuth,
                isLoading,
                isError
              )}
            />
            <Route
              path="/profile/:username"
              element={
                <ProfileContextProvider>
                  <UserProfile />
                </ProfileContextProvider>
              }
            />
            <Route
              path="/feedbacks"
              element={
                <FeedbackContextProvider>
                  <Feedbacks />
                </FeedbackContextProvider>
              }
            />
            <Route
              path="/posts"
              element={
                <PostsContextProvider>
                  <Posts />
                </PostsContextProvider>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/appointment/payment"
              element={<AppointmentPayment />}
            />
            <Route
              path="/appointments"
              element={handleRoute(
                <AppointmentContextProvider token={cookies.get("accessToken")}>
                  <Appointments />
                </AppointmentContextProvider>,
                userAuth && userAuth?.user_type !== "admin",
                isLoading,
                isError
              )}
            />
            <Route
              path="/admin"
              element={handleRoute(
                <AdminDashboard />,
                userAuth?.user_type == "admin",
                isLoading,
                isError
              )}
            />
            <Route
              path="/report/problem"
              element={handleRoute(
                <ReportProblem />,
                !!userAuth?.user_type,
                isLoading,
                isError
              )}
            />
            <Route
              path="/dashboard"
              element={handleRoute(
                <DashboardContextProvider token={cookies.get("accessToken")}>
                  <DoctorDashboard setNavActive={setNavActive} />
                </DashboardContextProvider>,
                userAuth?.user_type == "doctor",
                isLoading,
                isError
              )}
            />
          </Routes>
        </div>
      </div>
      {location.pathname == "/" && (
        <div className="app--footer">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;
