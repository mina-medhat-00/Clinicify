import React from "react";
import { Button, Form, Input, Select } from "antd";
import { cityOption } from "../../../sign/signup/signupUtils/signData";
import { prefixSelector } from "../../../sign/signup/signupUtils/utils";
import { GiModernCity } from "react-icons/gi";
import { SiOpenstreetmap } from "react-icons/si";
import { BsFillTelephoneFill, BsPhoneVibrate } from "react-icons/bs";
import submitClinic from "../profileServices/submitClinic";
import { useUserContext } from "../../../../contexts/UserContextProvider";
import { useProfileContext } from "../../../../contexts/ProfileContextProvider";
const { Item } = Form;
const ClinicRegister = () => {
  const { messageApi, fetchUserData, userData } = useUserContext();
  const { fetchProfileData } = useProfileContext();
  return (
    <div className="bg-gray-700 md:w-3/4 lg:w-1/2 ml-auto mr-auto font-medium text-white p-2 rounded-md mt-2">
      <div className="text-center text-xl sm:text-2xl border-b-2 border-gray-100/80">
        Update Your Clinic Information
      </div>
      <Form
        className="!p-2 bg-gray-500/80 shadow-md"
        initialValues={{
          prefix: "20",
        }}
        onFinish={(values) => {
          submitClinic(
            values,
            messageApi,
            fetchProfileData,
            fetchUserData,
            userData?.user_id
          );
        }}
      >
        <div className="bg-gray-700 p-2 rounded-md">
          <Item className="!w-full">
            <Input.Group className="!w-full">
              <div className="flex flex-wrap gap-1 sm:flex-nowrap items-center">
                <div className="mt-2 address--header flex w-full sm:w-2/5">
                  <div className="w-full">
                    <div className="flex gap-0.5 pb-1 items-center">
                      <GiModernCity className="text-white text-xl" />
                      <label className="text-gray-300 px-2">Clinic City</label>
                    </div>
                    <Item
                      name={["address", "city"]}
                      rules={[
                        {
                          required: true,
                          message: "city is required",
                        },
                      ]}
                      className="!m-0 !p-0"
                    >
                      <Select placeholder="Select Clinic Location" showSearch>
                        {cityOption}
                      </Select>
                    </Item>
                  </div>
                </div>
                <div className="grow mt-2">
                  <div className="flex gap-0.5 pb-1 items-center">
                    <SiOpenstreetmap className="text-white text-xl" />
                    <label className="text-gray-300 px-2">Clinic Street</label>
                  </div>
                  <Item
                    name={["address", "street"]}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Street is required",
                      },
                    ]}
                    className="!grow"
                  >
                    <Input placeholder="Clinic street" />
                  </Item>
                </div>
              </div>
            </Input.Group>
          </Item>
          <hr className="border-2 mb-2" />
          <div className="flex flex-wrap gap-1 sm:flex-nowrap items-center">
            <div className="grow">
              <div className="flex gap-0.5 pb-1 items-center">
                <BsPhoneVibrate className="text-white text-xl" />
                <label className="text-gray-300 px-2">
                  Contact Phone Number
                </label>
              </div>
              <Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please write contact phone number!",
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
            </div>
            <div className="grow">
              <div className="flex gap-0.5 pb-1 items-center">
                <BsFillTelephoneFill className="text-white text-xl" />
                <label className="text-gray-300 px-2">
                  Contact Telephone
                  <span className="text-gray-200 font-bold"> (optional)</span>
                </label>
              </div>
              <Item name="telephone">
                <Input
                  placeholder="Your phone number"
                  addonBefore={prefixSelector}
                />
              </Item>
            </div>
          </div>
          <div className="w-fit ml-auto">
            <Button
              htmlType="submit"
              className={`rounded-md hover:!bg-gray-800 !bg-gray-900 !font-medium !text-white`}
            >
              Update Now
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ClinicRegister;
