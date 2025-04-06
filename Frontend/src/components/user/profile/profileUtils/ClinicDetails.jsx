import React from "react";
import { RiFileEditFill } from "react-icons/ri";
import ProfileTable from "./ProfileTable";
import { EditFilled, StopOutlined } from "@ant-design/icons";
import { FaClinicMedical } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { MdContactPhone } from "react-icons/md";
const clinicDetails = [
  {
    headerColor: "bg-gray-800/80",
    headers: [
      <div className="flex gap-2 items-center">
        <GoLocation />
        Location Details
      </div>,
    ],
    data: [
      {
        label: "City",
        name: "clinic_city",
      },
      {
        label: "Street",
        name: "clinic_street",
      },
    ],
  },
  {
    headerColor: "bg-gray-700/80",
    headers: [
      <div className="flex gap-2 items-center">
        <MdContactPhone />
        Contact
      </div>,
    ],
    data: [
      {
        label: "Clinic phone number",
        name: "clinic_pnumber",
        preValue: "clinic_prefix",
      },
      {
        label: "Clinic telephone",
        name: "clinic_tnumber",
        preValue: "clinic_prefix",
      },
    ],
    icon: <StopOutlined />,
  },
];
const ClinicTable = ({
  headers,
  data,
  clinicValues,
  showEdit,
  headerColor,
  propColor,
  icon,
}) => {
  return (
    <div className="flex justify-between gap-2 flex-wrap items-center">
      <ProfileTable
        icon={icon}
        headerColor={headerColor}
        propColor={propColor}
        data={data?.map(({ label, name, preValue }) => ({
          name: label,
          value: clinicValues?.[name],
          preValue: clinicValues?.[preValue],
        }))}
        headers={headers}
      />
    </div>
  );
};
const ClinicDetails = ({ admin, setHandleDrawer, clinicValues, showEdit }) => {
  return (
    <div
      className="clinic--wrapper--details 
my-5 rounded-xl"
    >
      <div className="flex justify-center items-center gap-2 mt-4 mb-4 text-white font-medium text-lg sm:text-xl p-4 bg-gray-800">
        <FaClinicMedical /> Clinic Informations
      </div>
      {clinicDetails?.map(
        ({ data, headers, headerColor, propColor, icon }, i) => (
          <ClinicTable
            key={i + 1}
            icon={icon}
            data={data}
            headerColor={headerColor}
            propColor={propColor}
            headers={headers}
            showEdit={showEdit}
            clinicValues={clinicValues}
          />
        )
      )}
      {!admin && (
        <div
          onClick={() =>
            setHandleDrawer((draw) => ({
              ...draw,
              isOpen: true,
              type: "clinic",
              name: "Clinic Informations",
            }))
          }
          className="bg-gray-300/50 gap-2 hover:bg-gray-300/80 flex justify-center items-center h-24 text-center cursor-pointer text-gray-500
     text-lg sm:text-xl xl:text-2xl font-medium rounded-lg hover:shadow-sm p-3 hover:text-gray-700"
          style={{
            flexGrow: 2,
          }}
        >
          <RiFileEditFill className="w-7 h-7" />
          Edit Clinic Informations
        </div>
      )}
    </div>
  );
};

export default ClinicDetails;
