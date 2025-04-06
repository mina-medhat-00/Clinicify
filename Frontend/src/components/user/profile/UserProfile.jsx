import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { SlotsContextProvider } from "../../../contexts";
import { BookAppointment } from "../../../components";
import userPhoto from "./../../../images/userPhoto.png";
import {
  Typography,
  Row,
  Col,
  Select,
  Image,
  Rate,
  Avatar,
  Button,
  Drawer,
  message,
  Input,
  Switch,
  Alert,
  Empty,
  Popover,
  Form,
} from "antd";
import Loader from "../../Loader";
import { ScheduleAppointments, ProfileDetails } from "./profileUtils";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { GrCertificate } from "react-icons/gr";
import { GiScalpel } from "react-icons/gi";
import { AiOutlineArrowRight, AiOutlineMessage } from "react-icons/ai";
import { FcRating } from "react-icons/fc";
import { BiEdit } from "react-icons/bi";
import { useEffect } from "react";
import doctorPhoto from "./../../../images/doctorPhoto.png";
import { useProfileContext } from "../../../contexts/ProfileContextProvider";
import { submitFeedback } from "./profileServices";
import { StopOutlined } from "@ant-design/icons";
import { FaNotesMedical } from "react-icons/fa";
import MedicalForm from "./profileUtils/MedicalForm";
import PatientRecords from "./profileUtils/PatientRecords";
import PersonalForm from "./profileUtils/PersonalForm";
import dayjs from "dayjs";
import ServerError from "../../utils/ServerError";
import ClinicForm from "./profileUtils/ClinicForm";
import ClinicRegister from "./profileUtils/ClinicRegister";
import ClinicDetails from "./profileUtils/ClinicDetails";
import AccountVerify from "../../doctorDashboard/dashboardUtils/scheduleUtils/AccountVerify";
import { useUserContext } from "../../../contexts/UserContextProvider";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
const editingObject = (value, setValue, name, normal) => ({
  onChange: (newValue) => setValue((val) => ({ ...val, [name]: newValue })),
  icon: (normal && null) || <BiEdit color="white" className="text-white" />,
  tooltip: false,
  text: value,
  enterIcon: null,
  // autoSize: {
  //   maxRows: 5,
  //   minRows: 3,
  // }
});

const UserProfile = () => {
  const { username } = useParams();
  const { socket, timeZone, messageApi } = useUtilsContext();
  const {
    isLoading: isUserLoading,
    fetchUserData,
    userData: user,
  } = useUserContext();
  const [rateValue, setRateValue] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [fetchFeedback, setFetchFeedback] = useState();
  const { isLoading, profileData, fetchProfileData, isError } =
    useProfileContext();
  const userid = user?.user_id;
  useEffect(() => {
    fetchProfileData({ path: "profile", username: username || userid });
  }, []);
  const [handleDrawer, setHandleDrawer] = useState({
    isOpen: false,
    type: "",
    name: "",
    className: "",
  });
  const [userValues, setUserValues] = useState({
    nickname: null,
    about: null,
    specialty: null,
    age: null,
    bdate: null,
    pnumber: null,
    email: null,
    city: null,
    street: null,
    images: [],
  });
  useEffect(() => {
    if (profileData?.["user"]) {
      const bdate = profileData?.["user"]?.bdate;
      setUserValues({
        nickname: profileData?.["user"]?.nick_name,
        about: profileData?.["doctor"]?.about,
        specialty: profileData?.["doctor"]?.specialty || <StopOutlined />,
        age: profileData?.["user"]?.age ? (
          profileData?.["user"]?.age + " years"
        ) : (
          <StopOutlined />
        ),
        bdate: bdate || <StopOutlined />,
        pnumber: profileData?.["user"]?.prefix
          ? `${profileData?.["user"]?.prefix} ${profileData?.["user"]?.pnumber}`
          : profileData?.["user"]?.pnumber,
        email: profileData?.["user"]?.email || <StopOutlined />,
        city: profileData?.["user"]?.city,
        street: profileData?.["user"]?.street || <StopOutlined />,
        images: profileData?.["user"]?.img_urls || [],
      });
    }
  }, [profileData]);
  const { Title } = Typography;
  if (isLoading || isUserLoading) return <Loader />;
  else if (isError) return <ServerError />;

  /* ================================================  Authorization part   ===========================================================*/
  const profileId = profileData?.["user"]?.user_id;
  const isVisitor = userid ? false : true;
  const isAdmin = profileData?.["user"]?.user_type == "admin";
  const isUser = profileData?.["user"]?.user_type == "doctor" ? false : true; // check user profile
  const isAuth = userid && profileId == userid ? true : false; // user visit his profile
  const isProfile = profileData?.["user"];
  const isVerified = profileData?.["doctor"]?.is_verified;
  const showDrawer = (type, name, className) => {
    setHandleDrawer(() => ({ isOpen: true, type, name, className }));
  };
  return (
    <div className="profile--wrapper">
      {isProfile ? (
        <>
          {isVisitor ? (
            <div className="flex justify-center">
              <Alert
                className="!my-2"
                closable
                message={
                  <span className="text-blue-900 font-medium w-full inline-block text-center">
                    You need to login or signup to use our features
                  </span>
                }
                type="info"
              />
            </div>
          ) : null}
          <div
            className="profile--intro--wrapper mt-2
      2xl:w-1/2 lg:w-2/3 w-full"
          >
            <div
              className="flex flex-wrap sm:flex-nowrap p-4"
              style={{
                backgroundColor: "rgb(32 58 89 / 90%)",
                borderRadius: "0px 20px 20px 0px",
              }}
            >
              <div className="text-center w-full sm:w-1/4">
                <Image
                  src={
                    userValues?.images?.[0]?.img_url ||
                    userValues?.images?.img_url ||
                    (isUser ? userPhoto : doctorPhoto)
                  }
                  width={130}
                  height={130}
                  style={{ borderRadius: "100px" }}
                />
              </div>
              <div className="profile--intro ml-5 grow">
                <div
                  className="profile--intro---name
              flex flex-wrap sm:flex-nowrap items-center justify-between"
                >
                  <Title
                    editable={
                      isAuth && showEdit
                        ? editingObject(
                            userValues?.nickname,
                            setUserValues,
                            "nickname"
                          )
                        : false
                    }
                    className="whitespace-nowrap p-2 !text-lg lg:!text-xl 2xl:!text-2xl !m-0"
                    style={{
                      color: "white",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {!isUser ? "Dr. " : ""}
                    {userValues?.nickname}
                  </Title>
                  {!isAuth ? (
                    <div>
                      <Link
                        to="/chat"
                        onClick={() =>
                          window?.localStorage?.setItem("chatTo", profileId)
                        }
                      >
                        <Button
                          style={{
                            color: "white",
                            fontFamily: "sans-serif",
                            fontSize: "28px",
                          }}
                          icon={
                            <AiOutlineMessage
                              color={isVisitor ? "gray" : "yellow"}
                            />
                          }
                          className={`!w-full !rounded-lg !text-xs lg:!text-sm
            mt-2 !p-4 !flex !items-center ${
              isVisitor
                ? "!bg-gray-300 !text-gray-500 !border-1 !border-gray-700"
                : "hover:!bg-gray-800 !bg-gray-700"
            }
           `}
                          disabled={!userid ? true : false}
                        >
                          &nbsp;Message me
                        </Button>
                      </Link>
                      {/* </Popover> */}
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => {
                          setHandleDrawer((draw) => ({
                            ...draw,
                            isOpen: true,
                            type: "personal",
                            name: "My Personal Information",
                          }));
                        }}
                        className={`!w-full !rounded-lg !text-white !font-medium !text-xs lg:!text-sm
                        mt-2 !p-4 !flex !items-center hover:!bg-gray-800 !bg-gray-700
                        `}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
                {/* ============================= about details for doctors and patient history for patient  ==========================*/}
                <div className="profile--about text-white p-2 my-2 text-xs md:text-sm rounded bg-gray-200/50">
                  <Title className="!text-xs !text-gray-100">
                    {!isUser
                      ? userValues?.about ||
                        (!isAuth ? (
                          <>
                            <StopOutlined /> there's no introduction yet
                          </>
                        ) : (
                          <span className="text-gray-200">about me...</span>
                        ))
                      : profileData?.["patientRecords"]?.current_issue ||
                        (!isAuth ? (
                          <>
                            <StopOutlined /> there's no issues described
                          </>
                        ) : (
                          <span className="text-gray-200">
                            describe any current issues...
                          </span>
                        ))}
                  </Title>
                </div>
                {!isUser ? (
                  <div
                    className="profile--rating flex
              justify-evenly items-center flex-wrap
              p-2 rounded bg-gray-300"
                  >
                    <div>
                      <Rate
                        value={profileData?.["doctor"]?.rate || 0}
                        disabled
                        allowHalf
                      />
                      <Title className="!inline-block relative -top-2 !text-xs !text-gray-700">
                        &nbsp;&nbsp;{profileData?.["doctor"]?.num_rate || 0}{" "}
                        users rate
                      </Title>
                    </div>
                    {!isUser && !isAuth ? (
                      <>
                        <Button
                          style={{
                            color: "white",
                            fontFamily: "sans-serif",
                            fontSize: "28px",
                          }}
                          className={`!rounded-lg !text-xs lg:!text-sm
                      !bg-orange-800 !p-4 !flex !items-center ${
                        isVisitor
                          ? "!border-1 !border-gray-500 !bg-gray-400 !text-gray-600"
                          : "hover:!bg-orange-600"
                      }
            `}
                          onClick={() =>
                            showDrawer("rate", "Your Feedback", "")
                          }
                          disabled={isVisitor ? true : false}
                        >
                          Place Your Feedback
                        </Button>
                      </>
                    ) : null}
                  </div>
                ) : null}
                <Drawer
                  title={
                    <span className="text-lg font-black">
                      {handleDrawer?.name}
                    </span>
                  }
                  className={handleDrawer?.className}
                  placement="right"
                  contentWrapperStyle={{
                    width:
                      handleDrawer.type == "medical" ||
                      handleDrawer.type == "personal" ||
                      handleDrawer.type == "clinic"
                        ? "100%"
                        : "",
                  }}
                  open={handleDrawer?.isOpen}
                  onClose={() =>
                    setHandleDrawer((val) => ({ ...val, isOpen: false }))
                  }
                >
                  {handleDrawer.type == "rate" ? (
                    <>
                      <Title className="!text-xs !mt-4 !font-medium">
                        Submit Your Rate
                      </Title>
                      <Rate
                        onChange={setRateValue}
                        allowHalf
                        defaultValue={0}
                      />
                      <Title className="!text-xs !mt-4 !font-medium">
                        Write Any feedback About your experince with Dr.{" "}
                        {userValues?.nickname}
                      </Title>
                      <Form
                        onFinish={(values) => {
                          submitFeedback(
                            rateValue,
                            values?.feedback,
                            profileId,
                            messageApi,
                            setFetchFeedback,
                            fetchUserData,
                            username
                          );
                        }}
                      >
                        <Form.Item
                          name="feedback"
                          rules={[
                            {
                              required: true,
                              message: "please, type any feedback",
                            },
                          ]}
                        >
                          <Input.TextArea
                            maxLength={300}
                            placeholder="place your feedback here"
                          ></Input.TextArea>
                        </Form.Item>
                        <Form.Item className="flex justify-center">
                          <Button
                            style={{
                              color: "white",
                              fontFamily: "sans-serif",
                              fontSize: "28px",
                            }}
                            className="!rounded-lg !text-xs lg:!text-sm
                    !bg-gray-700 !p-4 !m-4 !flex !items-center hover:!bg-gray-600
             "
                            htmlType="submit"
                          >
                            Submit Your Feedback
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  ) : handleDrawer.type == "medical" ? (
                    <MedicalForm
                      isEdit={
                        profileData?.["patientRecords"]?.current_issue
                          ? true
                          : false
                      }
                      initialValues={{
                        currentIssue:
                          profileData?.["patientRecords"]?.current_issue,
                        immunizations:
                          profileData?.["patientRecords"]?.immunizations,
                        allergies: profileData?.["patientRecords"]?.allergies,
                        surgeries: profileData?.["patientRecords"]?.surgeries,
                        illnessesHistory:
                          profileData?.["patientRecords"]?.illnesses_history,
                        testResults:
                          profileData?.["patientRecords"]?.test_results,
                      }}
                      fetchProfileData={fetchProfileData}
                      fetchUserData={fetchUserData}
                      userName={profileData?.["user"]?.user_id}
                      messageApi={messageApi}
                    />
                  ) : handleDrawer.type == "personal" ? (
                    <PersonalForm
                      initialValues={{
                        nickname: profileData?.["user"]?.nick_name,
                        gender: profileData?.["user"]?.gender,
                        birth: dayjs(profileData?.["user"]?.bdate),
                        address: {
                          city: profileData?.["user"]?.city,
                          street: profileData?.["user"]?.street,
                        },
                        phone: profileData?.["user"]?.pnumber,
                        prefix: profileData?.["user"]?.prefix,
                        email: profileData?.["user"]?.email,
                      }}
                      fetchProfileData={fetchProfileData}
                      fetchUserData={fetchUserData}
                      userName={profileData?.["user"]?.user_id}
                      messageApi={messageApi}
                    />
                  ) : handleDrawer.type == "clinic" ? (
                    <ClinicForm
                      initialValues={{
                        name: "sd",
                        address: {
                          city: profileData?.["doctor"]?.clinic_city,
                          street: profileData?.["doctor"]?.clinic_street,
                        },
                        phone: profileData?.["doctor"]?.clinic_pnumber,
                        telephone: profileData?.["doctor"]?.clinic_tnumber,
                        prefix: profileData?.["doctor"]?.clinic_prefix,
                      }}
                      fetchProfileData={fetchProfileData}
                      fetchUserData={fetchUserData}
                      userName={profileData?.["user"]?.user_id}
                      messageApi={messageApi}
                    />
                  ) : null}
                </Drawer>
              </div>
            </div>
          </div>
          {!isUser && isAuth ? (
            <div className="mx-1 sm:mx-0">
              <div className="mt-2 sm:w-4/5 lg:w-3/4 m-auto">
                <AccountVerify isVerified={isVerified} />
              </div>
              {profileData?.["doctor"]?.clinic_city ? (
                <ClinicDetails
                  setHandleDrawer={setHandleDrawer}
                  clinicValues={profileData["doctor"]}
                  showEdit={showEdit}
                  username={username}
                />
              ) : (
                <ClinicRegister />
              )}
            </div>
          ) : null}
          <div className="mt-2">
            {isUser && !isAdmin ? (
              <div>
                <PatientRecords
                  isAuth={isAuth}
                  setHandleDrawer={setHandleDrawer}
                  records={{
                    currentIssue:
                      profileData?.["patientRecords"]?.current_issue,
                    immunizations:
                      profileData?.["patientRecords"]?.immunizations,
                    allergies: profileData?.["patientRecords"]?.allergies,
                    surgeries: profileData?.["patientRecords"]?.surgeries,
                    illnessesHistory:
                      profileData?.["patientRecords"]?.illnesses_history,
                    testResults: profileData?.["patientRecords"]?.test_results,
                  }}
                />
              </div>
            ) : null}
            {/* ===================================== Book Your Appointment ======================================== */}
            {!isUser && !isAuth && (
              <SlotsContextProvider>
                <BookAppointment
                  userid={userid}
                  doctorId={profileId}
                  socket={socket}
                  timeZone={timeZone || ""}
                />
              </SlotsContextProvider>
            )}
          </div>
          <ProfileDetails
            fetchFeedback={fetchFeedback}
            setHandleDrawer={setHandleDrawer}
            isAuth={isAuth}
            isUser={isUser}
            showEdit={showEdit}
            setUserValues={setUserValues}
            userValues={userValues}
            username={username || userid}
          />
        </>
      ) : (
        <div className="h-80 flex justify-center items-center">
          <Empty
            className="!my-4 !font-medium text-black"
            description="cannot find any profile"
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
