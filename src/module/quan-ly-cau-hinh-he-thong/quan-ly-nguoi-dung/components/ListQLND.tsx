import { Table, TableColumnsType, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useQLNDs } from "../api/getQLNDs";
import { IEmployee } from "../types";
import { DeleteQLND } from "./DeleteQLND";
import { UpdateQLND } from "./UpdateQLND";

export function ListQLND(): JSX.Element {
  const { t } = useTranslation();
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

  const listQLNDs = useQLNDs({
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

  const columns: TableColumnsType<IEmployee> = [
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
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.title_code_kh"),
      dataIndex: "employee_id",
      key: "employee_id",
      width: "10%",
      render: (_, record) => {
        return <UpdateQLND employee={record} />;
      },
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.title_kh"),
      dataIndex: "fullname",
      key: "fullname",
      width: "13%",
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.phone_number"),
      dataIndex: "phone_number",
      key: "phone_number",
      width: "10%",
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.email"),
      dataIndex: "email",
      key: "email",
      width: "10%",
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.position_name"),
      dataIndex: "position_name",
      key: "position_name",
      width: "7%",
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.department_name"),
      dataIndex: "department_name",
      key: "department_name",
      width: "10%",
    },
    {
      title: t("quan_ly_nguoi_dung.list_qlnd_cpnt.employee_customer"),
      dataIndex: "employee_customer",
      key: "employee_customer",
      render: (_, record) => (
        <>
          {record?.employee_customer?.map((item: any, idx: any) => (
            <p key={idx}>{item?.customer_name}</p>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      align: "center",
      width: "30px",
      render: (_, record) => {
        return (
          <DeleteQLND
            fullname={record.fullname}
            employee_id={record.employee_id}
          />
        );
      },
    },
  ];

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      loading={listQLNDs.isLoading}
      dataSource={listQLNDs.data?.data}
      pagination={{
        total: listQLNDs.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.employee_id}
    />
  );
}
