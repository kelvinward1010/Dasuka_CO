import { Table, TableColumnsType, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useUnits } from "../api/getUnits";
import { typeUnits } from "../config/data";
import styles from "../style.module.scss";
import { Unit } from "../types/index";
import { DeleteUnit } from "./DeleteUnit";
import UpdateUnitModal from "./UpdateUnit";

// const originData: any = [];

const { Text } = Typography;

export default function ListUnitsTable(): JSX.Element {
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

  const data = useUnits({
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

  const columns: TableColumnsType<Unit> = [
    {
      title: t("manage_unit.table.stt"),
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
      title: t("manage_unit.table.unit_id"),
      dataIndex: "unit_id",
      width: "10%",
      key: "unit_id",
      sorter: (a, b) => {
        const nameA = a.unit_id.toUpperCase(); // ignore upper and lowercase
        const nameB = b.unit_id.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (_, record) => {
        return <UpdateUnitModal unit={record} />;
      },
    },
    {
      title: t("manage_unit.table.unit_name"),
      dataIndex: "unit_name",
      width: "35%",
      sorter: (a, b) => {
        const nameA = a.unit_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.unit_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("manage_unit.table.note"),
      dataIndex: "note",
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("manage_unit.table.type"),
      dataIndex: "type",
      render: (text: any) => (
        <Text>{typeUnits.find((i) => i.value === text)?.label}</Text>
      ),
    },
    {
      title: t("manage_unit.table.action"),
      dataIndex: "action",
      width: "3%",
      key: "action",
      render: (_: any, record: any) => (
        <DeleteUnit
          unit_id={record.unit_id}
          unit_name={record.unit_name}
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
      rowKey={(record) => record.unit_id}
    />
  );
}
