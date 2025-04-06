import { Input, Form, Button } from "antd";
import React from "react";
import HeaderLine from "../../../sign/signup/signupUtils/HeaderLine";
import submitMedical from "../profileServices/submitMedical";
import ProfileTable from "./ProfileTable";
const { Item } = Form;
const MedicalForm = ({
  userName,
  messageApi,
  fetchProfileData,
  fetchUserData,
  initialValues,
  isEdit,
}) => {
  return (
    <Form
      initialValues={initialValues}
      onFinish={(values) =>
        submitMedical(
          values,
          messageApi,
          fetchProfileData,
          fetchUserData,
          userName,
          isEdit
        )
      }
    >
      <div className="bg-gray-200 shadow-sm rounded-lg p-2">
        <ProfileTable
          headers={["Medical Informations"]}
          data={[
            {
              name: "Current issue",
              value: (
                <Item
                  className="!my-0 !p-1"
                  name="currentIssue"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input.TextArea
                    maxLength={250}
                    className="scroll--v !text-md !font-medium 
!rounded-lg"
                    style={{ resize: "none" }}
                    placeholder="State your current issue"
                  />
                </Item>
              ),
            },
            {
              name: "Illnesses history",
              value: (
                <Item className="!my-0 !p-1" name="illnessesHistory">
                  <Input.TextArea
                    maxLength={250}
                    className="scroll--v !text-md !font-medium 
            !rounded-lg"
                    style={{ resize: "none" }}
                    placeholder="Your diseases, illness history or other issues"
                  />
                </Item>
              ),
            },
            {
              name: "Allergies",
              value: (
                <Item className="!my-0 !p-1" name="allergies">
                  <Input.TextArea
                    maxLength={250}
                    className="scroll--v !text-md !font-medium 
!rounded-lg"
                    style={{ resize: "none" }}
                    placeholder="Allergies"
                  />
                </Item>
              ),
            },
            {
              name: "Immunzations",
              value: (
                <Item className="!my-0 !p-1" name="immunizations">
                  <Input.TextArea
                    maxLength={250}
                    className="scroll--v !text-md !font-medium 
            !rounded-lg"
                    style={{ resize: "none" }}
                    placeholder="Immunzations"
                  />
                </Item>
              ),
            },
            {
              name: "Surgeries",
              value: (
                <Item className="!my-0 !p-1" name="surgeries">
                  <Input.TextArea
                    maxLength={250}
                    className="scroll--v !text-md !font-medium 
            !rounded-lg"
                    style={{ resize: "none" }}
                    placeholder="Surgeries"
                  />
                </Item>
              ),
            },
          ]}
        />
        <div className="flex mt-2 justify-center items-center">
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
            {isEdit ? "Edit Now" : "Add Now"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default MedicalForm;
