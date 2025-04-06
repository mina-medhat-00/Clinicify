import React, { forwardRef, useState } from "react";
import { Carousel, Empty } from "antd";
import Loader from "../Loader";
import { DoctorCard, SearchFilter } from "./doctorsUtils";
import doctorPhoto from "./../../images/doctorPhoto.png";
import { useDoctorsContext } from "../../contexts/DoctorsContextProvider";
import ServerError from "../utils/ServerError";
import { useUserContext } from "../../contexts/UserContextProvider";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";
import TableGrid from "../utils/TableGrid";

const Doctors = forwardRef(({ home }, ref) => {
  const { socket, timeZone, isMobile } = useUtilsContext();
  const { userData: user } = useUserContext();
  const { doctorsData, isLoading, fetchDoctorsData, isError } =
    useDoctorsContext();
  const [isPayment, setIsPayment] = useState();
  return (
    <>
      <div className="relative">
        {!home ? (
          <>
            <SearchFilter ref={ref} fetchDoctorsData={fetchDoctorsData} />
          </>
        ) : null}
      </div>
      {home && isMobile ? (
        <div className="px-2 my-2">
          <Carousel
            autoplay
            autoplaySpeed={30000}
            dotPosition="bottom"
            className="bg-gray-200/40 rounded-md"
            dots={{
              className: "bg-gray-700 p-1 rounded-md",
            }}
          >
            {doctorsData?.length > 0 ? (
              doctorsData?.map((record) => (
                <div className="mb-16" key={record?.doctor_id}>
                  <DoctorCard
                    isMobile={isMobile}
                    user={user}
                    socket={socket}
                    doctorId={record?.doctor_id}
                    username={record?.user_name}
                    profileImage={record?.img_url || doctorPhoto}
                    rate={record?.rate}
                    fees={record?.fees}
                    isPayment={isPayment}
                    setIsPayment={setIsPayment}
                    street={record?.clinic_street}
                    city={record?.clinic_city}
                    phone={record?.clinic_pnumber}
                    doctorName={record?.nick_name}
                    about={record?.about}
                    specialty={record?.specialty}
                    timeZone={timeZone || ""}
                  />
                </div>
              ))
            ) : isLoading ? (
              <Loader />
            ) : isError ? (
              <ServerError errorTitle={"Doctors"} />
            ) : (
              <Empty
                className="!my-4 text-gray-500 !font-medium"
                description="There's no doctors"
              />
            )}
          </Carousel>
        </div>
      ) : (
        <div className="flex flex-wrap justify-evenly gap-2">
          {doctorsData?.length > 0 ? (
            <TableGrid
              lastItem
              colKey="doctor"
              heightFull
              items={doctorsData?.map((record, i) => ({
                key: record?.doctor_id,
                element: (
                  <DoctorCard
                    key={record?.doctor_id}
                    user={user}
                    socket={socket}
                    isLast={
                      doctorsData?.length % 2 && doctorsData?.length == i + 1
                    }
                    doctorId={record?.doctor_id}
                    username={record?.user_name}
                    profileImage={record?.img_url || doctorPhoto}
                    rate={record?.rate}
                    fees={record?.fees}
                    isPayment={isPayment}
                    setIsPayment={setIsPayment}
                    doctorName={record?.nick_name}
                    street={record?.clinic_street}
                    city={record?.clinic_city}
                    phone={record?.clinic_pnumber}
                    about={record?.about}
                    specialty={record?.specialty}
                    timeZone={timeZone || ""}
                  />
                ),
              }))}
            />
          ) : isLoading ? (
            <Loader />
          ) : isError ? (
            <ServerError errorTitle={"Doctors"} />
          ) : (
            <Empty
              className={`${home ? "" : "!mt-20"} !mb-4 !font-medium`}
              description={
                <span
                  className={`${
                    home
                      ? "text-white bg-blue-600/60 p-1 rounded"
                      : "text-gray-500"
                  }`}
                >
                  There's no doctors
                </span>
              }
            />
          )}
        </div>
      )}
    </>
  );
});
export default Doctors;
