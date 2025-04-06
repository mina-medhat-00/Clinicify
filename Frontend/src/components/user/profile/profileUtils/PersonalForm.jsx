import { Button, DatePicker, Form, Input, Select } from "antd";
import React from "react";
import HeaderLine from "../../../sign/signup/signupUtils/HeaderLine";
import { prefixSelector } from "../../../sign/signup/signupUtils/utils";
import { MailOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import submitPersonal from "../profileServices/submitPersonal";
import ProfileTable from "./ProfileTable";
import { cityOption } from "../../../sign/signup/signupUtils/signData";
const { Item } = Form;
const { Option } = Select;
const PersonalForm = ({
  messageApi,
  fetchProfileData,
  fetchUserData,
  userName,
  initialValues,
}) => {
  const isMobile = useMediaQuery({
    query: "(max-width:660px)",
  });
  const editData = [
    {
      headers: ["Personal"],
      data: [
        {
          name: "nickname",
          value: (
            <Item
              className="!mb-0"
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "Please write your nickname!",
                },
              ]}
            >
              <Input placeholder="nickname" />
            </Item>
          ),
        },
        {
          name: "gender",
          value: (
            <Item
              className="!mb-0"
              name="gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="Select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Item>
          ),
        },
        {
          name: "birth",
          value: (
            <Item
              className="!mb-0"
              name="birth"
              rules={[
                {
                  required: true,
                  message: "you enter your birthdate",
                },
                {
                  message: "your age must be more than 13",
                  validator(_, value) {
                    if (new Date().getFullYear() - value?.year() < 13)
                      return Promise.reject();
                    else return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="birthdate" />
            </Item>
          ),
        },
      ],
    },
    {
      headers: ["Contact"],
      data: [
        {
          name: "Phone Number",
          value: (
            <Item
              className="!mb-0"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please write your phone number!",
                },
                {
                  message:
                    "please write phone number with 8 digits after 01x or 1x",
                  pattern: "^0?(10|11|12|15)[0-9]{8,8}$",
                },
              ]}
            >
              <Input
                placeholder="Your phone number"
                addonBefore={prefixSelector}
              />
            </Item>
          ),
        },
        {
          name: "Email",
          value: (
            <Item
              className="!mb-0"
              name="email"
              rules={[
                {
                  required: true,
                  message: "you must write your email!",
                },
                {
                  type: "email",
                  message: "write correct email please!!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Your email" />
            </Item>
          ),
        },
      ],
    },
  ];
  return (
    <div className="bg-gray-200 p-2 w-full rounded-lg">
      <Form
        initialValues={{ ...initialValues }}
        onFinish={(values) =>
          submitPersonal(
            values,
            messageApi,
            fetchProfileData,
            fetchUserData,
            userName
          )
        }
      >
        {editData?.map(({ data, headers }, i) => (
          <ProfileTable key={i + 1} data={data} headers={headers} />
        ))}
        <div>
          <Item className="!w-full">
            <Input.Group className="!w-full">
              <ProfileTable
                data={[
                  {
                    name: "city",
                    value: (
                      <Item
                        className="!mb-0"
                        name={["address", "city"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "city is required",
                          },
                        ]}
                      >
                        <Select
                          className="!w-full"
                          placeholder="Select city"
                          showSearch
                        >
                          {cityOption}
                        </Select>
                      </Item>
                    ),
                  },
                  {
                    name: "street",
                    value: (
                      <Item
                        className="!mb-0"
                        name={["address", "street"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "Street is required",
                          },
                        ]}
                      >
                        <Input placeholder="Your street" />
                      </Item>
                    ),
                  },
                ]}
                headers={["Address"]}
              />
            </Input.Group>
          </Item>
        </div>
        <div className="flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            style={{
              color: "white",
              fontFamily: "sans-serif",
              fontSize: "28px",
            }}
            className={`!rounded-lg !text-xs lg:!text-sm
          !bg-gray-600 !py-6 !font-medium 
          !border-gray-700 !px-8 !flex !items-center hover:!bg-gray-700`}
          >
            Edit Now
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PersonalForm;
