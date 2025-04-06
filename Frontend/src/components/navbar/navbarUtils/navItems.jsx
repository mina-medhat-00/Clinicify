import { GiDoctorFace, GiArchiveRegister } from "react-icons/gi";
import { FcRatings } from "react-icons/fc";
import { MdQuestionAnswer, MdReportProblem, MdReviews } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import { SiGnuprivacyguard } from "react-icons/si";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { TiMessages } from "react-icons/ti";
import { Link } from "react-router-dom";
import SignBanner from "../../sign/SignBanner";
import UserItem from "./UserItem";
import { isMobile } from "react-device-detect";
import { Avatar, Skeleton } from "antd";
import { ImProfile } from "react-icons/im";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const toDoctors = (val, navigate, DoctorRef) => {
  let specialty = val.domEvent.target.getAttribute("specialty");
  navigate("/doctors");
  let id = setInterval(() => {
    if (DoctorRef?.current) {
      clearInterval(id);
      const { specialtyValue, doctorName, location, setSearchFilter } =
        DoctorRef?.current;
      specialty = specialty == "all" ? "" : specialty;
      if (specialty != specialtyValue || doctorName || location) {
        setSearchFilter({ specialty, doctorName: "", location: "" });
      }
    }
  });
};
const subItems = (t) => [
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Internal medicine"
    >
      {t("Internal medicine")}
    </div>,
    "Internal"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Pediatrics">
      {t("Pediatrics")}
    </div>,
    "Pediatrics"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Surgery">
      {t("Surgery")}
    </div>,
    "Surgery"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Family medicine"
    >
      {t("Family medicine")}
    </div>,
    "Family"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Anesthesiology"
    >
      {t("Anesthesiology")}
    </div>,
    "Anesthesiology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Neurology">
      {t("Neurology")}
    </div>,
    "Neurology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Emergency medicine"
    >
      {t("Emergency medicine")}
    </div>,
    "Emergency"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Dermatology">
      {t("Dermatology")}
    </div>,
    "Dermatology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Ophthalmology">
      {t("Ophthalmology")}
    </div>,
    "Ophthalmology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Oncology">
      {t("Oncology")}
    </div>,
    "Oncology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Obstetrics and gynaecology"
    >
      {t("Obstetrics and gynaecology")}
    </div>,
    "Obstetrics"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Psychiatry">
      {t("Psychiatry")}
    </div>,
    "Psychiatry"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="General surgery"
    >
      {t("General surgery")}
    </div>,
    "General"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Urology">
      {t("Urology")}
    </div>,
    "Urology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Nuclear medicine"
    >
      {t("Nuclear medicine")}
    </div>,
    "Nuclear"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Diagnostic Radiology"
    >
      {t("Diagnostic Radiology")}
    </div>,
    "Diagnostic"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Immunology">
      {t("Immunology")}
    </div>,
    "Immunology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Physical therap"
    >
      {t("Physical therapy")}
    </div>,
    "Physical"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Preventive healthcare"
    >
      {t("Preventive healthcare")}
    </div>,
    "Preventive"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Medical genetics"
    >
      {t("Medical genetics")}
    </div>,
    "Medical1"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Orthopedics">
      {t("Orthopedics")}
    </div>,
    "Orthopedics"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Cardiology">
      {t("Cardiology")}
    </div>,
    "Cardiology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Otorhinolaryngology"
    >
      {t("Otorhinolaryngology")}
    </div>,
    "Otorhinolaryngology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Gastroenterology"
    >
      {t("Gastroenterology")}
    </div>,
    "Gastroenterology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Plastic surgery"
    >
      {t("Plastic surgery")}
    </div>,
    "Plastic"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Neurosurgery">
      {t("Neurosurgery")}
    </div>,
    "Neurosurgery"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Cardiothoracic surgery"
    >
      {t("Cardiothoracic surgery")}
    </div>,
    "Cardiothoracic"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Pulmonology">
      {t("Pulmonology")}
    </div>,
    "Pulmonology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Rheumatology">
      {t("Rheumatology")}
    </div>,
    "Rheumatology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Intensive care medicine"
    >
      {t("Intensive care medicine")}
    </div>,
    "Intensive"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Geriatrics">
      {t(" Geriatrics")}
    </div>,
    "Geriatrics"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Endocrinology">
      {t("Endocrinology")}
    </div>,
    "Endocrinology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Nephrology">
      {t("Nephrology")}
    </div>,
    "Nephrology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Hematology">
      {t(" Hematology")}
    </div>,
    "Hematology"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Pathology">
      {t("Pathology")}
    </div>,
    "Pathology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Occupational medicine"
    >
      {t("Occupational medicine")}
    </div>,
    "Occupational"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Clinical chemistry"
    >
      {t("Clinical chemistry")}
    </div>,
    "Clinical1"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Public health">
      {t("Public health")}
    </div>,
    "Public"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Clinical pathology"
    >
      {t("Clinical pathology")}
    </div>,
    "Clinical2"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Medical microbiology"
    >
      {t("Medical microbiology")}
    </div>,
    "Medical2"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Pain management"
    >
      {t("Pain management")}
    </div>,
    "Pain"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Anatomical pathology"
    >
      {t("Anatomical pathology")}
    </div>,
    "Anatomical"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Primary care">
      {t("Primary care")}
    </div>,
    "Primary"
  ),
  getItem(
    <div className="text-white font-base select-none" specialty="Radiology">
      {t("Radiology")}
    </div>,
    "Radiology"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Vascular surgery"
    >
      {t("Vascular surgery")}
    </div>,
    "Vascular"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Pediatric Hematology Oncology"
    >
      {t("Pediatric Hematology Oncology")}
    </div>,
    "Pediatric1"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Spinal Cord Injury Medicine"
    >
      {t("Spinal Cord Injury Medicine")}
    </div>,
    "Spinal"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Pediatric surgery"
    >
      {t("Pediatric surgery")}
    </div>,
    "Pediatric2"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Oral and maxillofacial surgery"
    >
      {t("Oral and maxillofacial surgery")}
    </div>,
    "Oral"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Colorectal surgery"
    >
      {t("Colorectal surgery")}
    </div>,
    "Colorectal"
  ),
  getItem(
    <div
      className="text-white font-base select-none"
      specialty="Developmental-Behavioral Pedia"
    >
      {t("Developmental-Behavioral Pedia")}
    </div>,
    "Developmental"
  ),
];
const items = (
  t,
  navigate,
  location,
  DoctorRef,
  user,
  messageApi,
  setUserData,
  isMobile,
  isUserLoading
) => [
  user || isUserLoading
    ? getItem(
        <UserItem isMobile={isMobile} />,
        // <div className="inline-block">logout</div>,
        //<Link to="/" className="select-none">
        //<div>{user.nick_name}</div>
        //</Link>
        "user",
        isUserLoading ? (
          <Skeleton.Avatar active />
        ) : user?.img_url ? (
          <Avatar src={user?.img_url} size="small" />
        ) : (
          <ImProfile className="!text-2xl !text-gray-200 !m-0" />
        )
      )
    : null,
  !(location.pathname == "/")
    ? getItem(
        <Link to="/" className="select-none">
          {t("HomePage")}
        </Link>,
        "1",
        <HomeOutlined className="!text-gray-300 hover:!text-white" />
      )
    : null,
  !user && !isUserLoading
    ? getItem(
        <Link to="/login" className="select-none">
          {t("Login")}
        </Link>,
        "login",
        <AiOutlineLogin className="!text-gray-300 hover:!text-white" />
      )
    : null,
  !user && !isUserLoading
    ? getItem(
        <Link to="/signup" className="select-none">
          {t("SignUp")}
        </Link>,
        "signup",
        <SiGnuprivacyguard className="!text-gray-300 hover:!text-white" />
      )
    : null,
  ,
  user && user?.user_type !== "admin"
    ? getItem(
        <Link to="/appointments" className="select-none">
          {t("My Appointment")}
        </Link>,
        "2",
        <GiArchiveRegister className="!text-gray-300 hover:!text-white" />
      )
    : null,
  getItem(
    <span className="text-gray-300 hover:text-white select-none">
      {t("Doctors")}
    </span>,
    "subdoc3",
    <GiDoctorFace className="-ml-1 !text-gray-300 hover:!text-white" />,
    [
      {
        ...getItem(
          <div className="text-white font-semibold select-none" specialty="all">
            {t("All Doctors")}
          </div>,
          "sub30"
        ),
        onClick: (val) => toDoctors(val, navigate, DoctorRef),
      },
      // ...subItems,
      {
        ...getItem(
          <span className="font-medium text-white">{t("Specialty")}</span>,
          "sub31",
          null,
          subItems(t)
        ),
        onClick: (val) => toDoctors(val, navigate, DoctorRef),
      },
    ]
  ),
  user
    ? getItem(
        <Link to="/chat" className="select-none">
          {t("Chatting")}
        </Link>,
        "4",
        <TiMessages className="!text-gray-300 hover:!text-white" />
      )
    : null,
  getItem(
    <Link to="/posts" className="select-none">
      {t("Questions")}
    </Link>,
    "5",
    <MdQuestionAnswer className="!text-gray-300 hover:!text-white" />
  ),
  // getItem(
  //   <Link to="/ratings" className="select-none">
  //     {t("Ratings")}
  //   </Link>,
  //   "6",
  //   <FcRatings className="!text-gray-300 hover:!text-white" />
  // ),
  getItem(
    <Link to="/feedbacks" className="select-none">
      {t("Feedbacks")}
    </Link>,
    "7",
    <MdReviews className="!text-gray-300 hover:!text-white" />
  ),
  user
    ? getItem(
        <Link to="/report/problem" className="select-none">
          {t("Report a problem")}
        </Link>,
        "report",
        <MdReportProblem className="!text-gray-300 hover:!text-white" />
      )
    : null,
];

export default items;
