import React from "react";
import "./tablegrid.css";
import { Table } from "antd";
const TableGrid = ({
  noGap,
  noMargin,
  customGrid,
  items,
  colKey,
  maxPageSize,
  lastItem,
  isFull,
  heightFull,
}) => {
  return (
    <Table
      pagination={
        items?.length > (maxPageSize || 10)
          ? {
              showSizeChanger: false,
              pageSize: maxPageSize || 10,
              position: ["bottomCenter"],
              // showPrevNextJumpers: true,
            }
          : false
      }
      size="large"
      showHeader={false}
      className={`w-full ${noMargin ? "" : "m-4"} ${
        heightFull ? "h--full" : ""
      } table--grid ${noGap ? "no--gap" : ""} ${lastItem ? "last--item" : ""}`}
      rowClassName={(rec, i) =>
        `${
          isFull && isFull?.some(({ key }) => key == rec?.key) ? "w-full" : ""
        } !rounded flex ${customGrid ? customGrid : "xl:w-1/3 2xl:w-1/4"} grow`
      }
      columns={[
        {
          dataIndex: colKey,
          key: colKey,
        },
      ]}
      dataSource={items?.map(({ key, element }) => ({
        key,
        [colKey]: element,
      }))}
    />
  );
};

export default TableGrid;
