import React from "react";
import { TitleHeader } from "../home/HomePage";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";
import { useUserContext } from "../../contexts/UserContextProvider";
import { Button, Form, Input, Radio } from "antd";
import { TbReport } from "react-icons/tb";
import RadioItems from "./reportProblemUtils/RadioItems";
import submitReport from "./reportServices/submitReport";
import HeaderLine from "../sign/signup/signupUtils/HeaderLine";
const { Item } = Form;
const reportTypeData = [
  {
    name: "Internet Connection issue",
    value: "Poor internet connection",
  },
  {
    name: "Payment issue",
    value: "Payment issue, cannot refund my money",
  },
  {
    name: "Video call issue",
    value: "Video call cannot work properly",
  },
  {
    name: "Universal access issue",
    value: "Lack of universal access to technology",
  },
  {
    name: "Chat Lags issue",
    value: "Lags in chat that make communication more difficult",
  },
  {
    name: "Privacy vulnerable issue",
    value: "  Privacy issue that make my information vulnerable",
  },
  {
    name: "Other issue",
    value: "Other issue",
  },
];
const ReportProblem = () => {
  const { t, messageApi } = useUtilsContext();
  const [form] = Form.useForm();
  const { fetchUserData } = useUserContext();
  return (
    <div>
      <TitleHeader
        icon={<TbReport className="!text-white !text-2xl !m-auto" />}
        title={"Report a problem"}
        contentBg="bg-gray-400"
        wrapperBg={"no"}
      />
      <div
        className="rounded-lg bg-gray-600 shadow-xl p-3 m-auto
       sm:w-4/5 xl:w-2/3 "
      >
        <Form
          form={form}
          onFinish={(values) => {
            submitReport(
              values?.issue,
              values?.reportType,
              messageApi,
              fetchUserData,
              form
            );
          }}
        >
          <div className="flex flex-col gap-4">
            <Item
              name="issue"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea
                maxLength={600}
                placeholder="Please, type your issue"
                className="!bg-gray-900 !text-white !text-base sm:!text-xl"
                style={{
                  overflow: "auto",
                  padding: "4px",
                  height: 150,
                }}
              />
            </Item>
            <Item
              rules={[
                {
                  required: true,
                  message: "choose one of report cause",
                },
              ]}
              fieldId="reportType"
              name="reportType"
            >
              {/* <div>
                <Radio.Group>
                  <div>
                    <Radio value={1}>d</Radio>
                    <Radio value={2}>f</Radio>
                    <Radio value={3}>f</Radio>
                  </div>
                </Radio.Group>
              </div> */}
              <Radio.Group>
                <div className="bg-gray-700 rounded shadow-xl">
                  <HeaderLine value="Report Cause" classText="ml-2" />
                  <div
                    className={`font-medium text-white
                  p-4 flex gap-4
    items-center flex-wrap justify-between sm:justify-around`}
                  >
                    {reportTypeData.map(({ value, name }) => (
                      <Radio
                        className={
                          "sm:!w-1/3 !text-xs sm:!text-sm !text-gray-200"
                        }
                        key={name}
                        value={name}
                      >
                        {value}
                      </Radio>
                    ))}
                  </div>
                </div>
              </Radio.Group>
            </Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                color: "white",
                fontFamily: "sans-serif",
                fontSize: "28px",
              }}
              className={`!rounded-lg !w-fit !text-xs lg:!text-sm
              !bg-blue-600 !py-4 !font-medium 
              !border-white !px-8 !flex !items-center hover:!bg-blue-700`}
            >
              Send Now
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ReportProblem;
