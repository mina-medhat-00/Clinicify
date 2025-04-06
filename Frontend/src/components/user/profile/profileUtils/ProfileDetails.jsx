import React, { Children, useEffect, useRef, useState } from "react";
import { Rate, Typography } from "antd";
import { useMediaQuery } from "react-responsive";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Feedbacks } from "../../../../components";
import { FeedbackContextProvider } from "../../../../contexts";
import { FaNotesMedical } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import ProfileTable from "./ProfileTable";

const UserDetails = ({
  headers,
  data,
  userValues,
  setUserValues,
  isAuth,
  showEdit,
  headerColor,
  propColor,
}) => {
  return (
    <div className="flex justify-between gap-2 flex-wrap items-center">
      <ProfileTable
        headerColor={headerColor}
        propColor={propColor}
        data={data?.map(({ label, name }) => ({
          name: label,
          value: userValues?.[name],
        }))}
        headers={headers}
      />
    </div>
  );
};

const ProfileDetails = ({
  isAuth,
  isUser,
  showEdit,
  setUserValues,
  userValues,
  username,
  setHandleDrawer,
  fetchFeedback,
}) => {
  const profileDetails = [
    !isUser
      ? {
          data: [
            {
              label: "Specialty",
              name: "specialty",
            },
          ],
        }
      : {},
    {
      headerColor: "bg-blue-800/80",
      headers: ["Personal Details"],
      data: [
        {
          label: !isUser ? "Age" : "Birh Date",
          name: !isUser ? "age" : "bdate",
        },
        {
          label: "Phone Number",
          name: "pnumber",
        },
      ],
    },
    {
      headerColor: "bg-blue-700/80",
      headers: ["Address"],
      data: [
        {
          label: "City",
          name: "city",
        },
        {
          label: "Street",
          name: "street",
        },
      ],
    },
    {
      headerColor: "bg-blue-600/80",
      headers: ["Contact"],
      data: [
        {
          label: "Email",
          name: "email",
        },
      ],
    },
  ];
  return (
    <>
      {!isUser ? (
        <FeedbackContextProvider noDirectFetch>
          <Feedbacks
            noDirectFetch
            username={username}
            fetchFeedback={fetchFeedback}
          />
        </FeedbackContextProvider>
      ) : (
        <></>
      )}
      <div
        className="profile--wrapper--details 
my-5 rounded-xl"
      >
        <div className="flex justify-center items-center gap-2 mt-4 mb-4 text-white font-medium text-lg sm:text-xl p-4 bg-blue-600">
          <BsFillPersonLinesFill /> Personal Informations
        </div>
        {profileDetails?.map(({ data, headers, headerColor, propColor }, i) => (
          <UserDetails
            key={i + 1}
            isAuth={isAuth}
            data={data}
            headerColor={headerColor}
            propColor={propColor}
            headers={headers}
            showEdit={showEdit}
            setUserValues={setUserValues}
            userValues={userValues}
          />
        ))}
        {!isUser && (
          <UserDetails
            isAuth={isAuth}
            showEdit={showEdit}
            setUserValues={setUserValues}
            userValues={userValues}
            data={[
              {
                label: "Specialty",
                name: "specialty",
              },
            ]}
          />
        )}
        {isAuth && (
          <div
            onClick={() =>
              setHandleDrawer((draw) => ({
                ...draw,
                isOpen: true,
                type: "personal",
                name: "My Personal Informations",
              }))
            }
            className="bg-gray-300/50 gap-2 hover:bg-gray-300/80 flex justify-center items-center h-24 text-center cursor-pointer text-gray-500
           text-lg sm:text-xl xl:text-2xl font-medium rounded-lg hover:shadow-sm p-3 hover:text-gray-700"
            style={{
              flexGrow: 2,
            }}
          >
            <FaNotesMedical className="w-7 h-7" />
            Edit Personal Informations
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
