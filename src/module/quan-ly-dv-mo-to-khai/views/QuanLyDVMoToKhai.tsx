import { Col, DatePicker, Form, Input, Row, Spin, Typography } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { rangePresets } from "@/constant/antd";
import { getTotalPageSelector } from "@/store/total/state";

import { ListOpenDeclarationReport } from "../components/ListOpenDeclarationReport";
import styles from "./QuanLyDVMoToKhai.module.scss";

export function QuanLyDVMoToKhai(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  // const status = searchParams.get("status");
  const [searchContent, setSearchContent] = useState<string>(
    searchParams.get("searchContent") || "",
  );
  const totalPage = useRecoilValue(getTotalPageSelector);

  useEffect(() => {
    if (!fromDate)
      searchParams.set("fromDate", new Date().getFullYear() + "-01-01");
    if (!toDate)
      searchParams.set("toDate", dayjs(new Date()).format("YYYY-MM-DD"));
    setSearchParams(searchParams);
  }, []);

  const handleChangeDateTime: RangePickerProps["onChange"] = (e) => {
    searchParams.set("fromDate", e?.[0]?.format("YYYY-MM-DD") ?? "");
    searchParams.set("toDate", e?.[1]?.format("YYYY-MM-DD") ?? "");
    setSearchParams(searchParams);
  };

  const handleSearch = (value: string) => {
    searchParams.set("search_content", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.page}>
      <AppFilter isCustomer isStaff setSearchContent={setSearchContent} />

      <div className={styles.container}>
        <Row
          justify={"space-between"}
          align={"middle"}
          className={styles.head}
          gutter={16}
        >
          <Col span={7}>
            <Typography.Title level={3} className={styles.title}>
              {t("quan_ly_dv_mo_tk.title_main")} (
              {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
            </Typography.Title>
          </Col>
          <Col span={17} className={styles.align_right}>
            <Form>
              <Row justify="end" align="middle" gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.title_sl_time")}
                    className={styles.margin_none}
                  >
                    <DatePicker.RangePicker
                      style={{ width: "100%" }}
                      presets={rangePresets}
                      value={
                        fromDate && toDate
                          ? [
                              dayjs(fromDate, "YYYY-MM-DD"),
                              dayjs(toDate, "YYYY-MM-DD"),
                            ]
                          : null
                      }
                      onChange={handleChangeDateTime}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Input.Search
                    onSearch={handleSearch}
                    placeholder={t("quan_ly_dv_mo_tk.title_search") || ""}
                    value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <ListOpenDeclarationReport />
      </div>
    </div>
  );
}
