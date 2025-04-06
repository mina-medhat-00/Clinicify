import { Avatar, Col, Empty, Rate, Row } from "antd";
import React from "react";
import { BiMessageRoundedEdit } from "react-icons/bi";
const FeedbackContent = ({
  order,
  font,
  doctorPhoto,
  uimgUrl,
  dimgUrl,
  doctorName,
  userPhoto,
  username,
  feedback,
  rate,
  isMobile,
  bodyHandler,
  setShowFeedback,
  showFeedback,
  mobile,
}) => {
  return (
    <div
      key={order}
      className="grow flex items-center justify-center w-full feedback--container mb-4"
    >
      <div>
        <Row
          justify="between gap-2"
          align="center"
          className="feedback--header hover:bg-blue-500/90 bg-blue-400/90 rounded-2xl border-2 border-white"
          onClick={() => {
            if (showFeedback || mobile) {
              bodyHandler(order);
            }
            if (!mobile) setShowFeedback(order + 1);
          }}
          style={{ fontSize: `${isMobile ? "12px" : "inherit"}` }}
        >
          <div className="p-2 flex items-center justify-between grow gap-2 bg-blue-600/80 shadow-md rounded-lg">
            <Col
              // className="w-1/2 grow sm:w-1/4"
              style={{ fontFamily: font }}
              className="flex gap-1 flex-wrap items-center justify-between"
            >
              <Avatar src={dimgUrl || doctorPhoto} size="large" />
              <span className="text-white font-medium text-lg sm:text-xl lg:text-xl">
                Dr. {doctorName?.slice(0, 12)}
              </span>
            </Col>
            <Col
              // className="w-1/3 sm:w-1/4"
              style={{ fontFamily: font }}
            >
              {<Rate disabled value={rate} />}
            </Col>
          </div>
          <div className="p-2 flex grow gap-2 bg-blue-200/30 rounded-lg">
            <Col
              className="flex flex-wrap items-center"
              // className="w-1/3 mt-2 sm:w-1/12"
              style={{ fontFamily: font }}
            >
              <span className="text-gray-100 bg-blue-600/70 shadow-md rounded p-0.5 font-medium text-lg sm:text-xl lg:text-xl">
                by
                {/* <BiMessageRoundedEdit className="text-xl" /> 
                <div className="flex flex-col bg-blue-600/60 shadow p-0.5 rounded justify-center items-center">
                </div> */}
              </span>
            </Col>
            <Col className="flex flex-wrap gap-1 items-center">
              {/* <Text> </Text>{" "} */}
              <Avatar src={uimgUrl || userPhoto} size="large" />
              <span className="text-white font-medium text-lg sm:text-xl lg:text-xl">
                {username?.slice(0, 12)}
              </span>
            </Col>
          </div>
        </Row>
        <Col
          style={{
            fontFamily: font,
            // ,
            // maxHeight: "400px"
          }}
          className="feedback--body overflow-auto scroll bg-blue-500/80 rounded-lg"
          id={`feedback--body--${order + 1}`}
        >
          <div id={`feedback--pragraph--${order + 1}`}>
            <span className="text-white break-all font-medium">
              {feedback || (
                <Empty
                  className="flex items-center flex-col w-full"
                  description={
                    <span className="text-gray-100 font-medium">
                      there's no feedback provided
                    </span>
                  }
                ></Empty>
              )}
            </span>
          </div>
        </Col>
      </div>
    </div>
  );
};

export default FeedbackContent;
