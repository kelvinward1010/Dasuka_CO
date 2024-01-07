import { Col, Input, Row, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { getTotalPageSelector } from "@/store/total/state";

import ListProductsTable from "../components/ListProductsTable";
import styles from "../style.module.scss";

export function QuanLySanPham() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPage = useRecoilValue(getTotalPageSelector);

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  return (
    <div className="box-for-all">
      <AppFilter isCustomer />
      <Row
        justify={"space-between"}
        className={styles.quan_ly_sp_head}
        gutter={16}
      >
        <Col span={16} className={styles.padding_none}>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {t("quan_ly_san_pham.title_main")} (
            {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
          </Typography.Title>
        </Col>

        <div style={{ flex: "1 1 0" }}>
          <Col
            span={7}
            style={{ maxWidth: "400px", marginLeft: "auto" }}
            className={styles.padding_none}
          >
            <Row justify={"center"} align={"middle"}>
              <Col span={24}>
                <Input.Search
                  onSearch={handleSearch}
                  placeholder={
                    t("quan_ly_san_pham.search_placeholder") || undefined
                  }
                />
              </Col>
            </Row>
          </Col>
        </div>
      </Row>
      <div className={"content-table"}>
        <ListProductsTable />
      </div>
    </div>
  );
}
