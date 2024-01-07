import { Table, TableColumnsType, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { staffState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useQLKHs } from "../api/getQLKHs";
import { ICustomer } from "../types";
import { DeleteQLKH } from "./DeleteQLKH";
import { UpdateQLKH } from "./UpdateQLKH";

export function ListQLKH(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const staff = useRecoilValue(staffState);
  const setTotalPage = useSetRecoilState(totalPageState);
  const userRecoil = useRecoilValue(getUserSelector);

  // Set up just call api only once
  const [enabled, setEnabled] = useState<boolean>(false);
  useEffect(() => {
    setEnabled(true);
  }, []);

  useEffect(() => {
    setTotalPage({
      total: 0,
      loading: true,
    });
  }, [searchContent, staff.value, userRecoil.user_id, setTotalPage]);

  const listQLKHs = useQLKHs({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      employee_id: staff.value,
      user_id: userRecoil.user_id,
    },
    config: {
      // keepPreviousData: true,
      enabled,
      onSuccess: (data) => {
        setTotalPage({
          total: data.totalItems,
          loading: false,
        });
      },
    },
  });
  const { t } = useTranslation();

  const columns: TableColumnsType<ICustomer> = [
    {
      title: t("authorization.users.table.stt"),
      width: 50,
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.customer_id"),
      dataIndex: "customer_id",
      width: "10%",
      key: "customer_id",
      render: (_, record) => {
        return <UpdateQLKH customer={record} />;
      },
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.customer_name"),
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.tax_code"),
      dataIndex: "tax_code",
      key: "tax_code",
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.phone_number"),
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("quan_ly_khach_hang.list_qlkh.action"),
      dataIndex: "",
      key: "",
      align: "center",
      width: "30px",
      render: (_, record) => {
        return (
          <DeleteQLKH
            customer_name={record.customer_name}
            customer_id={record.customer_id}
          />
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      loading={!listQLKHs.data}
      dataSource={listQLKHs.data?.data}
      pagination={{
        total: listQLKHs.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.customer_id}
    />
  );
}
