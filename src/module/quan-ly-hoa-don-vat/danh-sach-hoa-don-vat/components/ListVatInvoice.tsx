import { Table, TableColumnsType } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useVatInvoices } from "../api/getVatInvoices";
import { VatInvoice } from "../types";
import { DeleteVatInvoice } from "./DeleteVatInvoice";
import { UpdateVatInvoice } from "./UpdateVatInvoice";
import { FormVATuploaded } from "./UploadVatInvoiceForm";

export function ListVatInvoice(): JSX.Element {
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
  }, [searchContent, status, customer.value, userRecoil.user_id, setTotalPage]);

  const listVatInvoices = useVatInvoices({
    params: {
      pageIndex,
      pageSize,
      status,
      search_content: searchContent,
      customer_id: customer.value,
      fr_invoice_date: fromDate,
      to_invoice_date: toDate,
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

  const columns: TableColumnsType<VatInvoice> = [
    {
      title: "STT",
      align: "center",
      dataIndex: "RowNumber",
    },
    {
      title: "Số hóa đơn VAT",
      dataIndex: "vat_invoice_id",
      key: "vat_invoice_id",
      render: (_, record) => {
        return (
          <UpdateVatInvoice
            vatInvoiceId={record.vat_invoice_id}
            serialNumber={record.serial_number}
          />
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "invoice_date",
      align: "center",
      key: "invoice_date",
      sorter: (a, b) => {
        if (a.invoice_date && b.invoice_date) {
          const nameA = new Date(a.invoice_date).getTime(); // ignore upper and lowercase
          const nameB = new Date(b.invoice_date).getTime(); // ignore upper and lowercase
          if (nameA < nameB) return -1;

          if (nameA > nameB) return 1;
        }

        // names must be equal
        return 0;
      },
      render: (invoice_date) => dayjs(invoice_date).format("DD/MM/YYYY"),
    },
    {
      title: "Tên đơn vị mua hàng",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        const nameA = a.status?.toUpperCase() || ""; // ignore upper and lowercase
        const nameB = b.status?.toUpperCase() || ""; // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Tên file PDF",
      align: "center",
      key: "vat_invoice_id",
      width: "25%",
      render: (_, record) => {
        if (record.file_name) {
          return (
            <FormVATuploaded
              file_name={record.file_name}
              file_path={record.file_path || ""}
            />
          );
        }
      },
    },
    {
      title: "Action",
      align: "center",
      width: "5%",
      render: (_, record) => {
        return <DeleteVatInvoice vat_invoice={record} />;
      },
    },
  ];

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      loading={!listVatInvoices.data}
      dataSource={listVatInvoices.data?.data}
      pagination={{
        total: listVatInvoices.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.vat_invoice_id}
    />
  );
}
