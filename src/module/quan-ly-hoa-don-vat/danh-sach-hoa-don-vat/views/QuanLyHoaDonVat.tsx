import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Spin,
  Typography,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { customerState } from "@/components/AppFilter/index.atom";
import { rangePresets } from "@/constant/antd";
import { ExportMaterialReport } from "@/module/quan-ly-cau-hinh-he-thong/bao-cao-nvl/components/ExportMaterialReport";
import { getTotalPageSelector } from "@/store/total/state";

import { CreateVatInvoice } from "../components/CreateVatInvoice";
import { ListVatInvoice } from "../components/ListVatInvoice";
import { VAT_INVOICE_STATUS } from "../types";
import styles from "./QuanLyHoaDonVat.module.scss";

export function QuanLyHoaDonVat(): JSX.Element {
  const { t } = useTranslation();
  const customer = useRecoilValue(customerState);
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const status = searchParams.get("status");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDateTime: RangePickerProps["onChange"] = (e) => {
    searchParams.set("fromDate", e?.[0]?.format("YYYY-MM-DD") ?? "");
    searchParams.set("toDate", e?.[1]?.format("YYYY-MM-DD") ?? "");
    setSearchParams(searchParams);
  };

  const handleChangeStatus: SelectProps["onChange"] = (e) => {
    searchParams.set("status", e);
    setSearchParams(searchParams);
  };

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
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
          className={styles.quan_ly_sp_head}
          gutter={16}
          style={{ paddingBottom: 16 }}
        >
          <Col span={8} className={styles.padding_none}>
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              className={`${styles.padding_none} ${styles.margin_none}`}
            >
              {t("quan_ly_vat.title_main")} (
              {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
            </Typography.Title>
          </Col>
          <div style={{ flex: "1 1 0" }}>
            <Col span={24} className={styles.align_right}>
              <Form>
                <Row justify="end" align="middle" gutter={16}>
                  <Col span={9}>
                    <Form.Item label="Thời gian" style={{ marginBottom: 0 }}>
                      <DatePicker.RangePicker
                        presets={rangePresets}
                        style={{ width: "100%" }}
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
                  <Col span={7}>
                    <Form.Item label="Trạng thái" style={{ marginBottom: 0 }}>
                      <Select
                        value={Number(status)}
                        placeholder={t("for_all.all") || ""}
                        options={VAT_INVOICE_STATUS}
                        onChange={handleChangeStatus}
                        showSearch
                        filterOption={(input: any, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Input.Search
                      onSearch={handleSearch}
                      placeholder="Số hóa đơn VAT"
                      value={searchContent}
                      onChange={(e) => setSearchContent(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </div>
          <Col className={styles.padding_l_1}>
            <CreateVatInvoice />
          </Col>
          <Col className={styles.padding_l_1} style={{ paddingLeft: 0 }}>
            <ExportMaterialReport
              dataPost={{
                from_date: fromDate || "",
                to_date: toDate || "",
                customer_id: customer.value,
                customer_name: customer.label,
                status: status || 0,
                search_content: searchContent,
                type: "vat",
              }}
            />
          </Col>
        </Row>
        <ListVatInvoice />
      </div>
    </div>
  );
}
