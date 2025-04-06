import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Button,
  Rate,
  Image,
  Segmented,
  Empty,
  Popover,
} from "antd";
import { MessageOutlined, StopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { SlotsContextProvider } from "../../../contexts";
import BookCard from "./BookCard";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
const DoctorCard = ({
  profileImage,
  rate,
  specialty,
  fees,
  about,
  username,
  doctorName,
  doctorId,
  user,
  socket,
  timeZone,
  city,
  street,
  phone,
  isLast,
}) => {
  const { t } = useUtilsContext();
  const navigate = useNavigate();
  const [isPayment, setIsPayment] = useState();
  const cardDetails = [
    {
      data: [
        {
          label: "Specialty",
          value: specialty,
        },
        {
          label: "Fees",
          value: fees,
        },
      ],
    },
    {
      data: [
        {
          label: "Clinic Location",
          value: city,
        },
        {
          label: "Clinic Street",
          value: street,
        },
      ],
    },
    {
      data: [
        {
          label: "About",
          value: about,
        },
        {
          label: "Clinic Phone",
          value: phone,
        },
      ],
    },
  ];
  return (
    <div
      className={`${
        isLast ? "" : "grow xl:w-1/3"
      } !cursor-default !my-2 sm:!m-2`}
    >
      <Card
        className="!flex !flex-col !rounded !p-2 !h-full"
        hoverable
        // cover={

        // }
        title={
          <Link
            to={
              user?.user_name == username
                ? `/dashboard`
                : `/profile/${username}`
            }
            className="w-full  text-gray-700"
            onClick={() => window.localStorage.setItem("dashType", "profile")}
          >
            <div className="flex gap-3 items-center">
              <div
                style={{
                  fontSize: "20px",
                }}
                className="font-serif grow text-center whitespace-nowrap"
              >
                {"Dr. "}
                {doctorName || "Doctor"}
              </div>
            </div>
          </Link>
        }
        bodyStyle={{
          padding: "5px",
          flexGrow: 1,
        }}
        actions={[]}
      >
        <div className="h-full flex flex-col sm:flex-row sm:justify-between gap-2">
          <SlotsContextProvider>
            <BookCard
              setIsPayment={setIsPayment}
              isPayment={isPayment}
              doctorId={doctorId}
              socket={socket}
              timeZone={timeZone || ""}
            />
          </SlotsContextProvider>
          <div className="doctor--details mt-2 flex flex-col justify-between gap-2 grow">
            <div className="doctor--image text-center">
              <Image
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  userSelect: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                src={profileImage}
              />
              <div className="text-center">
                <Rate value={rate} disabled />
                <hr className="border-1 m-2 border-gray-300 shadow-lg" />
              </div>
            </div>
            <div className="grow flex flex-col justify-center">
              {cardDetails?.map(({ data }, i) => (
                <div key={i + 1}>
                  {i !== 0 ? (
                    <hr className="border-1 m-2 border-gray-300 shadow-lg" />
                  ) : null}
                  <div className="flex flex-wrap justify-between gap-2 font-bold font-mono">
                    {data?.map(({ label, value }) => (
                      <div key={label}>
                        <span>{t(label)}: </span>
                        {value ? (
                          <span className="text-blue-800">{t(value)}</span>
                        ) : (
                          <StopOutlined />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* ask a question*/}
            <Popover
              trigger="click"
              open={user ? false : null}
              showArrow={false}
              content={
                <span className="font-medium">
                  you must signup/signin first
                </span>
              }
            >
              <div
                className="!flex !justify-center !items-center !hover:bg-yellow-700 !bg-yellow-500 
              hover:!text-black gap-2
              rounded  !w-full !text-gray-700"
                style={{
                  height: "35px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (doctorId & user?.user_id) {
                    navigate("/chat");
                    window?.localStorage?.setItem("chatTo", doctorId);
                  }
                }}
              >
                <MessageOutlined
                  className="hover:!text-black
            rounded py-2 !text-gray-700"
                />
                <span className="font-medium">Ask your Question</span>
              </div>
            </Popover>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DoctorCard;
