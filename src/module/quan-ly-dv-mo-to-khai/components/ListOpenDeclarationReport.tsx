import { Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState, staffState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useDeclarationReports } from "../api/getDeclarationReports";
import { OpenDeclarationReport } from "../types";
import { CreateSpecializedFeeService } from "./CreateSpecializedFeeService";
import { UpdateOpenDeclarationReport } from "./UpdateOpenDeclarationReport";

export function ListOpenDeclarationReport(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("search_content") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const status = searchParams.get("status") || "";
  const customer = useRecoilValue(customerState);
  const staff = useRecoilValue(staffState);
  const setTotalPage = useSetRecoilState(totalPageState);
  const userRecoil = useRecoilValue(getUserSelector);

  const { t } = useTranslation();

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
  }, [
    searchContent,
    fromDate,
    toDate,
    status,
    customer.value,
    userRecoil.user_id,
    setTotalPage,
  ]);

  const listOpenDeclarationReports = useDeclarationReports({
    params: {
      pageIndex,
      pageSize,
      status,
      search_content: searchContent,
      customer_id: customer?.value,
      employee_id: staff?.value,
      fr_date_of_declaration: fromDate,
      to_date_of_declaration: toDate,
      user_id: userRecoil.user_id,
    },
    config: {
      enabled,
      onSuccess: (data) => {
        setTotalPage({
          total: data.totalItems,
          loading: false,
        });
      },
    },
  });

  const columns: TableColumnsType<OpenDeclarationReport> = [
    {
      title: t("quan_ly_dv_mo_tk.table.stt"),
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.table.report_id"),
      dataIndex: "report_number",
      key: "report_number",
      width: "10%",
      render: (_, record) => {
        return <UpdateOpenDeclarationReport declarationService={record} />;
      },
    },
    {
      title: t("quan_ly_dv_mo_tk.table.date_of_declaration"),
      dataIndex: "date_of_declaration",
      key: "date_of_declaration",
      width: "5%",
      sorter: (a, b) => {
        const nameA = new Date(a.date_of_declaration).getTime(); // ignore upper and lowercase
        const nameB = new Date(b.date_of_declaration).getTime(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: t("quan_ly_dv_mo_tk.table.customer_name"),
      dataIndex: "customer_name",
      key: "customer_name",
      width: "15%",
      sorter: (a, b) => {
        const nameA = a.cd_type?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.cd_type?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.cd_type"),
      dataIndex: "cd_type",
      key: "cd_type",
      sorter: (a, b) => {
        const nameA = a.cd_type?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.cd_type?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.customs_stream"),
      dataIndex: "customs_stream",
      key: "customs_stream",
      sorter: (a, b) => {
        const nameA = a.customs_stream?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.customs_stream?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.bill_number"),
      dataIndex: "bill_number",
      key: "bill_number",
    },
    {
      title: t("quan_ly_dv_mo_tk.table.invoice_number"),
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: t("quan_ly_dv_mo_tk.table.shipping_terms"),
      dataIndex: "shipping_terms",
      key: "shipping_terms",
      sorter: (a, b) => {
        const nameA = a.shipping_terms?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.shipping_terms?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.gw"),
      dataIndex: "gw",
      key: "gw",
      sorter: (a, b) => {
        const nameA = a.gw?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.gw?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.pk"),
      dataIndex: "pk",
      key: "pk",
      sorter: (a, b) => {
        const nameA = a.pk?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.pk?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.import_export"),
      dataIndex: "import_export",
      key: "import_export",
      sorter: (a, b) => {
        const nameA = a.import_export?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.import_export?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.transportation_mode"),
      dataIndex: "transportation_mode",
      key: "transportation_mode",
      sorter: (a, b) => {
        const nameA = a.transportation_mode?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.transportation_mode?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
    },
    {
      title: t("quan_ly_dv_mo_tk.table.incurred_cost"),
      dataIndex: "incurred_cost",
      key: "incurred_cost",
      align: "right",
      width: "7%",
      render: (_, record) => (
        <Typography.Text>
          {record.incurred_cost
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.table.action"),
      align: "center",
      width: "5%",
      render: (_, record) => {
        return <CreateSpecializedFeeService openDeclarationReport={record} />;
      },
    },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      loading={!listOpenDeclarationReports.data}
      dataSource={listOpenDeclarationReports?.data?.data}
      pagination={{
        total: listOpenDeclarationReports?.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.report_id}
    />
  );
}
