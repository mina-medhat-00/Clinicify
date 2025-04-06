import React from "react";
import Loader from "../../Loader";
import { BsFillCalendar2CheckFill } from "react-icons/bs";

const AppointmentSuccess = ({ bookedAppointment }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <BsFillCalendar2CheckFill className="!flex !justify-center !items-center !text-green-600 !text-6xl" />
        <span className="!text-gray-700 text-2xl font-medium text-center">
          Your Appointment Successfully Booked
        </span>
        <div className="flex gap-2 flex-wrap w-full justify-between items-center">
          <span className="text-xl text-white bg-blue-800/60 p-2 rounded-md font-medium text-center">
            Time: {bookedAppointment?.schedule_date}
          </span>
          <span className="text-xl text-white bg-blue-800/60 p-2 rounded-md font-medium text-center">
            Time: {bookedAppointment?.slotTime}
          </span>
          <span className="text-xl text-white bg-blue-800/60 p-2 rounded-md font-medium text-center">
            Duration: {bookedAppointment?.appointmentDuration / (60 * 1000)} min
          </span>
        </div>
        <span className="!text-gray-700 bg-gray-300/60 p-2 rounded-md text-xl font-medium text-center">
          {bookedAppointment?.appointmentType}
        </span>
      </div>
    </div>
  );
};

export default AppointmentSuccess;
