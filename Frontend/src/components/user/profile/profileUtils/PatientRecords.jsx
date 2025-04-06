import { StopOutlined } from "@ant-design/icons";
import React from "react";
import { FaFileMedicalAlt, FaNotesMedical } from "react-icons/fa";
import ProfileTable from "./ProfileTable";

const PatientRecords = ({ records, setHandleDrawer, profileData, isAuth }) => {
  return (
    <>
      <div className="flex justify-center gap-2 items-center mt-4 mb-4 text-lg sm:text-xl text-white font-medium p-4 bg-gray-600">
        <FaFileMedicalAlt className="text-xl" />
        Medical History
      </div>
      <div className="px-2">
        <ProfileTable
          headers={["Medical Problems", "Description"]}
          icon={
            isAuth ? (
              <FaNotesMedical
                onClick={() =>
                  setHandleDrawer((draw) => ({
                    ...draw,
                    isOpen: true,
                    type: "medical",
                    name: "My Medical History",
                  }))
                }
                className="text-2xl hover:!text-gray-500 cursor-pointer"
              />
            ) : (
              <StopOutlined className="text-2xl" />
            )
          }
          data={Object.entries(records).map(([name, value], i) => ({
            name: name?.replace(/[A-Z]/, (val) => ` ${val}`),
            value,
          }))}
        />
        {isAuth && (
          <div
            onClick={() =>
              setHandleDrawer((draw) => ({
                ...draw,
                isOpen: true,
                type: "medical",
                name: "My Medical History",
              }))
            }
            className="bg-gray-300/50 gap-2 hover:bg-gray-300/80 flex justify-center items-center h-24 text-center cursor-pointer text-gray-500
           text-lg sm:text-xl xl:text-2xl font-medium rounded-lg hover:shadow-sm p-3 hover:text-gray-700"
            style={{
              flexGrow: 2,
            }}
          >
            <FaNotesMedical className="w-7 h-7" />
            {profileData?.["patientRecords"]?.currentIssue
              ? "Add"
              : "Edit"}{" "}
            Medical History
          </div>
        )}
      </div>
    </>
  );
};

export default PatientRecords;
