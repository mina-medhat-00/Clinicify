import React, { useEffect, useState } from "react";
import { useSlotsContext } from "../../../contexts/SlotsContextProvider";
import { BiLoader } from "react-icons/bi";
import { Empty } from "antd";
import scheduleAppointments from "../../doctorDashboard/dashboardServices/scheduleAppointments";
import AppointmentCard from "../../doctorDashboard/dashboardUtils/scheduleUtils/AppointmentCard";
import PopUp from "../../utils/PopUp";
import { cancelAppointment } from "../../doctorDashboard/dashboardServices";
import DatePicker from "../../doctors/doctorsUtils/DatePicker";
import dayjs from "dayjs";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
import { useUserContext } from "../../../contexts/UserContextProvider";
const AppointmentDetails = ({ doctorId }) => {
  const { timeZone, messageApi, socket } = useUtilsContext();
  const { fetchUserData } = useUserContext();
  const [selectedDate, setSelectedDate] = useState({
    count: 0,
    date: dayjs().format("YYYY-MM-DD"),
  });
  const { slotsData, isLoading, fetchSlotsData } = useSlotsContext();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPop, setShowPop] = useState();
  useEffect(() => {
    socket.emit("join_doctor", doctorId);
  }, []);
  useEffect(() => {
    const getSlots = (data) => {
      if (selectedDate?.date == data?.date)
        fetchSlotsData(
          {
            doctorId,
            date: selectedDate?.date,
          },
          true
        );
    };
    if (selectedDate?.date) {
      socket.on("update_slots", getSlots);
      fetchSlotsData({
        doctorId,
        date: selectedDate?.date,
      });
    }
    return () => {
      socket?.off("all_slots", getSlots);
    };
  }, [selectedDate]);
  return (
    <>
      <DatePicker
        fromAppointment={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="mt-2 max-h-52 overflow-auto p-1">
        <div className="flex gap-2 justify-evenly flex-wrap">
          <PopUp
            show={showPop}
            handleClose={() => {
              setShowPop(null);
              setSelectedAppointment(null);
            }}
          >
            <div className="text-center text-sm sm:text-lg p-2 bg-blue-400 text-white font-medium rounded-lg">
              {`${selectedAppointment?.slotTime} already booked`}
              <br /> Are you sure that you want cancel it ?
            </div>
            <div className="flex justify-center gap-2 p-2 mt-4">
              <div
                onClick={() => {
                  cancelAppointment(
                    dayjs(selectedDate?.date),
                    selectedAppointment?.slotTime,
                    selectedAppointment?.appointmentId,
                    messageApi,
                    fetchSlotsData,
                    doctorId,
                    setSelectedAppointment,
                    "admin",
                    fetchUserData,
                    null,
                    setShowPop,
                    socket
                  );
                }}
                className="cursor-pointer text-center !bg-red-500 p-2 grow text-white font-medium rounded-lg shadow-sm"
              >
                Apply
              </div>
              <div
                onClick={() => setShowPop(null)}
                className="cursor-pointer text-center !bg-blue-400 p-2 text-white font-medium rounded-lg shadow-sm"
              >
                Cancel
              </div>
            </div>
          </PopUp>
          {isLoading ? (
            <BiLoader />
          ) : !slotsData?.totalSlots?.length ? (
            <Empty
              className="flex flex-col"
              description={
                <span className="font-medium text-white bg-gray-400 p-1 rounded-md">
                  No Appointments Scheduled
                </span>
              }
            />
          ) : (
            slotsData?.totalSlots?.map(
              ({
                appointmentType,
                appointmentState,
                appointmentDuration,
                appointmentFees,
                appointmentId,
                slotTime,
              }) => (
                <div
                  key={appointmentId}
                  className="grow"
                  //   className={`rounded-md relative p-2 ${
                  //     appointmentState == "free"
                  //       ? "bg-blue-700/60"
                  //       : appointmentState == "booked"
                  //       ? "bg-yellow-600/60"
                  //       : appointmentState == "canceled"
                  //       ? "bg-red-700/60"
                  //       : "bg-gray-700/40"
                  //   }`}
                >
                  <AppointmentCard
                    timeZone={timeZone}
                    selectedDate={dayjs(selectedDate?.date)}
                    socket={socket}
                    tAppointments={slotsData?.totalSlots}
                    setShowPop={setShowPop}
                    setBookedAppointment={setSelectedAppointment}
                    admin={true}
                    userid={doctorId}
                    slotTime={slotTime}
                    fetchSlotsData={fetchSlotsData}
                    fetchUserData={fetchUserData}
                    appointmentFees={appointmentFees}
                    appointmentId={appointmentId}
                    appointmentState={appointmentState}
                    appointmentType={appointmentType}
                    messageApi={messageApi}
                    scheduleAppointments={scheduleAppointments}
                  />
                  {/* <AppointmentShape
                slotTime={slotTime}
                appointmentFees={appointmentFees}
                appointmentType={appointmentType}
                appointmentState={appointmentState}
              /> */}
                </div>
              )
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentDetails;
