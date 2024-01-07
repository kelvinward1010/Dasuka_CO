import { DeleteOutlined } from "@ant-design/icons";
import { Input, Table, TableColumnsType, Typography } from "antd";
import { useState } from "react";

import { danhsachhanghoavatdata } from "./fakedata";

const { Text } = Typography;

export function DanhSachHangHoavatTable() {
  const [data, setData] = useState(danhsachhanghoavatdata);
  const handleDelete = (key: any) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Mã HS",
      dataIndex: "ma_hs",
      width: "7%",
      key: "ma_hs",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Mã hàng hóa",
      dataIndex: "ma_hh",
      key: "ma_hh",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Tên hàng hóa",
      dataIndex: "name_hh",
      key: "name_hh",
      render: (text: any) => (
        <Text style={{ textAlign: "center", width: "100%" }}>{text}</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      key: "sl",
      render: (text: any) => (
        <Input style={{ textAlign: "right" }} value={text} />
      ),
    },
    {
      title: "Đơn vị tính",
      dataIndex: "dvt",
      key: "dvt",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn giá(USD)",
      dataIndex: "dg_usd",
      key: "dg_usd",
      render: (text: any) => (
        <Input style={{ textAlign: "right" }} value={text} />
      ),
    },
    {
      title: "Thành tiền(USD)",
      dataIndex: "tt_usd",
      key: "tt_usd",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "",
      width: "5%",
      key: "download",
      render: (_: any, record: any) => (
        <div>
          <DeleteOutlined
            onClick={() => handleDelete(record?.key)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];
  return (
    <Table
      size="small"
      bordered
      columns={columns}
      pagination={false}
      dataSource={data}
    />
  );
}
