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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { customerState, staffState } from "@/components/AppFilter/index.atom";
import { rangePresets } from "@/constant/antd";
import { getTotalPageSelector } from "@/store/total/state";
import { themMoiHoSoCOUrl } from "@/urls";

import { useDropdownStatus } from "../api/getDropdownStatus";
import ListCancelDeclaration from "../components/ListCancelDeclaration";
import { TableCoDocument } from "../components/TableCoDocument";
import core_styles from "../style.module.scss";
import styles from "./CoDocument.module.scss";

export function ListCoDocument(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const staff = useRecoilValue(staffState);
  const customer = useRecoilValue(customerState);
  const [searchParams, setSearchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const exact = searchParams.get("exact");
  const status = searchParams.get("status");
  const [searchContent, setSearchContent] = useState<string>(
    searchParams.get("searchContent") || "",
  );
  const totalPage = useRecoilValue(getTotalPageSelector);

  const { data: dropdownStatus } = useDropdownStatus({});

  useEffect(() => {
    if (!exact) {
      if (!fromDate)
        searchParams.set("fromDate", new Date().getFullYear() + "-01-01");
      if (!toDate)
        searchParams.set("toDate", dayjs(new Date()).format("YYYY-MM-DD"));
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDateTime: RangePickerProps["onChange"] = (e) => {
    searchParams.set("fromDate", e?.[0]?.format("YYYY-MM-DD") ?? "");
    searchParams.set("toDate", e?.[1]?.format("YYYY-MM-DD") ?? "");
    setSearchParams(searchParams);
  };

  const handleChangeStatus: SelectProps["onChange"] = (e) => {
    e ? searchParams.set("status", e) : searchParams.delete("status");
    setSearchParams(searchParams);
  };

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  const handleNavigateCreate = () => {
    navigate(themMoiHoSoCOUrl);
  };

  return (
    <>
      <AppFilter
        isCustomer
        isStaff
        setSearchContent={setSearchContent}
        exact={!!exact}
      />

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
              {t("quan_ly_hs_co.title_main")} (
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
                  <Col span={8} style={{ marginLeft: "auto" }}>
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
                  <Col span={6}>
                    <Form.Item
                      label="Trạng thái"
                      className={core_styles.margin_none}
                    >
                      <Select
                        allowClear
                        value={status}
                        placeholder={t("for_all.all") || ""}
                        options={dropdownStatus}
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
                      placeholder="Số tờ khai xuất"
                      value={searchContent}
                      onChange={(e) => setSearchContent(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </div>
          <Col className={core_styles.padding_l_1}>
            <Button
              className={`${core_styles.button} ${core_styles.button_create}`}
              disabled={staff.value === "" || customer.value === ""}
              onClick={handleNavigateCreate}
              type="primary"
            >
              {t("for_all.button_create")}
            </Button>
          </Col>
          <Col className={core_styles.padding_l_1}>
            <ListCancelDeclaration />
          </Col>
        </Row>

        <TableCoDocument />
      </div>
    </>
  );
}
