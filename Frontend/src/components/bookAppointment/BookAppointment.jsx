import { useParams } from "react-router-dom";
import { Button, Empty, message, Popover } from "antd";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useSlotsContext } from "../../contexts/SlotsContextProvider";
import Loader from "../Loader";
import bookAppointment from "./appointmentServices/bookAppointment";
import { CalendarView } from "../user/profile/profileUtils";
import PopUp from "../utils/PopUp";
import AppointmentPayment from "./appointmentUtils/AppointmentPayment";
import getStripe from "./appointmentUtils/getStripe";
import axios from "axios";
import Cookies from "universal-cookie";
import SuccessAppointment from "./appointmentUtils/SuccessAppointment";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe } from "@stripe/react-stripe-js";
import BookButton from "./appointmentUtils/BookButton";
import { useUserContext } from "../../contexts/UserContextProvider";
const { Title } = Typography;
function BookAppointment({ userid, doctorId, socket, timeZone }) {
  const { slotsData, isLoading, fetchSlotsData } = useSlotsContext();
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const { fetchUserData, messageApi } = useUserContext();
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isPayment, setIsPayment] = useState();
  const [appointmentSuccess, setAppointmentSuccess] = useState();
  const [freeSlots, setFreeSlots] = useState(null);
  const navigate = useNavigate();
  const bDate = window?.localStorage?.getItem("book_date");
  const [selectedDate, setSelectedDate] = useState(() =>
    bDate
      ? dayjs(bDate) > dayjs() &&
        dayjs(bDate).$M == dayjs().$M &&
        dayjs(bDate).$y == dayjs().$y
        ? dayjs(bDate)
        : dayjs()
      : dayjs()
  );
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );
  const appointmentId = window?.localStorage?.getItem("book_appointment");
  useEffect(() => {
    if (appointmentId && !bookedAppointment && !isPayment && !isLoading) {
      const appDetails = freeSlots?.filter(
        ({ appointmentId: appointment_id }) => appointmentId == appointment_id
      );
      if (appDetails) {
        setIsPayment("payment_processing");
        setBookedAppointment(appDetails?.[0]);
      }
    }
    if (appointmentId && !isLoading)
      window.localStorage.removeItem("book_appointment");
  }, [appointmentId, freeSlots]);
  console.log(isPayment);
  useEffect(() => {
    const handleBook = async () => {
      const stripe = await getStripe();
      if (!stripe || !clientSecret || isLoading) {
        return;
      }
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            const appointmentRecord = JSON.parse(paymentIntent?.description);
            if (
              appointmentRecord?.schedule_date ==
              selectedDate?.format("YYYY-MM-DD")
            ) {
              setIsPayment("payment_success");
              setAppointmentSuccess(appointmentRecord);
            } else {
              setSelectedDate(
                dayjs(
                  appointmentRecord?.schedule_date ||
                    appointmentRecord?.selected_date
                )
              );
            }
        }
      });
    };
    handleBook();
  }, [clientSecret]);
  useEffect(() => {
    setFreeSlots(slotsData?.freeSlots);
  }, [slotsData, selectedDate?.format("YYYY-MM-DD")]);
  useEffect(() => {
    socket.emit("join_doctor", doctorId);
  }, []);
  useEffect(() => {
    const getSlots = (data) => {
      if (selectedDate.format("YYYY-MM-DD") == data?.date)
        fetchSlotsData(
          {
            date: selectedDate.format("YYYY-MM-DD"),
            doctorId,
          },
          true
        );
    };
    if (doctorId && selectedDate.format("YYYY-MM-DD")) {
      socket.on("update_slots", getSlots);
      fetchSlotsData({
        date: selectedDate.format("YYYY-MM-DD"),
        doctorId,
      });
    }
    return () => {
      socket.off("update_slots", getSlots);
    };
  }, [selectedDate, doctorId]);
  const handleDate = (val) => {
    setSelectedDate(val);
    window?.localStorage?.setItem("book_date", val?.format("YYYY-MM-DD"));
  };
  const isToday = (val) =>
    new Date(selectedDate.format("YYYY-MM-DD") + " " + val + timeZone) >
    Date.now() + 1000 * 60;
  const isUpToDate =
    selectedDate?.$d?.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
  const isUser = userid && userid != doctorId; // user has account
  const title = "Book Your Appointment";
  const buttonLabel = "book your appointment";
  return (
    <div>
      <div className={`schedule--wrapper m-2 p-3 rounded`}>
        <Title className="!text-gray-700 !text-center !text-lg sm:!text-2xl lg:!text-3xl 2xl:!text-4xl">
          {title}
        </Title>
        <CalendarView selectedDate={selectedDate} handleDate={handleDate} />
        {/* =================================== for book appointment page ===================================== */}
        {isUpToDate && !isLoading ? (
          <>
            {!freeSlots ? (
              <Empty
                className="!mt-3"
                description={
                  <span className="font-medium text-gray-400">
                    there's no Appointments available yet
                  </span>
                }
              />
            ) : (
              <>
                <div className="flex flex-wrap gap-2 justify-center">
                  {freeSlots?.map(
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
                          className={`flex cursor-pointer flex-col relative sm:w-1/3 lg:w-1/4 2xl:w-1/5 grow justify-between rounded-lg 
                          ${
                            bookedAppointment?.slotTime == value
                              ? "bg-gray-700"
                              : "bg-blue-800/80"
                          } p-2`}
                          onClick={() =>
                            setBookedAppointment((val) =>
                              val?.slotTime == value ? null : freeSlots?.[i]
                            )
                          }
                          key={value}
                        >
                          <BookButton
                            slotTime={value}
                            schedule_date={schedule_date}
                            timeZone={timeZone}
                            appointmentState={appointmentState}
                            appointmentType={appointmentType}
                            appointmentFees={appointmentFees}
                          />
                        </div>
                      )
                  )}
                </div>
                {freeSlots.length ? (
                  <Popover
                    showArrow={false}
                    color={isUser && bookedAppointment ? "green" : "red"}
                    placement="topLeft"
                    trigger={"click"}
                    open={!isUser ? null : false}
                    content={
                      !isUser ? (
                        userid ? (
                          <span className="text-white font-medium">
                            it's already your profile
                          </span>
                        ) : (
                          <span className="text-white font-medium">
                            you need to signup or login
                          </span>
                        )
                      ) : bookedAppointment == null ? (
                        <span className="text-white font-medium">
                          select one Appointment
                        </span>
                      ) : (
                        <span className="text-white font-medium">Book now</span>
                      )
                    }
                  >
                    <Button
                      onClick={() => {
                        if (isToday(bookedAppointment?.slotTime)) {
                          // if (bookedAppointment && isUser)
                          setIsPayment("payment_processing");
                        } else {
                          messageApi?.open({
                            content: "choose recently date",
                            duration: 3,
                            type: "warning",
                          });
                        }
                      }}
                      type="primary"
                      className={`!my-4 m-auto sm:!font-medium !h-12 w-full sm:w-2/3 2xl:w-1/2 !block ${
                        !isUser || !bookedAppointment
                          ? "!bg-gray-100 !text-gray-400 !bg-gray-200 !border-gray-400 !pointer-events-none"
                          : "hover:!bg-gray-800 !bg-gray-700"
                      }  !rounded-lg`}
                    >
                      {buttonLabel}
                    </Button>
                  </Popover>
                ) : (
                  <Empty
                    className="!mt-3"
                    description={
                      <span className="font-medium text-gray-400">
                        all Appointments booked
                      </span>
                    }
                  />
                )}
              </>
            )}
            <PopUp
              show={
                isPayment == "payment_processing" ||
                isPayment == "payment_success"
              }
              mt="20px"
              customWidth={"w-5/6 sm:w-4/5 lg:w-3/4"}
              handleClose={() => {
                if (isPayment == "payment_success") {
                  navigate(`/profile/${doctorId}`);
                }
                setAppointmentSuccess(null);
                setIsPayment(null);
              }}
            >
              {isPayment == "payment_processing" ? (
                <AppointmentPayment
                  setIsPayment={setIsPayment}
                  bookedAppointment={bookedAppointment}
                  selectedDate={selectedDate}
                  doctorId={doctorId}
                  setBookedAppointment={setBookedAppointment}
                  messageApi={messageApi}
                  socket={socket}
                  // AppointmentType={app}
                />
              ) : isPayment == "payment_success" || appointmentSuccess ? (
                <SuccessAppointment
                  isBookLoading={isBookLoading}
                  bookedAppointment={appointmentSuccess}
                />
              ) : null}
            </PopUp>
          </>
        ) : isLoading ? (
          <Loader />
        ) : (
          <Empty
            className="!mt-3"
            description={
              <span className="font-medium text-gray-400">
                choose recently date (uptodate)
              </span>
            }
          />
        )}
      </div>
    </div>
  );
}

export default BookAppointment;
