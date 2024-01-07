import {
  Button,
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
import { rangePresets } from "@/constant/antd";
import { exportExpectedLink } from "@/constant/links";
import { getTotalPageSelector } from "@/store/total/state";

import core_styles from "../../style.module.scss";
import { CreateExportExpected } from "../components/CreateExportExpected";
import { CreateExportExpectedExcel } from "../components/CreateExportExpectedExcel";
import { TableExportDeclaration } from "../components/TableExportExpected";
import { EXPORT_DECLARATION_STATUS } from "../types";
import styles from "./ListExportExpected.module.scss";

export function ListExportDeclarationExpected(): JSX.Element {
  const { t } = useTranslation();
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
          className={core_styles.quan_ly_sp_head}
          style={{ padding: 0, paddingBottom: 16 }}
          gutter={16}
        >
          <Col span={6} className={core_styles.padding_none}>
            <Typography.Title
              level={3}
              className={`${core_styles.padding_none} ${core_styles.margin_none}`}
            >
              {t("export_declaration.title_expected")} (
              {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
            </Typography.Title>
          </Col>
          <div style={{ flex: "1 1 0" }}>
            <Col
              span={24}
              className={styles.align_right}
              style={{ marginLeft: "auto" }}
            >
              <Form>
                <Row justify="end" align="middle" gutter={16}>
                  <Col span={9}>
                    <Form.Item
                      label="Thời gian"
                      className={core_styles.margin_none}
                    >
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
                    <Form.Item
                      label="Trạng thái"
                      className={core_styles.margin_none}
                    >
                      <Select
                        value={status}
                        placeholder={t("for_all.all") || ""}
                        options={EXPORT_DECLARATION_STATUS}
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
                      placeholder="Số tờ khai, Bill, Số invoice"
                      value={searchContent}
                      onChange={(e) => setSearchContent(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </div>

          <Col className={core_styles.padding_l_1}>
            <Button type="link" href={exportExpectedLink} target="_blank">
              Tải mẫu TKX dự kiến
            </Button>
          </Col>
          <Col className={core_styles.padding_l_1}>
            <CreateExportExpectedExcel />
          </Col>
          <Col className={core_styles.padding_l_1}>
            <CreateExportExpected />
          </Col>
        </Row>
        <TableExportDeclaration />
      </div>
    </div>
  );
}
