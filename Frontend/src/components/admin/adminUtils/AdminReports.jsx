import React, { useRef, useState } from "react";
import { Avatar, Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser, FaUserSecret, FaUserTie } from "react-icons/fa";
import { GiDoctorFace } from "react-icons/gi";
import doctorPhoto from "../../../images/doctorPhoto.png";
import userPhoto from "../../../images/userPhoto.png";
import PopUp from "../../utils/PopUp";
import ReportContextProvider, {
  useReportContext,
} from "../../../contexts/ReportContextProvider";
import ReportDetails from "./AdminReportsUtils/ReportDetails";
import { GoReport } from "react-icons/go";
import { MdMessage } from "react-icons/md";

const AdminReports = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [showPop, setShowPop] = useState(false);
  const { isLoading: isReportLoading, reportData } = useReportContext();
  const searchInput = useRef(null);
  const handleSearch = (confirm) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            className="!flex !items-center !justify-center"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].nick_name
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (rec, record) => (
        <Link
          to={`/profile/${record?.key}`}
          className="flex flex-col bg-gray-200/80 hover:bg-gray-100/80  px-4 py-2 text-center rounded-md shadow-md justify-center items-center gap-2"
        >
          <Avatar
            className={"!bg-gray-700/80"}
            size="large"
            src={rec?.img_url}
          />
          <span className="font-medium text-gray-700">{rec?.nick_name}</span>
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "user_type",
      key: "user_type",
      filters: [
        {
          text: "doctor",
          value: "doctor",
        },
        {
          text: "user",
          value: "user",
        },
        {
          text: "admin",
          value: "admin",
        },
      ],
      onFilter: (val, rec) =>
        val?.toLowerCase() == rec?.user_type?.toLowerCase(),
      render: (value) => (
        <div className="flex px-1 py-2 bg-blue-400/80 shadow-md  rounded-md flex-col justify-center gap-2 items-center">
          {value == "doctor" ? (
            <GiDoctorFace />
          ) : value == "doctor" ? (
            <FaRegUser />
          ) : value == "admin" ? (
            <FaUserSecret />
          ) : (
            <FaUserTie />
          )}
          <span className="font-medium capitalize">{value}</span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
    },
  ];

  const reportValues = reportData?.map(
    ({ user_id, img_url, nick_name, user_type }) => ({
      key: user_id,
      user_type,
      action: (
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={(e) => {
              setSelectedUser({
                user_id,
                img_url:
                  img_url || (user_type == "doctor" ? doctorPhoto : userPhoto),
                nick_name,
                user_type,
              });
              setShowPop(true);
            }}
            className="!bg-red-400 hover:!bg-red-500 !rounded-lg !font-medium !text-white"
          >
            <div className="flex items-center gap-2">
              Show Reports <GoReport />
            </div>
          </Button>
          <Link
            to={"/chat"}
            onClick={() => {
              window.localStorage.setItem("chatTo", user_id);
            }}
            className="p-2 !bg-blue-400 border hover:!bg-blue-600/80 !rounded-lg !font-medium !text-white"
          >
            <div className="flex items-center gap-2">
              Answer him <MdMessage />
            </div>
          </Link>
        </div>
      ),
      name: {
        nick_name,
        img_url: img_url || (user_type == "doctor" ? doctorPhoto : userPhoto),
      },
    })
  );
  return (
    <div className="px-4 admin--table">
      <PopUp
        mt="80px"
        customWidth={"w-5/6 sm:w-4/5 lg:w-3/4"}
        handleClose={() => setShowPop(null)}
        show={showPop}
      >
        <ReportContextProvider reportFrom={selectedUser?.user_id}>
          <ReportDetails
            selectedUser={{
              user_id: selectedUser?.user_id,
              nick_name: selectedUser?.nick_name,
              img_url: selectedUser?.img_url,
              user_type: selectedUser?.user_type,
            }}
          ></ReportDetails>
        </ReportContextProvider>
      </PopUp>
      <div
        className="flex overflow-auto scroll--h"
        style={{
          height: `calc(100vh - 75px)`,
        }}
      >
        <div className="grow">
          <Table
            className="reports--table"
            pagination={
              reportData?.length > 4
                ? {
                    pageSize: 4,
                  }
                : false
            }
            columns={columns}
            loading={isReportLoading}
            dataSource={reportValues}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
