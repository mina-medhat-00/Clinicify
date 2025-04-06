import React, { useEffect, useState } from "react";
import { useAppointmentContext } from "../../../contexts/AppointmentContextProvider";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import Loader from "../../Loader";
import { useChatContext } from "../../../contexts/ChatContextProvider";

const ChatAvailability = ({
  withUser,
  withUserType,
  timeZone,
  withNickName,
}) => {
  const { appointmentData, isLoading, fetchAppointmentData } =
    useAppointmentContext();
  const { fetchChatData } = useChatContext();
  const [remainingTime, setRemainingTime] = useState(null);
  useEffect(() => {
    fetchAppointmentData(true, new Cookies().get("accessToken"), null, null, {
      doctorId: withUser,
    });
  }, []);
  useEffect(() => {
    let temp_app = new Array(...(appointmentData ? appointmentData : []));
    let is_exist;
    let timeId;
    while (!is_exist && temp_app?.length) {
      const nearestTime = temp_app?.reduce(
        (pre, curr) =>
          new Date(`${pre?.schedule_date} ${pre?.slot_time}`) <
          new Date(`${curr?.schedule_date} ${curr?.slot_time}`)
            ? pre
            : curr,
        null
      );
      if (nearestTime) {
        const schedule_date = nearestTime?.schedule_date;
        const slotTime = nearestTime?.slot_time;
        const targetDate = new Date(`${schedule_date} ${slotTime} ${timeZone}`);
        const dateNow = new Date();
        if (dateNow < targetDate) {
          setRemainingTime(targetDate.toLocaleString());
          is_exist = true;
          timeId = setTimeout(() => {
            fetchChatData(
              true,
              new Cookies().get("accessToken"),
              {
                chat_to: withUser,
              },
              true
            );
          }, [targetDate?.getTime() + 1000]);
        } else if (
          dateNow.getTime() <
          targetDate.getTime() + nearestTime?.appointment_duration
        ) {
          is_exist = true;
          fetchChatData(
            true,
            new Cookies().get("accessToken"),
            {
              chat_to: withUser,
            },
            true
          );
          setRemainingTime("Right Now !!");
        }
        temp_app = temp_app?.filter(
          ({ appointment_id }) => appointment_id != nearestTime?.appointment_id
        );
      }
    }
    return () => clearTimeout(timeId);
  }, [appointmentData]);
  return (
    <div className="bg-gray-600 px-1 rounded-tr-lg py-8 rounded-tl-lg font-medium text-white">
      {appointmentData?.length && remainingTime ? (
        <div className="flex flex-wrap justify-evenly gap-1">
          <div className="text-lg text-gray-300  font-bold">
            Chating with Your Doctor opens at
          </div>
          <span className="text-lg font-bold">{remainingTime}</span>
        </div>
      ) : isLoading ? (
        <Loader />
      ) : withUserType == "doctor" ? (
        <div className="flex flex-wrap px-1 justify-evenly gap-2 text-lg items-center">
          <div>There's no Appointments Booked yet</div>
          <Link
            to={`/profile/${withUser}`}
            className="hover:bg-blue-500 bg-blue-400 p-4 text-center !text-sm 
          rounded-md text-white hover:text-gray-100"
          >
            Book Now
          </Link>
        </div>
      ) : (
        <div>Cannot Chat with {withNickName} right now</div>
      )}
    </div>
  );
};

export default ChatAvailability;
