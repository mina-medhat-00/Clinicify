import React from "react";
import { Row, Col, Avatar, message, Button, Card } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { PoweroffOutlined } from "@ant-design/icons";
import Loader from "../Loader";
import Cookies from "universal-cookie";
const SignBanner = ({
  user,
  setUserData,
  setShowMenu,
  isUserLoading,
  messageApi,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {!user && !isUserLoading ? null : (
        // (
        //   <Row
        //     className="text-center !p-1 !mx-2 bg-gray-600 rounded-bl-lg
        //  rounded-br-lg gap-1 cursor-pointer mb-px p-1
        //     grow w-full justify-evenly"
        //   >
        //     <Link
        //       to="/login"
        //       className="text-white inline-block p-2
        //     shadow-md hover:!bg-gray-700
        //     rounded border font-bold grow hover:text-white"
        //       style={{ backgroundColor: "rgb(38 59 61)" }}
        //       onClick={() => setShowMenu(false)}
        //     >
        //       Login
        //     </Link>
        //     <Link
        //       to="/signup"
        //       style={{ background: "rgb(38 59 61)" }}
        //       className="text-white grow inline-block p-2
        //   shadow-md border hover:!bg-gray-700 rounded
        //   font-bold hover:text-white"
        //       onClick={() => setShowMenu(false)}
        //     >
        //       SignUp
        //     </Link>
        //   </Row>
        // ) : (
        <div
          className="text-center p-1 mx-2 bg-gray-600 rounded-bl-lg
          rounded-br-lg mb-1 flex gap-1 cursor-pointer
      grow justify-evenly items-center"
        >
          <Link
            style={{ background: "rgb(38 59 61)" }}
            to={
              user?.user_type == "user"
                ? `/profile/${user?.user_name}`
                : `/dashboard`
            }
            className="text-white grow //!bg-gray-500 inline-block 
          shadow-md border hover:!bg-gray-700 rounded
          font-bold hover:text-white"
            onClick={() => setShowMenu(false)}
          >
            <Button
              loading={isUserLoading ? true : false}
              className="!w-full !bg-transparent !h-10 !text-white !p-1 !border-0 !font-bold hover:!text-white"
            >
              {!isUserLoading && (
                <div className="flex gap-2 justify-center items-center">
                  {user?.img_url ? (
                    <Avatar src={user?.img_url} size="large" />
                  ) : (
                    <CgProfile
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )}
                  {user?.nick_name || "Profile"}
                </div>
              )}
            </Button>
          </Link>

          <Button
            loading={isUserLoading ? true : false}
            shape="circle"
            size="small"
            icon={<PoweroffOutlined />}
            className="!text-white flex
            justify-center align-center
          shadow-md mr-1 !bg-red-700 hover:!bg-red-600
          rounded border font-bold hover:text-white"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={() => {
              messageApi.open({
                type: "loading",
                content: "logout...",
                duration: 1,
              });
              new Cookies().remove("accessToken");
              if (location?.pathname != "/") {
                setTimeout(
                  () =>
                    messageApi.open({
                      key: 1,
                      type: "loading",
                      content: "Redirecting to your home page...",
                      duration: 1,
                    }),
                  1000
                );
                setTimeout(() => {
                  navigate(`/`);
                  //fetchUserData(true, null);
                  setUserData(null);
                }, 2000);
              } else setTimeout(() => setUserData(null), 1000);
            }}
          ></Button>
        </div>
      )}
    </>
  );
};

export default SignBanner;
