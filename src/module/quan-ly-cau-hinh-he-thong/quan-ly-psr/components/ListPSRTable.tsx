import { Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { usePSRs } from "../api/getPSRs";
import styles from "../style.module.scss";
import { IFormPSR } from "../types/index";
import { DeletePSR } from "./DeletePSR";
import { UpdateModalPSR } from "./UpdateModalPSR";

// const originData: any = [];

const { Text } = Typography;

export default function ListPSRTable(): JSX.Element {
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

  const data = usePSRs({
    params: {
      page_index: pageIndex,
      page_size: pageSize,
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

  const columns: TableColumnsType<IFormPSR> = [
    {
      title: t("manage_psr.table.stt"),
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
      title: t("manage_psr.table.name_form"),
      dataIndex: "co_form_id",
      width: "10%",
      key: "co_form_id",
      sorter: (a, b) => {
        const nameA = a.co_form_id.toUpperCase(); // ignore upper and lowercase
        const nameB = b.co_form_id.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (_, record) => {
        return <UpdateModalPSR id={record.co_form_id} isCreate={false} />;
      },
    },
    {
      title: t("manage_psr.table.number_document"),
      dataIndex: "number_legal_documents",
      width: "35%",
      sorter: (a, b) => {
        const nameA = a.number_legal_documents.toUpperCase(); // ignore upper and lowercase
        const nameB = b.number_legal_documents.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("manage_psr.table.user_update"),
      dataIndex: "last_update_user",
    },
    {
      title: t("manage_psr.table.time_update"),
      dataIndex: "last_update",
      width: 200,
      align: "center",
      render: (value) =>
        dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : "",
    },
    {
      title: t("manage_psr.table.action"),
      dataIndex: "action",
      width: "3%",
      key: "action",
      render: (_: any, record: IFormPSR) => (
        <DeletePSR
          id={record.co_form_id}
          number_legal_documents={record.number_legal_documents}
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
      rowKey={(record) => record.co_form_id}
    />
  );
}
