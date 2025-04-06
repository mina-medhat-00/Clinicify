import React, { useEffect } from "react";
import "./CountdownTimer.css";

const CountdownTimer = ({
  targetDate,
  order,
  hours,
  seconds,
  minutes,
  complete,
}) => {
  useEffect(() => {
    function getTimeSegmentElements(segmentElement) {
      const segmentDisplay = segmentElement.querySelector(
        `.segment-display--${order}`
      );
      const segmentDisplayTop = segmentDisplay.querySelector(
        `.segment-display__top`
      );
      const segmentDisplayBottom = segmentDisplay.querySelector(
        `.segment-display__bottom`
      );

      const segmentOverlay = segmentDisplay.querySelector(
        `.segment-overlay--${order}`
      );
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
        parseInt(segmentElements.segmentDisplayTop.textContent, 10) ===
        timeValue
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
      const timeSegments = sectionElement.querySelectorAll(
        `.time-segment--${order}`
      );
      updateTimeSegment(timeSegments[0], firstNumber);
      updateTimeSegment(timeSegments[1], secondNumber);
    }

    function getTimeRemaining(targetDateTime) {
      const nowTime = Date.now();
      const complete = nowTime >= targetDateTime;

      if (complete) {
        return {
          complete,
          seconds: 0,
          minutes: 0,
          hours: 0,
        };
      }

      const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
      const hours = Math.floor(secondsRemaining / 60 / 60);
      const minutes = Math.floor(secondsRemaining / 60) - hours * 60;
      const seconds = secondsRemaining % 60;

      return {
        complete,
        seconds,
        minutes,
        hours,
      };
    }

    function updateAllSegments() {
      const timeRemainingBits = getTimeRemaining(
        new Date(targetDate).getTime()
      );
      updateTimeSection(`seconds--${order}`, timeRemainingBits.seconds);
      updateTimeSection(`minutes--${order}`, timeRemainingBits.minutes);
      updateTimeSection(`hours--${order}`, timeRemainingBits.hours);
      return timeRemainingBits.complete;
    }

    const countdownTimer = setInterval(() => {
      const isComplete = updateAllSegments();
      if (isComplete) {
        clearInterval(countdownTimer);
      }
    }, 1000);

    updateAllSegments();
    return () => clearInterval(countdownTimer);
  }, [order, targetDate]);
  return (
    <div className="countdown w-full justify-center flex-wrap flex gap-2 sm:gap-4 pt-1">
      <div
        className="time-section text-gray-100 !text-xs sm:!text-sm"
        id={`hours--${order}`}
      >
        <div className="time-group">
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"> </div>
              </div>
            </div>
          </div>
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="!mb-0">Hours</p>
      </div>

      <div
        className="time-section text-gray-100 !text-xs sm:!text-sm"
        id={`minutes--${order}`}
      >
        <div className="time-group">
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"></div>
              </div>
            </div>
          </div>
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="!mb-0">Minutes</p>
      </div>

      <div
        className="time-section text-gray-100 !text-xs sm:!text-sm"
        id={`seconds--${order}`}
      >
        <div className="time-group">
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"></div>
              </div>
            </div>
          </div>
          <div
            className={`time-segment time-segment--${order} !w-6 sm:!w-10 text-2xl sm:text-3xl`}
          >
            <div className={`segment-display segment-display--${order}`}>
              <div className="segment-display__top bg-gray-800"></div>
              <div className="segment-display__bottom bg-gray-600"></div>
              <div
                className={`segment-overlay segment-overlay--${order} !w-6 sm:!w-10`}
              >
                <div className="segment-overlay__top bg-gray-800"></div>
                <div className="segment-overlay__bottom bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="!mb-0">Seconds</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
