import { Table, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function DanhSachNvlInThemmoiTable(data: { data: any }) {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("quan_ly_dinh_muc.table_add_new.stt"),
      dataIndex: "stt",
      width: "3%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.code_nl_vt"),
      dataIndex: "mnvl",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.name"),
      dataIndex: "name_nvl",
      width: "30%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dvt"),
      dataIndex: "dvt",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dinh_muc"),
      dataIndex: "dm",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.tlhh"),
      dataIndex: "tlhh",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dmkchh"),
      dataIndex: "dmkchh",
      width: "7%",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.nguon_cc"),
      dataIndex: "nguon_cc",
      width: "10%",
      render: (text: any) => <Text>{text}</Text>,
    },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      pagination={false}
      dataSource={data.data}
      rowKey={(key) => key.mnvl}
    />
  );
}
