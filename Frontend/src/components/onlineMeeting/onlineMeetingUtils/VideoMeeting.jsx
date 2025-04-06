import { OpenVidu } from "openvidu-browser";

import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import UserVideoComponent from "./UserVideoComponent";
import { Button, Input } from "antd";
import Cookies from "universal-cookie";
import "./videoMeeting.css";
import { TitleHeader } from "../../home/HomePage";
import { FcVideoCall } from "react-icons/fc";
import {
  LoadingOutlined,
  SettingFilled,
  VideoCameraFilled,
} from "@ant-design/icons";
import Loader from "../../Loader";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/UserContextProvider";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
let OV = null;
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : `http://${window.location.hostname}:5000`;
const VideoMeeting = ({ nickname, username, session, appointmentId }) => {
  const [sessionDetails, setSessionDetails] = useState({
    myNickName: nickname,
    username: username,
    appointmentId,
    mySession: session,
    isLoading: false,
    isError: false,
    session: undefined,
    sessionException: false,
    mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
    publisher: undefined,
    subscribers: [],
  });
  const { messageApi } = useUtilsContext();
  const { fetchUserData } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    // if (sessionDetails.session) {
    //   joinSession();
    // }
    return () => leaveSession();
  }, []);
  const handleChangeUserName = (e) => {
    setSessionDetails((sD) => ({ ...sD, myNickName: e.target.value }));
  };
  const handleMainVideoStream = (stream) => {
    if (sessionDetails.mainStreamManager !== stream) {
      setSessionDetails((sD) => ({ ...sD, mainStreamManager: stream }));
    }
  };
  const deleteSubscriber = (streamManager) => {
    let subscribers = new Array(sessionDetails?.subscribers);
    let index = subscribers.indexOf(streamManager, 0);
    subscribers.splice(index, 1);
    if (index > -1) {
      if (
        streamManager.stream.connection.connectionId ==
        sessionDetails.session.connection.connectionId
      )
        setSessionDetails((sD) => ({
          ...sD,
          session: undefined,
          sessionException: false,
          subscribers: [],
          mainStreamManager: undefined,
          publisher: undefined,
        }));
      setSessionDetails((sD) => ({ ...sD, subscribers: subscribers }));
    }
  };
  const joinSession = () => {
    // --- 1) Get an OpenVidu object ---
    OV = new OpenVidu();
    if (!sessionDetails?.session)
      setSessionDetails((sD) => ({ ...sD, isLoading: true }));
    // --- 2) Init a session ---
    const session = OV.initSession();
    setSessionDetails((sD) => ({ ...sD, session: session }));
    var mySession = session;
    console.log(mySession);
    // --- 3) Specify the actions when events take place in the session ---
    // On every new Stream received...
    mySession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession.subscribe(event.stream, undefined);
      var subscribers = new Array(...sessionDetails.subscribers);
      subscribers.push(subscriber);
      // Update the state with the new subscribers
      setSessionDetails((sD) => ({ ...sD, subscribers: subscribers }));
    });
    // mySession.on("connectionDestroyed", (event) => {
    //   this.deleteSubscriber(event.stream.streamManager);
    // });
    // On every Stream destroyed...
    mySession.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      console.log(event, "+++ streamDestroy");
      deleteSubscriber(event.stream.streamManager);
    });
    mySession.on("sessionDisconnected", (event) => {
      // Remove the stream from 'subscribers' array
      console.log("++ disconnected");
      setSessionDetails((sD) => ({
        ...sD,
        session: undefined,
        isLoading: false,
        sessionException: "Closed",
        subscribers: [],
        mainStreamManager: undefined,
        publisher: undefined,
      }));
    });

    // On every asynchronous exception...
    mySession.on("exception", (exception) => {
      console.log("++ exception");
      // setSessionDetails((sD) => ({
      //   ...sD,
      //   session: undefined,
      //   isLoading: false,
      //   sessionException: "Closed",
      //   subscribers: [],
      //   mainStreamManager: undefined,
      //   publisher: undefined,
      // }));
    });

    // --- 4) Connect to the session with a valid user token ---

    // Get a token from the OpenVidu deployment
    getToken()
      .then((token) => {
        // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        mySession
          .connect(token, {
            clientData: sessionDetails.myNickName,
          })
          .then(async () => {
            // --- 5) Get your own camera stream ---
            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
            // element: we will manage it on our own) and with the desired properties
            let publisher = await OV.initPublisherAsync(undefined, {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: "640x480", // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false, // Whether to mirror your local video or not
            });
            // --- 6) Publish your stream ---

            mySession.publish(publisher);

            // Obtain the current video device in use
            var devices = await OV.getDevices();
            var videoDevices = devices.filter(
              (device) => device.kind === "videoinput"
            );
            var currentVideoDeviceId = publisher.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .getSettings().deviceId;
            var currentVideoDevice = videoDevices.find(
              (device) => device.deviceId === currentVideoDeviceId
            );
            // Set the main video in the page to display our webcam and store our Publisher
            setSessionDetails((sD) => ({
              ...sD,
              isLoading: false,
              currentVideoDevice: currentVideoDevice,
              mainStreamManager: publisher,
              publisher: publisher,
            }));
          })
          .catch((err) => {
            if (err?.response?.status == 401) {
              if (err?.response?.data?.data?.noSchedule) {
                setSessionDetails((sD) => ({
                  ...sD,
                  session: undefined,
                  sessionException: "noSchedule",
                  isLoading: false,
                  isError: false,
                  subscribers: [],
                  mainStreamManager: undefined,
                  publisher: undefined,
                }));
                return;
              }
              fetchUserData(true, new Cookies().get("accessToken"));
            }
            // setSessionDetails((sD) => ({
            //   ...sD,
            //   isLoading: false,
            // }));
            setSessionDetails((sD) => ({
              ...sD,
              session: undefined,
              isLoading: false,
              sessionException: "Expired",
              subscribers: [],
              mainStreamManager: undefined,
              publisher: undefined,
            }));
            console.log(
              "There was an error connecting to the session:",
              err.code,
              err.message
            );
          });
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          if (err?.response?.data?.data?.noSchedule) {
            setSessionDetails((sD) => ({
              ...sD,
              session: undefined,
              sessionException: "noSchedule",
              isLoading: false,
              isError: false,
              subscribers: [],
              mainStreamManager: undefined,
              publisher: undefined,
            }));
            return;
          }
          fetchUserData(true, new Cookies().get("accessToken"));
        }
        setSessionDetails((sD) => ({
          ...sD,
          session: undefined,
          isLoading: false,
          sessionException: "Expired",
          subscribers: [],
          mainStreamManager: undefined,
          publisher: undefined,
        }));
        // console.log(
        //   "There was an error connecting to the session:",
        //   err.code,
        //   err.message
        // );
      });
  };
  const leaveSession = () => {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    const mySession = sessionDetails.session;
    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    OV = null;
    setSessionDetails((sD) => ({
      ...sD,
      session: undefined,
      sessionException: false,
      isLoading: false,
      sessionException: sessionDetails.subscribers.length < 1 ? "End" : false,
      isError: false,
      subscribers: [],
      mainStreamManager: undefined,
      publisher: undefined,
    }));
  };

  const switchCamera = async () => {
    try {
      const devices = await OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) =>
            device.deviceId !== sessionDetails.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await sessionDetails.session.unpublish(
            sessionDetails.mainStreamManager
          );

          await sessionDetails.session.publish(newPublisher);
          setSessionDetails((sD) => ({
            ...sD,
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          }));
        }
      }
    } catch (e) {
      // setSessionDetails((sD) => ({
      //   ...sD,
      //   session: undefined,
      //   sessionException: false,
      //   subscribers: [],
      //   mainStreamManager: undefined,
      //   publisher: undefined,
      // }));
    }
  };
  const getToken = async () => {
    return await createToken(sessionDetails.mySession);
  };
  const createSession = async () => {
    setSessionDetails((sD) => ({
      ...sD,
      isLoading: true,
    }));
    await axios
      .post(
        `${APPLICATION_SERVER_URL}/join/meeting`,
        { data: { appointment_id: sessionDetails?.appointmentId } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${new Cookies().get("accessToken")}`,
          },
        }
      )
      .then((res) => {
        setSessionDetails((sD) => ({
          ...sD,
          session: undefined,
          sessionException: false,
          mySession: res.data,
          isLoading: false,
          isError: false,
          subscribers: [],
          mainStreamManager: undefined,
          publisher: undefined,
        }));
        navigate(`/join/meeting/${res.data}?appointment_id=${appointmentId}`);
      })
      .catch((err) => {
        if (err?.response?.status == 400) {
          messageApi.open({
            key: 1,
            type: "warning",
            content: "there's something missing, try to re-login",
            duration: 3,
          });
          return;
        }
        if (err?.response?.status == 401) {
          if (err?.response?.data?.data?.noSchedule) {
            setSessionDetails((sD) => ({
              ...sD,
              session: undefined,
              sessionException: "noSchedule",
              isLoading: false,
              isError: false,
              subscribers: [],
              mainStreamManager: undefined,
              publisher: undefined,
            }));
            return;
          }
          fetchUserData(true, new Cookies().get("accessToken"));
        }
        setSessionDetails((cD) => ({
          ...cD,
          isError: true,
          session: undefined,
          isLoading: false,
          subscribers: [],
        }));
      });
  };
  const createToken = async (sessionId) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/join/meeting/?session=${sessionId}`,
      {
        data: {
          appointment_id: sessionDetails.appointmentId,
          username: sessionDetails.username,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${new Cookies().get("accessToken")}`,
        },
      }
    );
    return response.data; // The token
  };
  return (
    <>
      {sessionDetails.session === undefined || sessionDetails.isLoading ? (
        <>
          <TitleHeader
            icon={<SettingFilled className="!text-white !text-2xl" />}
            title={"Preparing Your Video Call"}
            wrapperBg={"w-full"}
          />
          <div
            className="m-auto items-center p-5 flex sm:w-1/2 xl:w-2/3 flex-col gap-2 
          bg-white shadow-xl rounded-lg"
          >
            {!sessionDetails.sessionException ? (
              <>
                <div className="text-blue-700 font-medium text-xl sm:text-xl lg:text-3xl">
                  Hello, {sessionDetails.username || "Type Your name"}
                </div>
                <Input
                  value={sessionDetails.myNickName}
                  className="text-center font-semibold !text-lg !text-white !bg-blue-700/50"
                  onChange={handleChangeUserName}
                />
              </>
            ) : null}
            <VideoCameraFilled className="!text-5xl sm:!text-6xl !my-12 lg:!text-7xl !text-blue-700" />
            {sessionDetails.isError ? (
              <div className="flex bg-red-500/70 my-8 rounded p-4 items-center justify-center gap-2">
                <span className="rounded p-2 font-medium text-white">
                  Some Thing goes Wrong
                </span>
                <Link
                  className="!rounded-lg !text-center !p-4 !m-0 !flex !items-center !text-white !font-medium !bg-blue-500/80"
                  to="/"
                >
                  Go Home
                </Link>
              </div>
            ) : sessionDetails.sessionException ? (
              <div className="flex bg-red-500/70 my-8 rounded p-4 items-center justify-center gap-2">
                <span className="rounded p-2 font-medium text-white">
                  Session{" "}
                  {sessionDetails.sessionException == "noSchedule"
                    ? "Require Schedule"
                    : sessionDetails.sessionException}
                </span>

                <Button
                  className="!rounded-lg !p-4 !m-0 !flex !items-center !text-white !font-medium !bg-blue-500/80"
                  disabled={sessionDetails?.isLoading}
                  onClick={() => {
                    if (
                      !sessionDetails?.appointmentId ||
                      !sessionDetails?.username ||
                      !sessionDetails?.myNickName
                    )
                      messageApi.open({
                        content:
                          "please fill all required details or try again later",
                        type: "warning",
                        duration: 3,
                      });
                    else createSession();
                  }}
                >
                  Join New Call
                  {sessionDetails?.isLoading ? (
                    <LoadingOutlined className="!ml-2" />
                  ) : null}
                </Button>
                {sessionDetails?.sessionException != "noSchedule" ? (
                  <Link
                    className="!rounded-lg !m-0 !p-1 !text-center !border !flex !items-center !text-white !font-medium !bg-blue-400/80"
                    disabled={sessionDetails?.isLoading}
                    to={"/doctors"}
                    onClick={() => {
                      if (
                        !sessionDetails?.appointmentId ||
                        !sessionDetails?.username ||
                        !sessionDetails?.myNickName
                      )
                        messageApi.open({
                          content:
                            "please fill all required details or try again later",
                          type: "warning",
                          duration: 3,
                        });
                      else createSession();
                    }}
                  >
                    find doctors
                  </Link>
                ) : null}
              </div>
            ) : null}
            {!sessionDetails.sessionException && !sessionDetails.isError ? (
              <Button
                disabled={sessionDetails?.isLoading}
                className="!rounded-lg !px-8 !p-4 !text-white !flex justify-center !font-medium !m-0 
              items-center !bg-blue-500 hover:bg-gray-400 hover:!bg-blue-800"
                onClick={() => {
                  if (
                    !sessionDetails?.appointmentId ||
                    !sessionDetails?.username ||
                    !sessionDetails?.myNickName
                  )
                    messageApi.open({
                      content:
                        "please fill all required details or try again later",
                      type: "warning",
                      duration: 3,
                    });
                  else joinSession();
                }}
              >
                Join Now
                {sessionDetails?.isLoading ? (
                  <LoadingOutlined className="!ml-2" />
                ) : null}
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
      <div
        className="video--container flex flex-col items-center justify-center"
        style={{
          minHeight: "100vh",
        }}
      >
        {sessionDetails.session !== undefined && !sessionDetails.isLoading ? (
          <div
            id="session"
            className="flex flex-col w-6/7 xl:w-3/4 2xl:w-4/5 gap-1 grow"
          >
            <div id="session-header flex gap-2">
              {/* <h1 id="session-title">{this.state.mySession}</h1> */}
              <Button
                className="!p-1 !bg-red-500/70 !text-white hover:!bg-red-700 !rounded"
                onClick={leaveSession}
              >
                Leave Now
              </Button>
              <Button
                className="!p-1 !bg-blue-700/70 !text-white hover:!bg-blue-800 !rounded"
                onClick={switchCamera}
              >
                Switch Camera
              </Button>
            </div>
            {sessionDetails.mainStreamManager !== undefined ? (
              <div id="main-video" className="w-full my-2">
                <UserVideoComponent
                  streamManager={sessionDetails.mainStreamManager}
                />
              </div>
            ) : null}
            <div
              id="video-container"
              className="flex overflow-auto scroll--h gap-2"
            >
              {/* {this.state.publisher !== undefined ? (
                <div
                  className="stream-container w-full"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null} */}
              {sessionDetails.subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="stream-container w-1/5 sm:w-1/4 lg:w-1/4 xl:w-1/5"
                  onClick={() => handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoMeeting;
