import { Table, TableColumnsType, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useProducts } from "../api/getProducts";
import { IProduct } from "../types/index";
import { DeleteProduct } from "./DeleteProduct";
import UpdateProduct from "./UpdateProduct";

// const originData: any = [];

const { Text } = Typography;

export default function ListProductsTable(): JSX.Element {
  const { t } = useTranslation();

  // Set init params
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);

  const setTotalPage = useSetRecoilState(totalPageState);

  useEffect(() => {
    setTotalPage({
      total: 0,
      loading: true,
    });
  }, [searchContent, customer.value, userRecoil.user_id, setTotalPage]);

  const data = useProducts({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      tax_code: customer.tax_code,
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

  const columns: TableColumnsType<IProduct> = [
    {
      title: t("quan_ly_san_pham.table_main.stt"),
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
      title: t("quan_ly_san_pham.table_main.customer_name"),
      dataIndex: "customer_name",
      width: "15%",
      sorter: (a, b) => {
        const nameA = a.customer_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.customer_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_san_pham.table_main.ma_hs"),
      dataIndex: "hs_code",
      width: "7%",
      sorter: (a, b) => {
        const nameA = a.hs_code.toUpperCase(); // ignore upper and lowercase
        const nameB = b.hs_code.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (_: any, record: any) => <UpdateProduct product={record} />,
    },
    {
      title: t("quan_ly_san_pham.table_main.ma_sp"),
      dataIndex: "product_code",
      width: "10%",
      key: "product_code",
      sorter: (a, b) => {
        const nameA = a.product_code.toUpperCase(); // ignore upper and lowercase
        const nameB = b.product_code.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_san_pham.table_main.name_sp"),
      dataIndex: "product_name",
      width: "35%",
      sorter: (a, b) => {
        const nameA = a.product_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.product_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_san_pham.table_main.dvt"),
      dataIndex: "unit",
      width: "5%",
      sorter: (a, b) => {
        const nameA = a.unit.toUpperCase(); // ignore upper and lowercase
        const nameB = b.unit.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      // sortDirections: ["descend"],
      render: (text: any) => <Text>{text}</Text>,
    },
    {
      title: t("quan_ly_san_pham.table_main.action"),
      dataIndex: "action",
      width: "3%",
      key: "action",
      render: (_: any, record: any) => (
        <DeleteProduct
          product_id={record.product_id}
          product_name={record.product_name}
          // onClick={() => handleDelete(record?.key)}
        />
      ),
    },
  ];

  return (
    <Table
      size="small"
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
      rowKey={(record) => record.product_id}
    />
  );
}
