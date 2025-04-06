import { Button, Form, Input, Select } from "antd";
import React from "react";
import { prefixSelector } from "../../../sign/signup/signupUtils/utils";
import ProfileTable from "./ProfileTable";
import { cityOption } from "../../../sign/signup/signupUtils/signData";
import submitClinic from "../profileServices/submitClinic";
const { Item } = Form;
const ClinicForm = ({
  messageApi,
  fetchProfileData,
  fetchUserData,
  userName,
  initialValues,
}) => {
  const editData = [
    {
      headers: ["Contact"],
      data: [
        {
          name: "Clinic Phone Number",
          value: (
            <Item
              className="!mb-0"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please write clinic phone number!",
                },
                {
                  message:
                    "please write phone number with 8 digits after 01x or 1x",
                  pattern: "^0?(10|11|12|15)[0-9]{8,8}$",
                },
              ]}
            >
              <Input
                placeholder="Clinic phone number"
                addonBefore={prefixSelector}
              />
            </Item>
          ),
        },
        {
          name: "Clinic Telephone",
          value: (
            <Item className="!mb-0" name="telephone">
              <Input
                placeholder="Clinic telephone"
                addonBefore={prefixSelector}
              />
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
          submitClinic(
            values,
            messageApi,
            fetchProfileData,
            fetchUserData,
            userName,
            true
          )
        }
      >
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
                        <Input placeholder="Clinic street" />
                      </Item>
                    ),
                  },
                ]}
                headers={["Clinic Location"]}
              />
            </Input.Group>
          </Item>
        </div>
        {editData?.map(({ data, headers }, i) => (
          <ProfileTable key={i + 1} data={data} headers={headers} />
        ))}
        <div className="flex mt-2 justify-end">
          <Button
            type="primary"
            htmlType="submit"
            style={{
              color: "white",
              fontFamily: "sans-serif",
              fontSize: "28px",
            }}
            className={`!rounded-lg !text-xs lg:!text-sm
              !bg-gray-600 !py-4 !font-medium 
              !border-gray-700 !px-8 !flex !items-center hover:!bg-gray-700`}
          >
            Edit Now
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ClinicForm;
