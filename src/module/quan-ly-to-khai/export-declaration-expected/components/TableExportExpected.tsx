import { Space, Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { DeleteDeclaration } from "../../import-declaration/components/DeleteDeclaration";
import { useExportExpectedS } from "../api/getExportExpectedS";
import { IExportDeclaration } from "../types";
import { UpdateExportDeclaration } from "./UpdateExportExpected";

export function TableExportDeclaration(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const status = searchParams.get("status") || "";
  const customer = useRecoilValue(customerState);
  const setTotalPage = useSetRecoilState(totalPageState);
  const userRecoil = useRecoilValue(getUserSelector);

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

  const ListExportDeclarations = useExportExpectedS({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      fr_date_of_declaration: fromDate,
      to_date_of_declaration: toDate,
      status,
      customer_id: customer.value,
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

  const columns: TableColumnsType<IExportDeclaration> = [
    {
      title: t("export_declaration.fields.serial"),
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("export_declaration.fields.id"),
      dataIndex: "export_declaration_number",
      width: "9%",
      sorter: (a, b) => {
        const nameA = a.export_declaration_number?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.export_declaration_number?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, record) => (
        <UpdateExportDeclaration exportDeclaration={record} />
      ),
    },
    {
      title: t("export_declaration.fields.date"),
      dataIndex: "date_of_declaration",
      sorter: (a, b) => {
        const nameA = new Date(a.date_of_declaration).getTime(); // ignore upper and lowercase
        const nameB = new Date(b.date_of_declaration).getTime(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: t("export_declaration.fields.bill"),
      dataIndex: "bill_number",
      sorter: (a, b) => {
        const nameA = a.bill_number?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.bill_number?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("export_declaration.fields.invoice_number"),
      dataIndex: "invoice_number",
      sorter: (a, b) => {
        const nameA = a.invoice_number?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.invoice_number?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("export_declaration.fields.exporter"),
      dataIndex: "customer_name",
      sorter: (a, b) => {
        const nameA = a.customer_id?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.customer_id?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("export_declaration.fields.importer"),
      dataIndex: "importer",
      sorter: (a, b) => {
        const nameA = a.importer?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.importer?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("export_declaration.fields.shipping_terms"),
      dataIndex: "shipping_terms",
      width: 180,
      align: "center",
    },
    {
      title: t("export_declaration.fields.status"),
      dataIndex: "status",
      sorter: (a, b) => {
        const nameA = a.status?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("export_declaration.fields.action"),
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <DeleteDeclaration
              declaration_id={record.export_declaration_id}
              co_used={record?.co_used}
              isExpected={true}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      loading={!ListExportDeclarations.data}
      dataSource={ListExportDeclarations.data?.data}
      pagination={{
        total: ListExportDeclarations.data?.totalItems,
        pageSize,
        current: pageIndex,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.export_declaration_id}
    />
  );
}
