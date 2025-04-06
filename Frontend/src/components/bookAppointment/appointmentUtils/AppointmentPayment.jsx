import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./CheckoutForm.css";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../../Loader";
import getStripe from "./getStripe";
import { useUserContext } from "../../../contexts/UserContextProvider";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = getStripe();
const AppointmentPayment = ({
  bookedAppointment,
  selectedDate,
  doctorId,
  setBookedAppointment,
  setIsPayment,
  socket,
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const { messageApi } = useUtilsContext();
  const { fetchUserData } = useUserContext();
  useEffect(() => {
    const host = window?.location?.hostname;
    // Create PaymentIntent as soon as the page loads
    if (bookedAppointment?.appointmentId && doctorId) {
      axios
        .request(`http://${host}:5000/create/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${new Cookies()?.get("accessToken")}`,
          },
          data: JSON.stringify({
            data: {
              doctorId,
              ...bookedAppointment,
            },
          }),
        })
        .then(({ data }) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          setIsPayment(null);
          if (err?.response?.status == 401) {
            fetchUserData(true, new Cookies().get("accessToken"));
          } else
            messageApi.open({
              key: 1,
              type: "error",
              content: "there's some issues, please try again later",
              duration: 5,
            });
        });
    }
  }, [bookedAppointment?.appointmentId, doctorId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App--payment">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            socket={socket}
            setIsPayment={setIsPayment}
            setBookedAppointment={setBookedAppointment}
            bookedAppointment={bookedAppointment}
            doctorId={doctorId}
            selectedDate={bookedAppointment?.schedule_date}
            messageApi={messageApi}
          />
        </Elements>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default AppointmentPayment;
