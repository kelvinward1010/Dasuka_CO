import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Input, Table, TableColumnsType, Typography } from "antd";
import { useState } from "react";

import { danhsachtokhaihoadondata } from "./fakedata";

const { Text } = Typography;

export function DanhSachTkHdTable(): JSX.Element {
  const [data, setData] = useState(danhsachtokhaihoadondata);
  const handleDownload = (e: any) => {
    console.log(e);
  };

  const handleDelete = (key: any) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    console.log(key);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      width: "7%",
      key: "stt",
      render: (text: any) => (
        <Text style={{ textAlign: "center" }}>{text}</Text>
      ),
    },
    {
      title: "Tên file",
      dataIndex: "name_file",
      key: "name_file",
      render: (text: any) => <Text style={{ textAlign: "left" }}>{text}</Text>,
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      width: "35%",
      render: (text: any) => (
        <Input style={{ textAlign: "left" }} value={text} />
      ),
    },
    {
      title: "Tải về",
      width: "7%",
      key: "download",
      align: "center",
      render: (_: any, record: any) => (
        <div>
          <DownloadOutlined
            onClick={() => handleDownload(record?.key)}
            style={{ color: "#13AEDF", cursor: "pointer" }}
          />
        </div>
      ),
    },
    {
      title: "Xóa",
      width: "7%",
      key: "download",
      align: "center",
      render: (_: any, record: any) => (
        <div>
          <DeleteOutlined
            onClick={() => handleDelete(record?.key)}
            style={{ color: "#FF0000", cursor: "pointer" }}
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
      dataSource={data}
      pagination={false}
    />
  );
}
