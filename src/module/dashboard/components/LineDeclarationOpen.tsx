import { Col, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { getUserSelector } from "@/store/auth/state";

import { useGetDashboardDeclaration } from "../apis/getDashboardDeclaration";
import { IDashboardDeclaration } from "../types";
import LineChart from "./templates/LineChart";

export default function LineDeclarationOpen(): JSX.Element {
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [customer, setCustomer] = useState<string>();
  const userRecoil = useRecoilValue<any>(getUserSelector);

  const dashboardDeclaration = useGetDashboardDeclaration({
    params: {
      customer_id: customer,
    },
    config: {
      onSuccess: (data) => {
        if (data.success) {
          setCurrentData(getData(data.data));
        }
      },
    },
  });

  useEffect(() => {
    if (userRecoil.customers) {
      setCustomer(userRecoil?.customers?.[0]?.customer_id);
    }
  }, [userRecoil.customers]);

  // Map data from raw
  const mapData = (item: IDashboardDeclaration) => {
    const list =
      dayjs(item?.declaration_date).format("YYYY-MM-DD")?.split("-") || [];
    const date = {
      date: list?.[2],
      month: list?.[1],
      year: list?.[0],
    };

    let result = {
      ...date,
      quantity: Number(item.quantity),
    };

    return result;
  };

  const getData = (input: IDashboardDeclaration[]) => {
    const array = input.map((item) => mapData(item));

    const newArray = array.reduce((prev: any[], curr) => {
      let index = prev.findIndex(
        (item) => item.month === curr.month && item.year === curr.year,
      );
      if (index >= 0) {
        prev[index].quantity = prev[index].quantity + curr.quantity;
        return prev;
      }

      return [...prev, curr];
    }, []);

    return newArray;
  };

  return (
    <div>
      <Row justify={"end"}>
        <Select
          value={customer}
          options={userRecoil?.customers?.map((item: any) => ({
            label: item.customer_name,
            value: item.customer_id,
          }))}
          onChange={(e) => setCustomer(e)}
          style={{ width: 330, marginBottom: 10 }}
        ></Select>
      </Row>
      <Col span={24}>
        <LineChart
          data={currentData}
          loading={dashboardDeclaration.isLoading}
          max={500}
        />
      </Col>
    </div>
  );
}
