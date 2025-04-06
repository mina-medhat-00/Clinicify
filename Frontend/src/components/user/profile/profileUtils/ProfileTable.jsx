import { Skeleton } from "antd";
import React from "react";

const ProfileTable = ({
  data,
  headers,
  headerColor,
  propColor,
  handleDrawer,
  icon,
  loadingProps = {},
}) => {
  return (
    <div className="w-full overflow-auto scroll--h">
      <table className="w-full text-left bg-white rounded-lg">
        {(headers || loadingProps?.active) && (
          <thead
            className={`text-gray-500 ${
              loadingProps.active
                ? "bg-gray-400 !rounded"
                : "border-b-2 border-gray-400"
            } ${headerColor || "bg-gray-700"}`}
          >
            <tr>
              {loadingProps?.active
                ? Array.from({
                    length: loadingProps?.numCol || 3,
                  }).map((_, i) => (
                    <th
                      key={i + 1}
                      scope="col"
                      className="px-1 py-4 text-gray-100"
                    >
                      <Skeleton.Button className="!w-full rounded-lg" active />
                    </th>
                  ))
                : headers?.map((val, i) => (
                    <th
                      key={i + 1}
                      scope="col"
                      colSpan={
                        (data ? Object.entries(data?.[0])?.[0]?.length : 0) /
                        (headers?.length || 1)
                      }
                      className="px-6 py-3 text-gray-100"
                    >
                      {val}
                    </th>
                  ))}
            </tr>
          </thead>
        )}
        <tbody>
          {loadingProps?.active
            ? Array.from({
                length: loadingProps?.numRow || 4,
              }).map((_, i) => (
                <tr key={i + 1}>
                  {Array.from({
                    length: loadingProps?.numCol || 3,
                  }).map((_, i) => (
                    <th key={i + 1} scope="row" className={`p-3`}>
                      <Skeleton.Button className="!w-full" active />
                    </th>
                  ))}
                </tr>
              ))
            : data?.map(({ name, value, preValue }, i, arr) => (
                <tr key={i + 1}>
                  <th
                    scope="row"
                    className={`text-gray-500/80 border-b border-gray-300 capitalize ${
                      propColor || "bg-gray-100"
                    } text-sm sm:text-lg 
              p-3 font-medium w-1/3`}
                  >
                    {name}
                  </th>
                  <td
                    className={`px-2 text-gray-400 ${
                      i + 1 == arr?.length ? "" : "border-b border-gray-100"
                    } break-all text-sm sm:text-lg font-medium`}
                  >
                    {preValue && value ? (
                      <>
                        {preValue} {value}
                      </>
                    ) : (
                      value || <div className="">{icon}</div>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;
