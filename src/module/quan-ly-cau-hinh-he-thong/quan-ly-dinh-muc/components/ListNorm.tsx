import { Table, TableColumnsType, Typography } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { getUserSelector } from "@/store/auth/state";
import { totalPageState } from "@/store/total/atom";

import { useNorms } from "../api/getNorms";
import { INorm } from "../types";
import { DeleteNorm } from "./DeleteNorm";
import { UpdateNorm } from "./UpdateNorm";

const columns: TableColumnsType<INorm> = [
  {
    title: "STT",
    align: "center",
    dataIndex: "RowNumber",
  },
  {
    title: "Tên định mức",
    dataIndex: "norm_name",
    key: "norm_name",
    render: (norm_name, record) => {
      return <UpdateNorm norm_id={record.norm_id} norm_name={norm_name} />;
    },
  },
  {
    title: "Thông tin khách hàng",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Thông tin sản phẩm",
    dataIndex: "product_code",
    key: "product_code",
    render: (_, record) => (
      <Typography.Text>{`${record.product_code} - ${record.product_name}`}</Typography.Text>
    ),
  },
  {
    title: "Action",
    align: "center",
    width: "5%",
    render: (_, record) => {
      return (
        <DeleteNorm norm_id={record.norm_id} norm_name={record.norm_name} />
      );
    },
  },
];

export function ListNorm(): JSX.Element {
  const customer = useRecoilValue(customerState);
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
  }, [searchContent, customer.value, userRecoil.user_id, setTotalPage]);

  const listNorms = useNorms({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
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

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      loading={!listNorms.data}
      dataSource={listNorms.data?.data}
      rowKey={(record) => record.norm_id}
      pagination={{
        total: listNorms.data?.totalItems,
        pageSize,
        current: pageIndex,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
    />
  );
}
