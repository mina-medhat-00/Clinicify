import React from "react";
import VideoMeeting from "./onlineMeetingUtils/VideoMeeting";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";
import Loader from "../Loader";

const OnlineMeeting = () => {
  const { session } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const appointment_id = searchParams.get("appointment_id");
  const { userData: user, isLoading } = useUserContext();

  return isLoading ? (
    <Loader />
  ) : user && session && appointment_id ? (
    <VideoMeeting
      username={user?.user_name}
      nickname={user?.nick_name}
      appointmentId={appointment_id}
      session={session}
    />
  ) : !user ? (
    <div className="w-1/2 text-center !m-auto text-white font-medium p-2 bg-blue-400 rounded-md">
      <div className="bg-blue-500 rounded text-lg py-8 shadow">
        Sign Up or Login First
      </div>
      <div className="flex gap-2 items-center justify-center !mt-8">
        <Link
          to="/signup"
          className="p-2 hover:!bg-white !bg-gray-100 rounded !text-blue-500 !font-semibold hover:!text-blue-600"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="p-2 hover:!bg-white !bg-gray-100 rounded !text-blue-500 !font-semibold hover:!text-blue-600"
        >
          Login
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-1/2 text-center !m-auto text-white font-medium p-2 bg-blue-500/80 rounded-md">
      <div className="bg-red-500/80 rounded text-lg py-8 shadow">
        Please, Fill All Required Informations
      </div>
      <div className="flex gap-2 items-center justify-center !mt-8">
        <Link
          to="/"
          className="p-2 hover:!bg-white !bg-gray-100 rounded !text-blue-500 !font-semibold hover:!text-blue-600"
        >
          Go Home
        </Link>
        <Link
          to="/doctors"
          className="p-2 hover:!bg-white !bg-gray-100 rounded !text-blue-500 !font-semibold hover:!text-blue-600"
        >
          Find Doctors
        </Link>
      </div>
    </div>
  );
};

export default OnlineMeeting;
