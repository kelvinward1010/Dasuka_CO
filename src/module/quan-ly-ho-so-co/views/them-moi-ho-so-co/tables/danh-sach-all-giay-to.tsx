import { DownloadOutlined } from "@ant-design/icons";
import { Input, Table, TableColumnsType, Typography } from "antd";
import { useState } from "react";

import { danhsachallgiaytodata } from "./fakedata";

const { Text } = Typography;

export function DanhSachAllGiayToTable(): JSX.Element {
  const [data] = useState(danhsachallgiaytodata);
  const handleDownload = (e: any) => {
    console.log(e);
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
