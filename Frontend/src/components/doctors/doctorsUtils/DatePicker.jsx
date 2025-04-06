import React from "react";
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from "react-icons/ai";
import dayjs from "dayjs";
const DatePicker = ({ setSelectedDate, selectedDate, fromAppointment }) => {
  const formattedDate = new Date(selectedDate.date).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const day = new Date(selectedDate.date).toLocaleString("en-us", {
    weekday: "long",
  });
  return (
    <div
      className={`${
        fromAppointment ? "bg-gray-200/80" : "bg-gray-500"
      } flex items-center`}
    >
      <AiOutlineDoubleLeft
        onClick={() =>
          setSelectedDate((val) =>
            val.count
              ? {
                  count: val.count - 1,
                  date: dayjs(
                    new Date(
                      new Date().setDate(new Date().getDate() + val.count - 1)
                    )
                  ).format("YYYY-MM-DD"),
                }
              : val
          )
        }
        className={`${
          selectedDate.count
            ? "bg-white hover:bg-gray-200"
            : "bg-gray-300 cursor-not-allowed"
        } rounded-xl  h-10 w-10 shadow-lg ml-1`}
      />
      <div className="text-center grow">
        <div
          className={`font-medium select-none ${
            fromAppointment ? "text-gray-700" : "text-white"
          }`}
        >
          {day}
        </div>
        <div
          className={`font-medium select-none ${
            fromAppointment ? "text-gray-700" : "text-white"
          }`}
        >
          {selectedDate.date}
        </div>
      </div>
      <AiOutlineDoubleRight
        onClick={() =>
          setSelectedDate((val) => ({
            count: val.count + 1,
            date: dayjs(
              new Date(new Date().setDate(new Date().getDate() + val.count + 1))
            ).format("YYYY-MM-DD"),
          }))
        }
        className={`bg-white rounded-xl hover:bg-gray-200 h-10 w-10 shadow-lg mr-1`}
      />
    </div>
  );
};

export default DatePicker;
