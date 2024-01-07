import { Space, Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState, staffState } from "@/components/AppFilter/index.atom";
import { UpdateExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/UpdateExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";
import { getChiTietHoSoCOUrl } from "@/urls";

import { useCoDocuments } from "../api/getCoDocuments";
import { STATUS_DROPDOWN_TEXT_TYPE } from "../api/getDropdownStatus";
import { CancelCoDocument } from "./CancelCoDocument";
import { DeleteCoDocument } from "./DeleteCoDocument";
import { EditCoDocument } from "./EditCoDocument";
import { HistoryCoDocument } from "./HistoryCoDocument";

export function TableCoDocument(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const exact = searchParams.get("exact") || false;
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const status = searchParams.get("status") || "";
  const customer = useRecoilValue(customerState);
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
  }, [
    searchContent,
    fromDate,
    toDate,
    status,
    customer.value,
    userRecoil.user_id,
    setTotalPage,
  ]);

  const listCoDocument = useCoDocuments({
    params: {
      pageIndex,
      pageSize,
      status_id: status,
      search_content: searchContent,
      customer_id: customer.value,
      employee_id: staff.value,
      fr_created_date: fromDate,
      to_created_date: toDate,
      user_id: userRecoil.user_id,
      search_by_notify: !!exact,
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

  const columns: TableColumnsType<any> = [
    {
      title: t("quan_ly_hs_co.table_dshs.stt"),
      dataIndex: "RowNumber",
      align: "center",
      width: 50,
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: "Mã hồ sơ",
      dataIndex: "co_document_id",
      align: "center",
      width: 100,
    },
    {
      title: t("quan_ly_hs_co.table_dshs.form_co"),
      dataIndex: "form_name",
      width: 100,
      sorter: (a, b) => {
        const nameA = a.form_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.form_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("quan_ly_hs_co.table_dshs.date_hs"),
      dataIndex: "created_date",
      width: 100,
      sorter: (a, b) => {
        const nameA = new Date(a.created_date).getTime(); // ignore upper and lowercase
        const nameB = new Date(b.created_date).getTime(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (date) => (
        <Typography.Text>{dayjs(date).format("DD/MM/YYYY")}</Typography.Text>
      ),
    },
    {
      title: t("quan_ly_hs_co.table_dshs.staff"),
      dataIndex: "employee_name",
      width: 170,
      sorter: (a, b) => {
        const nameA = a.employee_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.employee_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("quan_ly_hs_co.table_dshs.number_tkx"),
      dataIndex: "number_tkx_with_shipping_terms",
      width: "20%",
      align: "left",
      render: (number_tkx_with_shipping_terms: any[]) =>
        _.compact(number_tkx_with_shipping_terms)?.map((tkx, index) => {
          const isLastItem =
            index === number_tkx_with_shipping_terms?.length - 1;

          return (
            <span key={tkx?.value}>
              <UpdateExportDeclaration
                exportDeclaration={
                  {
                    export_declaration_number: tkx?.label,
                    export_declaration_id: tkx?.value,
                    shipping_terms: tkx?.shipping_terms,
                  } as IExportDeclaration
                }
                isShowTerm={true}
              />{" "}
              {isLastItem ? "" : ", "}
            </span>
          );
        }),
    },
    {
      title: t("quan_ly_hs_co.table_dshs.invoice_number"),
      dataIndex: "number_tkx_with_shipping_terms",
      width: 200,
      align: "left",
      render: (number_tkx_with_shipping_terms: any[]) =>
        _.compact(number_tkx_with_shipping_terms)?.map((tkx, index) => {
          const isLastItem =
            index === number_tkx_with_shipping_terms?.length - 1;

          return (
            <span key={tkx?.value}>
              {tkx?.invoice_number}
              {isLastItem ? "" : ", "}
            </span>
          );
        }),
    },
    {
      title: t("quan_ly_hs_co.table_dshs.customer"),
      dataIndex: "customer_name",
    },
    {
      title: t("quan_ly_hs_co.table_dshs.status"),
      sorter: (a, b) => {
        const nameA = a.status_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.status_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, record) => (
        <Link to={getChiTietHoSoCOUrl(record.co_document_id)}>
          <Typography.Text
            strong
            type={STATUS_DROPDOWN_TEXT_TYPE[record.status_id]}
          >
            {record.status_name}
          </Typography.Text>
          {record.co_document_number && (
            <Typography.Text
              style={{ display: "block" }}
              type={STATUS_DROPDOWN_TEXT_TYPE[record.status_id]}
            >
              C/O no: {record.co_document_number}
            </Typography.Text>
          )}
        </Link>
      ),
    },
    {
      title: t("quan_ly_hs_co.table_dshs.action"),
      align: "center",
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <EditCoDocument record={record} />
            <HistoryCoDocument co_document_id={record?.co_document_id} />
            <CancelCoDocument record={record} />
            <DeleteCoDocument
              co_document_id={record?.co_document_id}
              status={record?.status_id}
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
      loading={!listCoDocument.data}
      dataSource={listCoDocument.data?.data}
      pagination={{
        total: listCoDocument.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.RowNumber}
    />
  );
}
