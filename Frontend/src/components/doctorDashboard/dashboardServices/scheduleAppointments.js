import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const scheduleAppointments = (
  activeDate,
  addedAppointments,
  tAppointments,
  messageApi,
  fetchSlotsData,
  userid,
  fetchUserData,
  setIsDone,
  deletedAppointments,
  isEdit,
  editSlot,
  socket,
  doctorId
) => {
  messageApi.open({
    key: 1,
    type: "loading",
    content: deletedAppointments
      ? "deleting your appointment ...."
      : isEdit
      ? "editing your appointment ..."
      : "scheduling your appointments ...",
    duration: 8,
  });
  // const addSlots = totalSlots?.filter(
  //   (val) => !tSlots?.some((val1) => val1 == val)
  // );
  const data = {
    data: {
      date: activeDate?.format("YYYY-MM-DD"),
      totalSlots: tAppointments,
      deletedAppointments,
      addedAppointments,
      editSlot: editSlot,
      doctorId,
      // addSlots,
    },
  };
  if (!deletedAppointments) setIsDone(false);
  const host = window?.location?.hostname;
  axios
    .post(
      `http://${host}:5000/${
        isEdit ? "edit/appointment" : "schedule/appointments"
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
      messageApi.open({
        key: 1,
        type: "success",
        content: deletedAppointments
          ? "your schedule Appointment deleted"
          : isEdit
          ? "your appointment edited successfull ..."
          : "Your schedule Appointments updated",

        duration: 3,
      });
      socket?.emit("update_appointments", {
        date: activeDate?.format("YYYY-MM-DD"),
        doctorId: userid,
      });
      fetchSlotsData(
        {
          date: activeDate?.format("YYYY-MM-DD"),
          doctorId: userid,
        },
        true
      );
    })
    .catch((err) => {
      console.log(err);
      if (err?.response?.status == 400) {
        const timeSlots = err?.response?.data?.data?.timeSlots;
        if (timeSlots) {
          messageApi.open({
            key: 1,
            type: "error",
            content: `there's slot${
              timeSlots.length > 1 ? "s" : ""
            } booked in ${timeSlots?.join(" | ")}`,
            duration: 3,
          });
          fetchSlotsData({
            date: activeDate?.format("YYYY-MM-DD"),
            doctorId: userid,
          });
        }
      } else if (err?.response?.status == 401) {
        fetchUserData(true, cookies.get("accessToken"));
      } else {
        messageApi.open({
          key: 1,
          type: "error",
          content: "there's some issues, please try again later",
          duration: 3,
        });
        if (!deletedAppointments) setIsDone(true);
      }
    });
};

export default scheduleAppointments;
