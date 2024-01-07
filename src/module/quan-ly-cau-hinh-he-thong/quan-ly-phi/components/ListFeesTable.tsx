import { Table, TableColumnsType, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useFees } from "../api/getFees";
import styles from "../style.module.scss";
import { Fee } from "../types/index";
import { DeleteFee } from "./DeleteFee";
import UpdateFeeModal from "./UpdateFee";

// const originData: any = [];

const { Text } = Typography;

export default function ListFeesTable(): JSX.Element {
  const { t } = useTranslation();

  // Set init params
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";

  const setTotalPage = useSetRecoilState(totalPageState);
  const userRecoil = useRecoilValue(getUserSelector);

  useEffect(() => {
    setTotalPage({
      total: 0,
      loading: true,
    });
  }, [searchContent, userRecoil.user_id, setTotalPage]);

  const data = useFees({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      user_id: userRecoil.user_id,
    },
    config: {
      // keepPreviousData: true,
      onSuccess: (data) => {
        setTotalPage({
          total: data.totalItems,
          loading: false,
        });
      },
    },
  });

  const columns: TableColumnsType<Fee> = [
    {
      title: t("quan_ly_phi.table_main.stt"),
      width: "3%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_phi.table_main.fee_id"),
      dataIndex: "fee_id",
      width: "10%",
      key: "fee_id",
      sorter: (a, b) => {
        const nameA = a.fee_id.toUpperCase(); // ignore upper and lowercase
        const nameB = b.fee_id.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (_, record) => {
        return <UpdateFeeModal fee={record} />;
      },
    },
    {
      title: t("quan_ly_phi.table_main.fee_name"),
      dataIndex: "fee_name",
      width: "35%",
      sorter: (a, b) => {
        const nameA = a.fee_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.fee_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_phi.table_main.unit"),
      dataIndex: "unit",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_phi.table_main.fee_type"),
      dataIndex: "fee_type",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_phi.table_main.action"),
      dataIndex: "action",
      width: "3%",
      key: "action",
      render: (_: any, record: any) => (
        <DeleteFee
          fee_id={record.fee_id}
          fee_name={record.fee_name}
          // onClick={() => handleDelete(record?.key)}
        />
      ),
    },
  ];

  return (
    <Table
      size="small"
      className={styles.table}
      bordered
      columns={columns}
      loading={!data?.data}
      dataSource={data?.data?.data}
      pagination={{
        total: data?.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.fee_id}
    />
  );
}
