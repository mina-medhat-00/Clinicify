import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";
import { BsFillArrowUpSquareFill } from "react-icons/bs";
import { BsFillArrowDownSquareFill } from "react-icons/bs";
import { BsClockFill } from "react-icons/bs";
const handleHours = (value, type, setAppointmentDetails) => {
  if (value + 1 == 12 && type == "inc")
    setAppointmentDetails((appDet) => ({
      ...appDet,
      slotTime: {
        ...appDet.slotTime,
        timeMode: appDet.slotTime.timeMode == "AM" ? "PM" : "AM",
      },
    }));
  else if (value - 1 == 11 && type == "dec")
    setAppointmentDetails((appDet) => ({
      ...appDet,
      slotTime: {
        ...appDet.slotTime,
        timeMode: appDet.slotTime.timeMode == "AM" ? "PM" : "AM",
      },
    }));
  return type == "inc"
    ? (value + 1) % 13 == 0
      ? 1
      : (value + 1) % 13
    : type == "dec"
    ? value - 1 == 0
      ? 12
      : value - 1
    : 1;
};
const handleMinutes = (value, type) =>
  type == "inc"
    ? (value + 1) % 60
    : type == "dec"
    ? !value
      ? 59
      : value - 1
    : 0;
function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector(`.segment-display`);
  const segmentDisplayTop = segmentDisplay.querySelector(
    `.segment-display__top`
  );
  const segmentDisplayBottom = segmentDisplay.querySelector(
    `.segment-display__bottom`
  );

  const segmentOverlay = segmentDisplay.querySelector(`.segment-overlay`);
  const segmentOverlayTop = segmentOverlay.querySelector(
    `.segment-overlay__top`
  );
  const segmentOverlayBottom = segmentOverlay.querySelector(
    `.segment-overlay__bottom`
  );

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);
  if (
    parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue
  ) {
    return;
  }

  segmentElements.segmentOverlay.classList.add("flip");

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove("flip");
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  }

  segmentElements.segmentOverlay.addEventListener(
    "animationend",
    finishAnimation
  );
}

function updateTimeSection(sectionID, timeValue) {
  const firstNumber = Math.floor(timeValue / 10) || 0;
  const secondNumber = timeValue % 10 || 0;
  const sectionElement = document.getElementById(sectionID);
  const timeSegments = sectionElement.querySelectorAll(`.time-segment`);
  updateTimeSegment(timeSegments[0], firstNumber);
  updateTimeSegment(timeSegments[1], secondNumber);
}

function updateAllSegments(hours, minutes, order, directHour) {
  updateTimeSection(`minutes--${order}`, minutes);
  updateTimeSection(`hours--${order}`, directHour || hours);
}
const CountdownTimer = ({
  order,
  appointmentDetails,
  setAppointmentDetails,
  isEdit,
  directMode,
  directHour,
}) => {
  useEffect(() => {
    updateAllSegments(
      appointmentDetails.slotTime.h,
      appointmentDetails.slotTime.m,
      order,
      directHour
    );
  }, [directHour]);
  const hours = appointmentDetails?.slotTime?.h;
  const minutes = appointmentDetails?.slotTime?.m;
  // const time = new Date().toLocaleString("en", {
  //   timeStyle: "short",
  // });
  // const isEvening = time?.slice(time?.length - 3) == "PM" && !isEdit? true : false;
  return (
    <div className="countdown w-full flex justify-center flex-wrap sm:flex-nowrap gap-4 pt-1">
      <BsClockFill className="!flex !justify-center !items-center w-0 sm:w-8 sm:h-8 text-gray-400" />
      <div className="flex gap-2 mb-4 sm:mb-0 justify-center">
        <div className="flex flex-col gap-1">
          <BsFillArrowUpSquareFill
            onClick={() => {
              const h = handleHours(
                appointmentDetails.slotTime.h,
                "inc",
                setAppointmentDetails
              );
              updateAllSegments(
                h,
                appointmentDetails.slotTime.m,
                order,
                directHour
              );
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  h,
                },
              }));
            }}
            className="cursor-pointer sm:h-6 sm:w-6 h-5 w-5 rounded-lg text-gray-500"
          />
          <BsFillArrowDownSquareFill
            onClick={() => {
              const h = handleHours(
                appointmentDetails.slotTime.h,
                "dec",
                setAppointmentDetails
              );
              updateAllSegments(
                h,
                appointmentDetails.slotTime.m,
                order,
                directHour
              );
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  h,
                },
              }));
            }}
            className="cursor-pointer sm:h-6 sm:w-6 h-5 w-5 rounded-lg text-gray-500"
          />
        </div>
        <div
          className="time-section text-gray-700 font-medium !text-xs sm:!text-sm"
          id={`hours--${order}`}
        >
          <div className="time-group">
            <div
              className={`time-segment time-segment !w-6 sm:!w-8 text-2xl sm:text-3xl`}
            >
              <div className={`segment-display segment-display`}>
                <div className="segment-display__top bg-blue-800"></div>
                <div className="segment-display__bottom bg-blue-500"></div>
                <div
                  className={`segment-overlay segment-overlay segment-overlay-slot !w-6 sm:!w-8`}
                >
                  <div className="segment-overlay__top bg-blue-800"></div>
                  <div className="segment-overlay__bottom bg-blue-500"> </div>
                </div>
              </div>
            </div>
            <div
              className={`time-segment time-segment !w-6 sm:!w-8 text-2xl sm:text-3xl`}
            >
              <div className={`segment-display segment-display`}>
                <div className="segment-display__top bg-blue-800"></div>
                <div className="segment-display__bottom bg-blue-500"></div>
                <div
                  className={`segment-overlay segment-overlay segment-overlay-slot !w-6 sm:!w-8`}
                >
                  <div className="segment-overlay__top bg-blue-800"></div>
                  <div className="segment-overlay__bottom bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="!mb-0">Hour</p>
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="flex flex-col gap-1">
          <BsFillArrowUpSquareFill
            onClick={() => {
              const m = handleMinutes(appointmentDetails.slotTime.m, "inc");
              updateAllSegments(
                appointmentDetails.slotTime.h,
                m,
                order,
                directHour
              );
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  m,
                },
              }));
            }}
            className="cursor-pointer sm:h-6 sm:w-6 h-5 w-5 rounded-lg text-gray-500"
          />
          <BsFillArrowDownSquareFill
            onClick={() => {
              const m = handleMinutes(appointmentDetails.slotTime.m, "dec");
              updateAllSegments(
                appointmentDetails.slotTime.h,
                m,
                order,
                directHour
              );
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  m,
                },
              }));
            }}
            className="cursor-pointer sm:h-6 sm:w-6 h-5 w-5 rounded-lg text-gray-500"
          />
        </div>
        <div
          className="time-section text-gray-700 font-medium !text-xs sm:!text-sm"
          id={`minutes--${order}`}
        >
          <div className="time-group">
            <div
              className={`time-segment time-segment !w-6 sm:!w-8 text-2xl sm:text-3xl`}
            >
              <div className={`segment-display segment-display`}>
                <div className="segment-display__top bg-blue-800"></div>
                <div className="segment-display__bottom bg-blue-500"></div>
                <div
                  className={`segment-overlay segment-overlay segment-overlay-slot !w-6 sm:!w-8`}
                >
                  <div className="segment-overlay__top bg-blue-800"></div>
                  <div className="segment-overlay__bottom bg-blue-500"></div>
                </div>
              </div>
            </div>
            <div
              className={`time-segment time-segment !w-6 sm:!w-8 text-2xl sm:text-3xl`}
            >
              <div className={`segment-display segment-display`}>
                <div className="segment-display__top bg-blue-800"></div>
                <div className="segment-display__bottom bg-blue-500"></div>
                <div
                  className={`segment-overlay segment-overlay segment-overlay-slot !w-6 sm:!w-8`}
                >
                  <div className="segment-overlay__top bg-blue-800"></div>
                  <div className="segment-overlay__bottom bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="!mb-0">Minute</p>
        </div>
      </div>
      <div className="flex gap-2 select-none">
        {/* {!isEvening && ( */}
        <div className="flex flex-col gap-1">
          <BsFillArrowUpSquareFill
            onClick={() =>
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  timeMode: appDet.slotTime.timeMode == "AM" ? "PM" : "AM",
                },
              }))
            }
            className="cursor-pointer h-5 w-5 rounded-lg text-gray-500"
          />
          <BsFillArrowDownSquareFill
            onClick={() =>
              setAppointmentDetails((appDet) => ({
                ...appDet,
                slotTime: {
                  ...appDet.slotTime,
                  timeMode: appDet.slotTime.timeMode == "AM" ? "PM" : "AM",
                },
              }))
            }
            className="cursor-pointer h-5 w-5 rounded-lg text-gray-500"
          />
        </div>
        {/* )} */}
        <span className="text-2xl sm:text-3xl text-blue-500 font-medium">
          {/* {isEvening ? "PM" : appointmentDetails.slotTime.timeMode} */}
          {directMode || appointmentDetails.slotTime.timeMode}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
