import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useSlotsContext } from "../../../contexts/SlotsContextProvider";
import { Button, Empty, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import DatePicker from "./DatePicker";
import BookButton from "../../bookAppointment/appointmentUtils/BookButton";
import { useUserContext } from "../../../contexts/UserContextProvider";
const BookCard = ({ doctorId, socket, timeZone, isPayment, setIsPayment }) => {
  const { slotsData, isLoading, fetchSlotsData } = useSlotsContext();
  const { messageApi, fetchUserData, userData } = useUserContext();
  const [selectedDate, setSelectedDate] = useState(() => ({
    count: 0,
    date: dayjs().format("YYYY-MM-DD"),
  }));
  const [bookedAppointment, setBookedAppointment] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    socket?.emit("join_doctor", doctorId);
  }, []);
  useEffect(() => {
    const fetchSlots = (data) => {
      if (selectedDate.date == data?.date)
        fetchSlotsData(
          {
            date: selectedDate.date,
            doctorId,
          },
          true
        );
    };
    if (doctorId && selectedDate.date) {
      fetchSlotsData({
        date: selectedDate.date,
        doctorId,
      });
      socket?.on("update_slots", fetchSlots);
    }
    return () => socket?.off("update_slots", fetchSlots);
  }, [selectedDate.date]);
  // console.log(bookedAppointment);
  const isToday = (val) =>
    new Date(selectedDate.date + " " + val) > Date.now() + 1000 * 60;
  return (
    <>
      {/* <PopUp
        show={isPayment == "payment_processing"}
        mt="20px"
        customWidth={"w-5/6 sm:w-4/5 lg:w-3/4"}
        handleClose={() => {
          setIsPayment(null);
        }}
      >
        {isPayment == "payment_processing" ? (
          <AppointmentPayment
            setIsPayment={setIsPayment}
            bookedAppointment={bookedAppointment}
            selectedDate={dayjs(selectedDate?.date)}
            doctorId={doctorId}
            setBookedAppointment={setBookedAppointment}
            messageApi={messageApi}
            socket={socket}
            // AppointmentType={app}
          />
        ) : null}
      </PopUp> */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={`doctor--slots //sm:w-1/3 //xl:w-1/4 flex flex-col shadow-lg rounded bg-gray-200`}
      >
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="flex flex-col py-2 grow justify-center items-center">
          {slotsData?.freeSlots?.some(({ slotTime: value }) =>
            isToday(value)
          ) ? (
            <>
              <div
                className="flex items-center justify-center flex-wrap rounded-md shadow-2xl p-2 grow gap-2 scroll--h scroll--v scroll--v--chat w-3/4"
                style={{
                  height: "200px",
                  overflow: "auto",
                }}
              >
                {slotsData?.freeSlots?.map(
                  (
                    {
                      slotTime: value,
                      appointmentType,
                      appointmentFees,
                      appointmentState,
                      schedule_date,
                    },
                    i
                  ) =>
                    isToday(value) && (
                      <div
                        className={`flex cursor-pointer flex-col relative rounded-lg 
    ${
      bookedAppointment?.slotTime == value ? "bg-gray-700" : "bg-blue-800/80"
    } p-2`}
                        onClick={() =>
                          setBookedAppointment((val) =>
                            val?.slotTime == value
                              ? null
                              : slotsData?.freeSlots?.[i]
                          )
                        }
                        key={value}
                      >
                        <BookButton
                          slotTime={value}
                          timeZone={timeZone || ""}
                          schedule_date={schedule_date}
                          appointmentState={appointmentState}
                          appointmentType={appointmentType}
                          appointmentFees={appointmentFees}
                        />
                      </div>
                    )
                )}
              </div>
              <Popover
                trigger={"click"}
                showArrow={false}
                open={
                  bookedAppointment && userData && userData?.user_id != doctorId
                    ? false
                    : null
                }
                content={
                  <span className="font-medium">
                    {!bookedAppointment
                      ? "select your Appointment first"
                      : !userData
                      ? "signup/login first to book your appointment"
                      : "it's your profile"}
                  </span>
                }
              >
                <Button
                  //           className={`!flex !justify-center !items-center ${
                  //             bookedAppointment
                  //               ? "!bg-gray-700 hover:!text-blue-300"
                  //               : "!bg-gray-400 cursor-not-allowed"
                  //           } py-1.5 hover:!text-gray-200
                  //         !text-white font-mono
                  // !rounded w-full !text-xs lg:!text-sm`}
                  //           style={{
                  //             height: "35px",
                  //           }}
                  //           disabled={bookedAppointment ? false : true}
                  //           onClick={() => (bookedAppointment ? "" : null)}
                  onClick={() => {
                    if (
                      bookedAppointment &&
                      userData &&
                      userData?.user_id != doctorId
                    )
                      // setIsPayment("payment_processing");
                      navigate(`/profile/${doctorId}`);
                    window?.localStorage?.setItem(
                      "book_appointment",
                      bookedAppointment?.appointmentId
                    );
                  }}
                  type="primary"
                  className={`!my-4 m-auto sm:!font-medium !h-12 w-2/3 !block ${
                    !bookedAppointment ||
                    !(userData && userData?.user_id != doctorId)
                      ? "!bg-gray-100 !text-gray-400 !bg-gray-200 !border-gray-400"
                      : "hover:!bg-gray-800 !bg-gray-700"
                  }  !rounded-lg`}
                >
                  Book Now
                </Button>
              </Popover>
            </>
          ) : isLoading ? (
            <Loader />
          ) : slotsData?.freeSlots ? (
            <Empty
              description={
                <span className="font-medium text-gray-700">
                  all slots booked
                </span>
              }
            />
          ) : (
            <Empty
              className="w-full flex flex-col items-center"
              description={
                <div className="font-medium text-gray-700">
                  there's no slots available
                </div>
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BookCard;
