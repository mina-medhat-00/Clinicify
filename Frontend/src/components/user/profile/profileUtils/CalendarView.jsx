import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Calendar, Checkbox, DatePicker } from "antd";
const CalendarView = ({ offsetWidth, selectedDate, handleDate, colorView }) => {
  const [calendarView, setCalendarView] = useState(false);
  const isMobile = useMediaQuery({
    query: `(max-width:${300 + (offsetWidth || 0)}px)`,
  });
  return !isMobile ? (
    <>
      <Checkbox onChange={() => setCalendarView((val) => !val)}>
        <span className={`text-${colorView || "black"} font-bold`}>
          Large View
        </span>
      </Checkbox>
      <Calendar
        fullscreen={calendarView}
        value={selectedDate}
        onSelect={(val) => handleDate(val)}
      />
    </>
  ) : (
    <DatePicker
      className="w-full !mb-2"
      value={selectedDate}
      onSelect={(val) => handleDate(val)}
    />
  );
};

export default CalendarView;
