import { Space, Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { isDoneCoState } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useImportDeclarations } from "../api/getImportDeclarations";
import { IImportDeclaration } from "../types";
import { DeleteDeclaration } from "./DeleteDeclaration";
import { UpdateImportDeclaration } from "./UpdateImportDeclaration";

export function TableImportDeclaration(): JSX.Element {
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
  const resetIsDoneCO = useResetRecoilState(isDoneCoState);

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

  const ListImportDeclarations = useImportDeclarations({
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
          loading: false,
          total: data.totalItems || 0,
        });
        resetIsDoneCO();
      },
    },
  });

  const columns: TableColumnsType<IImportDeclaration> = [
    {
      title: t("import_declaration.fields.serial"),
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.id"),
      dataIndex: "import_declaration_number",
      width: "9%",
      sorter: (a, b) => {
        const nameA = a.import_declaration_number?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.import_declaration_number?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, record) => (
        <UpdateImportDeclaration importDeclaration={record} />
      ),
    },
    {
      title: t("import_declaration.fields.date"),
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
      title: t("import_declaration.fields.bill"),
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
      title: t("import_declaration.fields.invoice_number"),
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
      title: t("import_declaration.fields.exporter"),
      dataIndex: "exporter",
      sorter: (a, b) => {
        const nameA = a.exporter?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.exporter?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("import_declaration.fields.importer"),
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
      title: t("import_declaration.fields.shipping_terms"),
      dataIndex: "shipping_terms",
      width: 180,
      align: "center",
    },
    {
      title: t("import_declaration.fields.status"),
      dataIndex: "status",
      sorter: (a, b) => {
        const nameA = a.status?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, record) => {
        return <Typography.Text>{record?.status}</Typography.Text>;
      },
    },
    {
      title: t("import_declaration.fields.action"),
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <DeleteDeclaration
              declaration_id={record.import_declaration_id}
              co_used={record?.co_used}
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
      loading={!ListImportDeclarations.data}
      dataSource={ListImportDeclarations.data?.data}
      pagination={{
        total: ListImportDeclarations.data?.totalItems,
        pageSize,
        current: pageIndex,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.import_declaration_id}
    />
  );
}
