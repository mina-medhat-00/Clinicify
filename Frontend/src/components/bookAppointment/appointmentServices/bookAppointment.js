import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const bookAppointment = (
  selectedDate,
  bookedSlot,
  appointmentId,
  messageApi,
  fetchSlotsData,
  profileId,
  setBookedAppointment,
  fetchUserData,
  setIsLoading,
  isCheck,
  setIsPayment,
  resolve,
  socket,
  pi,
  navigate
) => {
  if (appointmentId) {
    const data = {
      data: {
        date: selectedDate,
        appointmentId,
        bookedSlot,
        doctorId: profileId,
      },
    };
    // messageApi.open({
    //   key: 1,
    //   type: "loading",
    //   content: "booking your appointment...",
    //   duration: 8,
    // });
    //setBookedAppointment(null);
    // if (!isCheck) setIsBookLoading(true);
    const host = window?.location?.hostname;
    axios
      .post(
        `http://${host}:5000/book/appointment${isCheck ? "?check=true" : ""}${
          pi ? `?pi=${pi?.id}` : ""
        }`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("accessToken")}`,
          },
        }
      )
      .then(() => {
        // messageApi.open({
        //   key: 1,
        //   type: "success",
        //   content: "Your Appointment booked",
        //   duration: 3,
        // });
        fetchSlotsData(
          {
            date: selectedDate,
            doctorId: profileId,
          },
          true
        );
        if (!isCheck) {
          socket.emit("update_appointments", {
            date: selectedDate,
            doctorId: profileId,
            appointmentId,
          });
        }
        if (!isCheck) setBookedAppointment(null);
        // // if (!isCheck) setIsBookLoading(false);
        if (pi) {
          setIsLoading(false);
          setTimeout(
            () =>
              navigate(
                `/profile/${profileId}?payment_intent_client_secret=${pi?.client_secret}`
              ),
            500
          );
        }
        if (isCheck) resolve("done");
      })
      .catch((err) => {
        if (pi) setIsLoading(false);
        if (isCheck) resolve("err");
        if (err?.response?.status == 400) {
          const data = err?.response?.data?.data;
          if (data?.isCanceled) {
            messageApi.open({
              key: 1,
              type: "error",
              content: "these slot has been canceled",
              duration: 5,
            });
            fetchSlotsData(
              {
                date: selectedDate,
                doctorId: profileId,
              },
              true
            );
            setBookedAppointment(null);
            setIsPayment(null);
          } else if (data?.isBooked) {
            messageApi.open({
              key: 1,
              type: "error",
              content: "these slot already booked, try with another slot",
              duration: 5,
            });
            fetchSlotsData(
              {
                date: selectedDate,
                doctorId: profileId,
              },
              true
            );
            setBookedAppointment(null);
            setIsPayment(null);
          }
        } else if (err?.response?.status == 401) {
          fetchUserData(true, cookies.get("accessToken"));
        } else
          messageApi.open({
            key: 1,
            type: "error",
            content: "there's some issues, please try again later",
            duration: 5,
          });
      });
  }
};

export default bookAppointment;
