import { Rate, Row, Col, Avatar, Typography, Empty, Carousel } from "antd";
import userPhoto from "./../../images/userPhoto.png";
import doctorPhoto from "./../../images/doctorPhoto.png";
import { useMediaQuery } from "react-responsive";
import { useFeedbackContext } from "../../contexts/FeedbackContextProvider";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import ServerError from "../utils/ServerError";
import FeedbackContent from "./feedbackUtils/FeedbackContent";
import PopUp from "../utils/PopUp";
import { VscFeedback } from "react-icons/vsc";
import { FcFeedback } from "react-icons/fc";
import { TitleHeader } from "../home/HomePage";
import { MdFeedback } from "react-icons/md";
import { CgFeed } from "react-icons/cg";
const { Title, Text } = Typography;

const Feedbacks = ({ home, data, noDirectFetch, username, fetchFeedback }) => {
  const { feedbackData, isLoading, isError, fetchFeedbackData } =
    useFeedbackContext();
  const isMobile = useMediaQuery({
    query: "(max-width:778px)",
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  useEffect(() => {
    if (!showFeedback) setTimeout(() => setShowPopUp(null), 400);
    else setShowPopUp(showFeedback);
  }, [showFeedback]);
  useEffect(() => {
    if (noDirectFetch)
      fetchFeedbackData(
        {
          username,
        },
        fetchFeedback == false || fetchFeedback == true
      );
  }, [fetchFeedback]);
  if (isLoading) return <Loader />;
  /* ###################### after rendering page ########################## */
  const font =
    "roboto mono,-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
  const bodyHandler = async (order) => {
    const bodyElement = document.getElementById(`feedback--body--${order + 1}`);
    const pragraphElement = document.getElementById(
      `feedback--pragraph--${order + 1}`
    );
    bodyElement.style.overflow = "hidden";
    setTimeout(() => (bodyElement.style.overflow = "auto"), 400);
    if (bodyElement.offsetHeight !== 0) {
      bodyElement.style.height = "0px";
      bodyElement.style.padding = "0px";
    } else {
      bodyElement.style.height = `${pragraphElement.offsetHeight}px`;
      bodyElement.style.padding = "10px";
    }
  };
  const { Title, Text } = Typography;
  return (
    <>
      {!home && (
        <TitleHeader
          contClass="flex gap-2 items-center justify-center flex-row-reverse"
          wrapperBg={"no"}
          contentBg={"bg-blue-900/90"}
          title="Feedbacks"
          icon={<MdFeedback className="!text-white w-16 h-16" />}
        />
      )}
      <Col
        className={`${
          !home && username ? "bg-blue-600/60" : ""
        } py-2 feedbacks--container rounded-lg mb-5 mx-2`}
      >
        {home && isMobile ? (
          <Carousel
            autoplay
            autoplaySpeed={6000}
            dotPosition="bottom"
            className="bg-gray-200/60 py-2 rounded-3xl"
            dots={{
              className: "bg-blue-500 p-1 rounded-md",
            }}
          >
            {feedbackData?.length > 0 ? (
              feedbackData?.map(
                (
                  { feedback, rate, doctorName, username, uimgUrl, dimgUrl },
                  order
                ) => (
                  <div className="mb-16" key={order}>
                    <FeedbackContent
                      order={order}
                      rate={rate}
                      bodyHandler={bodyHandler}
                      isMobile={isMobile}
                      setShowFeedback={setShowFeedback}
                      feedback={feedback}
                      userPhoto={userPhoto}
                      doctorPhoto={doctorPhoto}
                      username={username}
                      doctorName={doctorName}
                      uimgUrl={uimgUrl}
                      dimgUrl={dimgUrl}
                      font={font}
                      mobile
                    />
                  </div>
                )
              )
            ) : isError ? (
              <ServerError errorTitle={"Feedbacks"} />
            ) : (
              <Empty
                className="flex items-center flex-col w-full !mb-2"
                description={
                  <span className={`text-gray-500 font-medium`}>
                    there's no feedbacks
                  </span>
                }
              ></Empty>
            )}
          </Carousel>
        ) : feedbackData?.length > 0 ? (
          <div className="flex flex-wrap justify-evenly items-start gap-2 px-3">
            {feedbackData?.map(
              (
                {
                  feedback_from,
                  feedback_to,
                  feedback,
                  rate,
                  doctorName,
                  username,
                  uimgUrl,
                  dimgUrl,
                },
                order
              ) => (
                <div
                  key={`${feedback_from}${feedback_to}`}
                  className="sm:w-1/3 grow 2xl:w-1/4"
                >
                  {showPopUp == order + 1 ? (
                    <PopUp
                      customStyle={{
                        minHeight: "70%",
                      }}
                      customWidth={"overflow-hidden w-5/6 lg:w-3/4 xl:w-1/2"}
                      show={showFeedback}
                      mt={20}
                      handleClose={() => {
                        setShowFeedback(null);
                      }}
                    >
                      <FeedbackContent
                        order={order}
                        rate={rate}
                        bodyHandler={bodyHandler}
                        isMobile={isMobile}
                        setShowFeedback={setShowFeedback}
                        feedback={feedback}
                        userPhoto={userPhoto}
                        doctorPhoto={doctorPhoto}
                        username={username}
                        doctorName={doctorName}
                        uimgUrl={uimgUrl}
                        dimgUrl={dimgUrl}
                        font={font}
                        showFeedback={showFeedback}
                      />
                    </PopUp>
                  ) : (
                    <FeedbackContent
                      showFeedback={showFeedback}
                      order={order}
                      rate={rate}
                      bodyHandler={bodyHandler}
                      isMobile={isMobile}
                      setShowFeedback={setShowFeedback}
                      feedback={feedback}
                      userPhoto={userPhoto}
                      doctorPhoto={doctorPhoto}
                      username={username}
                      doctorName={doctorName}
                      uimgUrl={uimgUrl}
                      dimgUrl={dimgUrl}
                      font={font}
                    />
                  )}
                </div>
              )
            )}
          </div>
        ) : isError ? (
          <ServerError errorTitle={"Feedbacks"} />
        ) : (
          <Empty
            className={`${
              !home && !username ? "!mt-20" : ""
            } flex items-center flex-col w-full !mb-2`}
            description={
              <span
                className={`${
                  !home
                    ? username
                      ? "text-white"
                      : "text-gray-500"
                    : "text-white bg-blue-600/60 p-1 rounded"
                } font-medium`}
              >
                There's no feedbacks
              </span>
            }
          ></Empty>
        )}
      </Col>
    </>
  );
};

export default Feedbacks;
