import { OpenVidu } from "openvidu-browser";

import axios from "axios";
import React, { Component } from "react";
import UserVideoComponent from "./UserVideoComponent";
import { Button, Input } from "antd";
import Cookies from "universal-cookie";
import "./videoMeeting.css";
import { TitleHeader } from "../../home/HomePage";
import { MdMeetingRoom } from "react-icons/md";
import { FcVideoCall } from "react-icons/fc";
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : `http://${window.location.hostname}:5000`;

class VideoMeeting extends Component {
  constructor(props) {
    super(props);

    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      myNickName: props.nickname,
      username: props.username,
      mySession: props.session,
      session: undefined,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }
  // componentWillMount() {
  //   this.joinSession();
  // }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myNickName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    subscribers.splice(index, 1);
    if (index > -1) {
      console.log("delete", subscribers);
      // if()
      if (
        streamManager.stream.connection.connectionId ==
        this.state.session.connection.connectionId
      );
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;
        // --- 3) Specify the actions when events take place in the session ---
        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);
          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });
        // mySession.on("connectionDestroyed", (event) => {
        //   this.deleteSubscriber(event.stream.streamManager);
        // });
        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((token) => {
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, {
              clientData: this.state.myNickName,
              username: this.state.username,
            })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
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
              var devices = await this.OV.getDevices();
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
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: this.state.mySession,
      myNickName: this.state.myNickName,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const myNickName = this.state.myNickName;
    const username = this.state.username;

    return (
      <div
        className="video--container flex flex-col items-center justify-center"
        style={{
          minHeight: "100vh",
        }}
      >
        {this.state.session === undefined ? (
          <>
            <TitleHeader title={"Join Your Meeting Now"} wrapperBg={"w-full"} />
            <div
              className="items-center p-5 flex sm:w-1/2 xl:w-2/3 flex-col gap-2 
            bg-white shadow-xl rounded-lg"
            >
              <Input value={myNickName} onChange={this.handleChangeUserName} />
              <FcVideoCall
                className="text-5xl sm:!text-6xl lg:!text-7xl !text-white !fill-white"
                fill="white"
                color="white"
              />
              <Button
                className="!rounded !p-4 !text-white !flex justify-center !font-medium !m-0 
                items-center !bg-blue-500 hover:bg-gray-400 hover:!bg-blue-800"
                onClick={this.joinSession}
              >
                Join Now
              </Button>
            </div>
          </>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session" className="flex flex-col gap-1 grow">
            <div id="session-header flex gap-2">
              {/* <h1 id="session-title">{this.state.mySession}</h1> */}
              <Button
                className="!p-1 !bg-red-500/70 !text-white hover:!bg-red-700 !rounded"
                onClick={this.leaveSession}
              >
                Leave Now
              </Button>
              <Button
                className="!p-1 !bg-blue-700/70 !text-white hover:!bg-blue-800 !rounded"
                onClick={this.switchCamera}
              >
                Switch Camera
              </Button>
            </div>
            {this.state.mainStreamManager !== undefined ? (
              <div id="main-video" className="w-full my-2 lg:w-3/4 xl:w-4/5">
                <UserVideoComponent
                  streamManager={this.state.mainStreamManager}
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
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="stream-container w-1/5 sm:w-1/4 lg:w-1/4 xl:w-1/5"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async getToken() {
    return await this.createToken(this.state.mySession);
  }
  async createSession() {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/join/meeting`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${new Cookies().get("accessToken")}`,
        },
      }
    );
    return response.data; // The sessionId
  }
  async createToken(sessionId) {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/join/meeting/?session=${sessionId}`,
      { data: JSON.stringify({ username: this.props.username }) },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${new Cookies().get("accessToken")}`,
        },
      }
    );
    return response.data; // The token
  }
}

export default VideoMeeting;
