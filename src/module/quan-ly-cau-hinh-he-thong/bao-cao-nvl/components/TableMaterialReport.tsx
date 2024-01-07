import { Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { isDoneCoState } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { UpdateExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/UpdateExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";
import { intlUSD } from "@/utils/intl";

import { useMaterialReports } from "../api/getMaterialReports";
import styles from "../style.module.scss";
import { IImportDeclaration } from "../types";

export function TableMaterialReport(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const customer = useRecoilValue(customerState);
  const setTotalPage = useSetRecoilState(totalPageState);
  const userRecoil = useRecoilValue(getUserSelector);
  const resetIsDoneCO = useResetRecoilState(isDoneCoState);
  const { t } = useTranslation();

  useEffect(() => {
    setTotalPage({
      total: 0,
      loading: true,
    });
  }, [
    searchContent,
    fromDate,
    toDate,
    customer.value,
    userRecoil.user_id,
    setTotalPage,
  ]);

  const ListImportDeclarations = useMaterialReports({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      from_date: fromDate,
      to_date: toDate,
      user_id: userRecoil.user_id,
      customer_id: customer.value,
    },
    config: {
      // keepPreviousData: true,
      onSuccess: (data) => {
        setTotalPage({
          loading: false,
          total: data.length || 0,
        });
        resetIsDoneCO();
      },
    },
  });

  const columns: TableColumnsType<any> = [
    {
      title: t("material_report.table.stt"),
      align: "center",
      dataIndex: "sort_order",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("material_report.table.code_name"),
      dataIndex: "material_name",
      width: "20%",
      render: (_, record) => (
        <Typography.Text>
          {record?.material_code + " / " + record?.material_name}
        </Typography.Text>
      ),
    },
    {
      title: t("material_report.table.open_balance"),
      dataIndex: "opening_balance",
      align: "right",
      width: 80,
      render: (value) => intlUSD.format(value || 0),
    },
    {
      title: t("material_report.table.import_during"),
      className: styles.table_import,
      dataIndex: "input_inventories",
      children: [
        {
          title: t("material_report.table.total"),
          className: styles.table_import,
          dataIndex: "input_total",
          align: "right",
          render: (value) => intlUSD.format(value || 0),
        },
        {
          title: t("material_report.table.time"),
          className: styles.table_import,
          dataIndex: "input_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <Typography.Text
                  key={index}
                  className="ant-table-cell"
                  style={{ margin: "5px 0" }}
                >
                  {item.time ? dayjs(item.time).format("DD/MM/YYYY") : ""}
                </Typography.Text>
              ))}
            </div>
          ),
        },
        {
          title: t("material_report.table.declaration"),
          className: styles.table_import,
          dataIndex: "input_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <div key={index} style={{ margin: "5px 0" }}>
                  <UpdateImportDeclaration
                    key={index}
                    importDeclaration={
                      {
                        import_declaration_number:
                          item.input_declaration_number,
                        import_declaration_id:
                          item?.input_declaration_number?.substring(0, 11),
                      } as IImportDeclaration
                    }
                  />
                  <Typography.Link>({item.quantity})</Typography.Link>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: t("material_report.table.export_during"),
      dataIndex: "output_inventories",
      className: styles.table_export,
      children: [
        {
          title: t("material_report.table.total"),
          className: styles.table_export,
          align: "right",
          dataIndex: "out_total",
          render: (value) => intlUSD.format(value || 0),
        },
        {
          title: t("material_report.table.time"),
          className: styles.table_export,
          dataIndex: "output_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <Typography.Text
                  key={index}
                  className="ant-table-cell"
                  style={{ margin: "5px 0" }}
                >
                  {item.time ? dayjs(item.time).format("DD/MM/YYYY") : ""}
                </Typography.Text>
              ))}
            </div>
          ),
        },
        {
          title: t("material_report.table.declaration"),
          className: styles.table_export,
          dataIndex: "output_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <div style={{ margin: "5px 0" }} key={index}>
                  <UpdateExportDeclaration
                    key={index}
                    exportDeclaration={
                      {
                        export_declaration_number:
                          item.export_declaration_number,
                        export_declaration_id:
                          item?.export_declaration_number?.substring(0, 11),
                      } as IExportDeclaration
                    }
                  />
                  <Typography.Link>({item.quantity})</Typography.Link>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: t("material_report.table.product"),
          className: styles.table_export,
          dataIndex: "output_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <Typography.Text
                  key={index}
                  className="ant-table-cell"
                  style={{ margin: "5px 0" }}
                >
                  {item.product_code} / {item.product_name}
                </Typography.Text>
              ))}
            </div>
          ),
        },
        {
          title: t("material_report.table.co_number"),
          className: styles.table_export,
          dataIndex: "output_inventories",
          render: (value) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {value?.map((item: any, index: number) => (
                <Typography.Text
                  className="ant-table-cell"
                  style={{ margin: "5px 0" }}
                  key={index}
                >
                  {item.co_document_number}
                </Typography.Text>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: t("material_report.table.end_balance"),
      className: styles.table_end_balance,
      align: "right",
      dataIndex: "ending_inventory",
      width: 80,
      render: (value) => intlUSD.format(value || 0),
    },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      loading={!ListImportDeclarations.data}
      dataSource={ListImportDeclarations.data}
      pagination={{
        total: ListImportDeclarations.data?.length,
        pageSize,
        current: pageIndex,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record, index) =>
        index + record.material_name + record.material_code
      }
    />
  );
}
