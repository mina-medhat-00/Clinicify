import React, { useEffect, useState } from "react";
import { cancelAppointment } from "../doctorDashboard/dashboardServices";
import { RiDeleteBack2Line } from "react-icons/ri";
const PopUp = ({
  children,
  show,
  mt,
  handleClose,
  customWidth,
  closeColor,
  customStyle = {},
}) => {
  const [showPop, setShowPop] = useState(false);
  useEffect(() => {
    let timeId;
    if (!show) {
      timeId = setTimeout(() => setShowPop(show), 500);
    } else setShowPop(show);
    return () => clearTimeout(timeId);
  }, [show]);
  useEffect(() => {
    if (!showPop) document.body.style.overflow = "";
    else document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [showPop]);
  return (
    <>
      {(showPop ? showPop : show) && (
        <div
          style={{
            backdropFilter: "blur(20px)",
            zIndex: 80,
          }}
          className={`mask--booked transition-all duration-500 fixed flex items-start justify-center top-0 left-0 h-full w-full`}
        >
          <div
            style={{
              marginTop: mt ? mt : "30vh",
              maxHeight: mt ? `calc(100vh - ${mt})` : "70vh",
              ...customStyle,
            }}
            className={`bg-white overflow-auto flex flex-col scroll--v scroll--h h-fit relative ${
              customWidth ? `${customWidth}` : "w-3/4 sm:w-1/2"
            } transition-all duration-500  ${
              showPop ? (!show ? "-left-full" : "left-0") : "-left-full"
            } p-4 rounded-lg shadow-lg`}
          >
            <RiDeleteBack2Line
              onClick={handleClose}
              className={`!flex !shrink-0 cursor-pointer ${
                closeColor ? closeColor : "!text-gray-700 hover:!text-gray-800"
              } !justify-center ml-auto my-2 !items-center !text-4xl`}
            />
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
