import React, { useEffect } from "react";
import {
  Select,
  Upload,
  message,
  Checkbox,
  Button,
  Form,
  Input,
  DatePicker,
  Radio,
  Space,
  InputNumber,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { suffixSelector, prefixSelector } from "./signupUtils/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserType from "./signupUtils/UserType";
import HeaderLine from "./signupUtils/HeaderLine";
import { cityOption } from "./signupUtils/signData";
import { useUtilsContext } from "../../../contexts/UtilsContextProvider";
import { useUserContext } from "../../../contexts/UserContextProvider";
const { Option } = Select;

const getMessage = (key, type, content, duration) => ({
  key,
  type,
  content,
  duration,
});

// function returns a promise
const beforeUpload = (file) => {
  return new Promise((resolve) => {
    // check the file type - you can specify the types you'd like here:
    const isImg =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/gif" ||
      file.type === "image/webp";
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isImg) {
      message.error("You can only upload images", 4);
    } else if (!isLt5M) {
      message.error("Image must smaller than 5MB!", 4);
    } else resolve(false);
  });
};
const normFile = (e, setImageUrls) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  const imageUrls = [];
  e?.fileList.map((file, i) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => (imageUrls[i] = reader.result));
    reader.readAsDataURL(file.originFileObj);
  });
  setImageUrls(imageUrls);
  return e?.fileList;
};

/*
request to server at every change on username field, 
used to check if new username already used

respond with 
status 200 means indicate that it's new username  
status 400 means that name already exist,
status 500 refer to internal server error,
*/

const checkUserName = (uname, setValidState) => {
  // setValidState("error");
  const host = window?.location?.hostname;
  axios
    .get(`http://${host}:5000/chkuname/${uname}`)
    .then(() => {
      if (uname) setValidState("success");
      // new user name
      else setValidState(""); // empty field
    })
    .catch((err) => {
      if (err?.response?.status === 400)
        // bad request, name already exists
        setValidState("error");
      else setValidState("error1"); // server error
    });
};

function Signup() {
  const { messageApi, t } = useUtilsContext();
  const { userData: user } = useUserContext();
  const { Item } = Form;
  const isMobile = useMediaQuery({
    query: "(max-width:778px)",
  });
  const [validState, setValidState] = useState("");
  const [formValues, setFormValues] = useState({
    prefix: "20",
  });
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user_id) return navigate("/");
  }, []);

  /*
  request to server at submit, used to add user to database

  respond with 
  status 200 means that added successfully to database  
  status 400 means that name already exist,
  status 500 refer to internal server error,
  */

  const addUser = (values) => {
    if (validState === "success" || validState === "") {
      messageApi.open(getMessage(1, "loading", "signing up...", 8));
      values.birth = values?.birth?.format("YYYY-MM-DD");
      values.images = imageUrls?.[0];
      values.moreInf = formValues.moreInf;
      const host = window?.location?.hostname;
      axios
        .post(
          `http://${host}:5000/adduser`,
          {
            data: values,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then(({ data }) => {
          messageApi.open(
            getMessage(
              1,
              "success",
              `${values?.username} ${t("added you can login now")}`,
              2
            )
          );
          setTimeout(() => navigate(`/login`), 2000);
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.data?.data?.err?.code == "ER_DUP_ENTRY") {
            // bad request, name already exists
            setValidState("error");
            messageApi.open(
              getMessage(
                1,
                "error",
                `${values?.username} ${t(
                  "already exist, please write new username"
                )}`,
                2
              )
            );
          } else {
            setValidState("");
            messageApi.open(
              getMessage(
                1,
                "error",
                `${t("there's some issues, please try again later")}`,
                2
              )
            );
          } // server error
        });
    }
  };

  const setValues = (changedVal, values) => {
    const chk = /^([A-Z]|[a-z])+.{0,22}$/.test(changedVal?.username);
    if (changedVal?.username && chk) {
      setValidState("validating");
      checkUserName(changedVal.username, setValidState);
    } else if (changedVal?.username === "" || !chk) setValidState("");
    setFormValues({ ...formValues, ...values });
  };

  return (
    <div
      className="form--up--wrapper grow
    p-2 sm:p-10 flex justify-center"
      style={{
        background:
          "linear-gradient(to right top,rgb(93 98 128 / 85%) , rgb(108 146 192 / 90%))",
        // "linear-gradient(to right top, rgba(32, 58, 89, 0.9), #334297d9)",
        // background: "linear-gradient(225deg, rgb(32 58 89 / 90%), #a1858bff)",
      }}
    >
      <Form
        name="register"
        autoComplete="on"
        layout="vertical"
        initialValues={formValues}
        onValuesChange={setValues}
        className="w-full lg:w-4/5 xl:w-2/3 sm:mt-0 !mt-5"
        size="large"
        onFinish={addUser}
        scrollToFirstError
      >
        <HeaderLine
          value={t("SignUp")}
          center
          invisible
          size="no"
          classText="text-4xl sm:text-5xl xl:text-6xl"
          style={{ color: "white", marginBottom: "65px" }}
        />
        <HeaderLine value={t("Required Informations")} />
        <div className="flex flex-wrap gap-1">
          <div className="grow sm:w-1/3 w-full">
            <HeaderLine
              imp
              value={t("nickname")}
              size={"sm"}
              font="medium"
              classLine={"w-1/2 border-1 mb-2"}
            />
            <Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: `${t("Please write your nickname!")}`,
                },
              ]}
            >
              <Input placeholder={t("nickname")} />
            </Item>
          </div>
          <div className="grow sm:w-1/3 w-full">
            <HeaderLine
              imp
              value={t("username")}
              size={"sm"}
              font="medium"
              classLine={"w-1/2 border-1 mb-2"}
            />
            <Item
              name="username"
              validateStatus={validState}
              help={
                validState === "error"
                  ? "username already existed"
                  : validState?.at(-1) === "1"
                  ? "cannot contact with server write now"
                  : null
              }
              hasFeedback
              rules={[
                {
                  required: true,
                  message: `${t("Please input your username!")}`,
                },
                {
                  pattern: "^([A-Z]|[a-z])+.{0,22}$",
                  message: `${t(
                    "must begin with letters and max 22 character"
                  )}`,
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={t("username")} />
            </Item>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="grow sm:w-1/3 w-full">
            <Item
              name="password"
              rules={[
                {
                  required: true,
                  message: `${t("Please input your password!")}`,
                },
                {
                  message: `${t(
                    "Minimum 8 and maximum 14 characters, at least one uppercase letter, one lowercase letter"
                  )}  `,
                  pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,14}$",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t("Password")}
              />
            </Item>
          </div>
          <div className="grow sm:w-1/3 w-full">
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: `${t("Please confirm your password!")}`,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t("Confirm Password")} />
            </Form.Item>
          </div>
        </div>
        <HeaderLine value={t("Privacy Informations")} />
        <div className="flex items-end gap-1 justify-between flex-wrap">
          <div className="grow">
            <HeaderLine
              imp
              value={t("Gender")}
              size={"sm"}
              font="medium"
              classLine={"w-1/2 border-1 mb-2"}
            />
            <Item
              name="gender"
              rules={[
                { required: true, message: `${t("Please select gender!")}` },
              ]}
            >
              <Select placeholder={t("Select your gender")}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Item>
          </div>
          <div className="grow">
            <Item
              name="birth"
              rules={[
                {
                  required: true,
                  message: `${t("you enter your birthdate")}`,
                },
                {
                  message: `${t("your age must be more than 13")}`,
                  validator(_, value) {
                    if (new Date().getFullYear() - value?.year() < 13)
                      return Promise.reject();
                    else return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder={t("birthdate")}
              />
            </Item>
          </div>
        </div>
        <div>
          <HeaderLine
            imp
            value={t("Address")}
            size={"sm"}
            font="medium"
            classLine={"w-1/2 border-1 mb-2"}
          />
          <Item className="!w-full">
            <Input.Group className="!w-full">
              <div className="flex flex-wrap sm:flex-nowrap items-center">
                <div className="address--header w-full sm:w-2/5">
                  <Item
                    name={["address", "city"]}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: `${t("city is required")}`,
                      },
                    ]}
                  >
                    <Select placeholder={t("Select city")} showSearch>
                      {cityOption}
                    </Select>
                  </Item>
                </div>
                <Item
                  name={["address", "street"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: `${t("Street is required")}`,
                    },
                  ]}
                  className="!grow"
                >
                  <Input placeholder={t("Your street")} />
                </Item>
              </div>
            </Input.Group>
          </Item>
        </div>
        <div className={`flex ${isMobile ? "flex-wrap" : ""} gap-1`}>
          <div className={`grow ${!isMobile && "max-w-[65%]"}`}>
            <Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: `${t("Please write your phone number!")}`,
                },
                {
                  message:
                    "please write phone number with 8 digits after 01x or 1x",
                  pattern: "^0?(10|11|12|15)[0-9]{8,8}$",
                },
              ]}
            >
              <Input
                placeholder={t("Your phone number")}
                addonBefore={prefixSelector}
              />
            </Item>
          </div>
          <div className={`grow ${!isMobile && "max-w-[65%]"}`}>
            <Item
              name="email"
              rules={[
                {
                  required: true,
                  message: `${t("you must write your email!")}`,
                },
                {
                  type: "email",
                  message: `${t("write correct email please!!")}`,
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder={t("Your email")} />
            </Item>
          </div>
        </div>
        <Item>
          <Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => normFile(e, setImageUrls)}
            noStyle
          >
            <Upload.Dragger
              name="file"
              beforeUpload={beforeUpload}
              //onChange={handleChange}
              accept=".png, .jpg, .jpeg, .bpm, .webp"
              listType="picture"
              multiple={false}
              maxCount={5}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="font-bold">
                Click or drag your image to this area to upload
              </p>
              <p className="ant-upload-hint">Support only a single upload.</p>
            </Upload.Dragger>
          </Item>
        </Item>
        <Item
          name="userType"
          rules={[
            {
              required: true,
              message: `${t("you must choose between staff or user")}`,
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button
              className={`!hover:bg-gray-200 !border-2 
              !bg-gray-700 !text-white
              ${formValues?.userType === "user" && "!bg-purple-500"}
              `}
              value="user"
            >
              {t("user")}
            </Radio.Button>
            <Radio.Button
              className={`!ml-1 !hover:bg-gray-200 !border-2 
              !bg-gray-700 !text-white
              ${formValues?.userType === "doctor" && "!bg-purple-500"}
              `}
              value="doctor"
            >
              {t("doctor")}
            </Radio.Button>
          </Radio.Group>
        </Item>
        <UserType
          userType={formValues?.userType}
          setFormValues={setFormValues}
          formValues={formValues}
        />
        <Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full !border !border-white  !bg-blue-600/80 hover:!bg-blue-600"
          >
            {t("Submit")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default Signup;
