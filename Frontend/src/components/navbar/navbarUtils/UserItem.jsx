import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Avatar, message, Button, Card, Skeleton } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { PoweroffOutlined } from "@ant-design/icons";
import Cookies from "universal-cookie";
import { useMediaQuery } from "react-responsive";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
import { useUserContext } from "../../../contexts/UserContextProvider";
let TimeId;

const UserItem = () => {
  const { t, messageApi } = useUtilsContext();
  const { isloading, setUserData, userData: user } = useUserContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({
    query: "(max-width:678px)",
  });
  const [showLogout, setShowLogout] = useState(false);
  useEffect(() => {
    const wrap = document.querySelector(".user--nav--wrapper");
  }, []);
  const location = useLocation();
  return !isloading && user ? (
    <div
      onTouchMove={() => {
        setShowLogout(true);
      }}
      onMouseEnter={() => {
        setShowLogout(true);
      }}
      onTouchEnd={() => {
        setShowLogout(false);
      }}
      onMouseLeave={() => {
        setShowLogout(false);
      }}
      className="user--nav--wrapper text-center rounded-bl-lg
          rounded-br-lg inline-flex cursor-pointer
      grow justify-between items-center"
    >
      <Link
        to={
          user?.user_type == "user"
            ? `/profile/${user?.user_name}`
            : user?.user_type == "admin"
            ? `/admin`
            : `/dashboard`
        }
        className="text-white grow !inline-block
          font-bold hover:text-white !z-10"
      >
        <Button className="!w-full !h-full !bg-transparent !text-white !p-1 !border-0 !font-bold hover:!text-white">
          {user?.nick_name || "Profile"}
        </Button>
      </Link>
      {(showLogout || isMobile) && (
        <div
          style={{
            left: `calc(100% - 40px)`,
          }}
          className="absolute z-20 flex items-center"
        >
          <Button
            //   loading={isUserLoading ? true : false}
            shape="circle"
            size="small"
            icon={<PoweroffOutlined />}
            className="!text-white flex
            justify-center align-center
            shadow-md mr-1 !bg-red-700 hover:!bg-red-600
            rounded border font-bold hover:text-white"
            style={{
              width: "35px",
              height: "35px",
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
    </div>
  ) : (
    <Skeleton.Button active className="!w-full" />
  );
};

export default UserItem;
