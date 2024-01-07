import { Col, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { ACCESSES, checkAccess } from "@/lib/access";
import { useDropdownQLND } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung/api/getDropdownQLND";
import { useQLNDLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung/api/getQlND";
import { getUserSelector } from "@/store/auth/state";
import { IBaseDropdown } from "@/types";

import { useGetDashboardCoDocument } from "../apis/getDashboardCoDocument";
import { listCODocuments } from "../config/data";
import { IDashboardCO, IDashboardCODetail } from "../types";
import LegendLineChart from "./LegendLineChart";
import LineChart from "./templates/LineChart";

export default function LineCOStatus(): JSX.Element {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [staffOptions, setStaffOptions] = useState<IBaseDropdown>([]);
  const [customerOptions, setCustomerOptions] = useState<IBaseDropdown>([]);
  const [currentData, setCurrentData] = useState<any[]>(listCODocuments || []);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userRecoil = useRecoilValue(getUserSelector);

  useDropdownQLND({
    config: {
      onSuccess: (data) => {
        if (data && data.length > 0) setStaffOptions(data);
      },
    },
  });

  const getStaffLazy = useQLNDLazy({});

  const dataCO = useGetDashboardCoDocument({
    params: {
      employee_id: staff,
      customer_id: customer ? customer : null,
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
    if (staffOptions.length > 0 && userRecoil) {
      setStaff(userRecoil.user_name);
    }
  }, [staffOptions, userRecoil]);

  useEffect(() => {
    if (userRecoil.user_name) {
      getStaffLazy.mutateAsync({ id: userRecoil.user_name }).then((data) => {
        setCustomerOptions([
          { label: t("for_all.all"), value: "" },
          ...data.employee_customer?.map((customer) => ({
            label: customer.customer_name,
            value: customer.customer_id,
          })),
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRecoil.user_name]);

  // Set loading
  useEffect(() => {
    if (!dataCO?.data?.data) setIsLoading(true);
    else setIsLoading(false);
  }, [dataCO?.data?.data]);

  // Set new customer options when change staff
  const handleChangeStaff = async (value: string) => {
    setStaff(value);

    const customers =
      (await getStaffLazy.mutateAsync({ id: value })).employee_customer || [];

    setCustomerOptions([
      { label: t("for_all.all"), value: "" },
      ...customers.map((customer) => ({
        label: customer.customer_name,
        value: customer.customer_id,
      })),
    ]);
  };

  // Map data from raw
  const mapData = (tag: string, item: IDashboardCODetail) => {
    const list =
      dayjs(item?.created_date).format("YYYY-MM-DD")?.split("-") || [];
    const date = {
      date: list?.[2],
      month: list?.[1],
      year: list?.[0],
    };

    let result = {
      key: tag,
      category: t("dashboard.document_co." + tag),
      ...date,
      quantity: Number(item.quantity),
    };

    return result;
  };

  // Flatten data to using
  const getData = (input: IDashboardCO) => {
    if (input) {
      const array = [
        ...input.complete_co.map((item) => mapData("done", item)),
        ...input.processing_co.map((item) => mapData("edited", item)),
        ...input.canceled_co.map((item) => mapData("canceled", item)),
      ];

      const newArray = array.reduce((prev: any[], curr) => {
        let index = prev.findIndex(
          (item) =>
            item.month === curr.month &&
            item.year === curr.year &&
            item.key === curr.key,
        );
        if (index >= 0) {
          prev[index].quantity = prev[index].quantity + curr.quantity;
          return prev;
        }

        return [...prev, curr];
      }, []);

      return newArray;
    }

    return [];
  };

  return (
    <div>
      <Row
        justify={"space-between"}
        align={"middle"}
        style={{ marginBottom: 10 }}
      >
        <Col>
          <LegendLineChart data={currentData} />
        </Col>
        <Col>
          <Select
            value={customer}
            options={customerOptions}
            onChange={(e) => setCustomer(e)}
            style={{ width: 330, marginRight: 10 }}
            showSearch
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          {checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN) && (
            <Select
              value={staff}
              options={staffOptions}
              onChange={handleChangeStaff}
              style={{ width: 145 }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          )}
        </Col>
      </Row>
      <Col span={24}>
        <LineChart
          data={currentData}
          isLegend={false}
          isColor={true}
          isMulti={true}
          loading={isLoading}
          max={100}
        />
      </Col>
    </div>
  );
}
