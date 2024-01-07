import { Table, TableColumnsType, Typography } from "antd";
import { useState } from "react";

const { Text } = Typography;

interface DataType {
  ma_hs: string;
  ma_hh: string;
  name_hh: string;
  sl: number;
  dvt: string;
  dg_usd: number;
  dg_usd_dkvc: number;
  nondoco: number;
  doco: number;
}

export default function DanhSachHangHoaInTknk() {
  const [data] = useState<DataType[]>([]);

  const columns: TableColumnsType<any> = [
    {
      title: "Mã HS",
      dataIndex: "ma_hs",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Mã hàng hóa",
      dataIndex: "ma_hh",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Tên hàng hóa",
      dataIndex: "name_hh",
      render: (text: any) => (
        <Text style={{ textAlign: "center", width: "100%" }}>{text}</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "sl",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn vị",
      dataIndex: "dvt",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn giá(USD)",
      dataIndex: "dg_usd",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "Đơn giá theo ĐKVC(USD)",
      dataIndex: "dg_usd_dkvc",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "SL chưa làm C/O",
      dataIndex: "nondoco",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: "SL đã làm C/O",
      dataIndex: "doco",
      render: (text: any) => <Text>{text}</Text>,
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
