import { Table, Typography } from "antd";
import { useState } from "react";

const originData = [];

const { Text } = Typography;

export default function ChiTietTkNhapTable(data: { data: any[] }): JSX.Element {
  const [dt] = useState(data.data);

  const columns = [
    {
      title: "Mã HS",
      dataIndex: "ma_hs",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Mã hàng hóa",
      dataIndex: "ma_nvl",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Tên hàng hóa",
      dataIndex: "name_hh",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn vị",
      dataIndex: "dv",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn giá (USD)",
      dataIndex: "dg_usd",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn giá theo ĐKVC(USD)",
      dataIndex: "dg_dkvc",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "SL chưa làm C/O",
      dataIndex: "sl_not_co",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "SL đã làm C/O",
      dataIndex: "sl_done_co",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
  ];

  return (
    <Table
      size="small"
      bordered
      dataSource={dt}
      columns={columns}
      rowClassName="editable-row"
      pagination={{
        total: originData.length,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
        position: ["bottomRight"],
      }}
    />
  );
}
