import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import bookAppointment from "../appointmentServices/bookAppointment";
import { useSlotsContext } from "../../../contexts/SlotsContextProvider";
import { useUserContext } from "../../../contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({
  bookedAppointment,
  doctorId,
  socket,
  selectedDate,
  messageApi,
  setBookedAppointment,
  setIsPayment,
}) => {
  const stripe = useStripe();
  const { fetchSlotsData } = useSlotsContext();
  const { fetchUserData } = useUserContext();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        // case "succeeded":
        //   setMessage("Payment succeeded!");
        //   console.log("done");
        //   break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    const result = await new Promise((resolve) =>
      bookAppointment(
        selectedDate,
        bookedAppointment?.slotTime,
        bookedAppointment?.appointmentId,
        messageApi,
        fetchSlotsData,
        doctorId,
        setBookedAppointment,
        fetchUserData,
        null,
        true,
        setIsPayment,
        resolve
      )
    );
    if (result === "err") return;
    stripe
      .confirmPayment({
        elements,

        // options: {
        //   handleActions: false,
        // },
        // confirmParams: {
        //   // Make sure to change this to your payment completion page
        //   return_url: `http://${window?.location?.host}/profile/${doctorId}`,
        // },
        redirect: "if_required",
      })
      .then((paymentIntent) => {
        const pi = paymentIntent?.paymentIntent;
        if (pi) {
          bookAppointment(
            selectedDate,
            bookedAppointment?.slotTime,
            bookedAppointment?.appointmentId,
            messageApi,
            fetchSlotsData,
            doctorId,
            setBookedAppointment,
            fetchUserData,
            setIsLoading,
            null,
            setIsPayment,
            null,
            socket,
            pi,
            navigate
          );
        } else {
          setMessage(paymentIntent?.error?.message);
          setIsLoading(false);
        }
      });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
  };
  const paymentElementOptions = {
    layout: "tabs",
  };
  return (
    <div className="flex flex-wrap justify-between gap-2">
      {!(isLoading || !elements || !stripe) && (
        <div className="w-1/5 sm:w-1/6 flex gap-2 flex-wrap items-center justify-center grow bg-gray-700 p-1 shadow-md rounded-lg">
          <h1 className="text-4xl  text-gray-100">
            {bookedAppointment?.appointmentState?.toUpperCase()}
          </h1>
          <h1 className="text-lg p-1 bg-gray-500/70 rounded-md  text-gray-100">
            {bookedAppointment?.appointmentType?.toUpperCase()}
          </h1>
          <h1 className="text-2xl text-gray-100">
            {bookedAppointment?.appointmentFees} L.E
          </h1>
        </div>
      )}
      <form className="payment--form w-4/5 grow" id="payment-form">
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => {
            setEmail(e.value.email);
          }}
        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          className={`payment--button ${
            isLoading || !stripe || !elements ? "!cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !stripe || !elements}
          id="submit"
          onClick={handleSubmit}
        >
          <span
            id="button-text"
            className={`${
              isLoading || !stripe || !elements ? "!cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="payment--spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment--message">{message}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
