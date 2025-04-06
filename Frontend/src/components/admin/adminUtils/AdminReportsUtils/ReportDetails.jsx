import React from "react";
import { useReportContext } from "../../../../contexts/ReportContextProvider";
import ProfileTable from "../../../user/profile/profileUtils/ProfileTable";
import { Empty } from "antd";

const ReportDetails = () => {
  const { reportData: reportDetailsData, isLoading } = useReportContext();
  return (
    <div>
      {isLoading || reportDetailsData?.length ? (
        <ProfileTable
          loadingProps={{
            active: isLoading,
          }}
          headers={["Report Cause", "Issue"]}
          data={reportDetailsData?.map(
            ({ report_type, issue, issued_time }) => ({
              name: report_type,
              value: (
                <div className="w-full flex justify-between gap-2">
                  <div>{issue}</div>
                  <div
                    className="font-bold text-blue-500"
                    // style={{
                    //   whiteSpace: "nowrap",
                    // }}
                  >
                    from{" "}
                    {parseInt(
                      (new Date(issued_time).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </div>
                </div>
              ),
            })
          )}
        />
      ) : (
        <Empty
          description={
            <span className="!flex !flex-col items-center font-medium">
              There's no Reports Provided
            </span>
          }
        />
      )}
    </div>
  );
};

export default ReportDetails;
