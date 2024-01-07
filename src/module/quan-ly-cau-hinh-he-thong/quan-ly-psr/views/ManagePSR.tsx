import { Col, Input, Row, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { getTotalPageSelector } from "@/store/total/state";

import ListPSRTable from "../components/ListPSRTable";
import { UpdateModalPSR } from "../components/UpdateModalPSR";
import styles from "../style.module.scss";

export function ManagePSR(): JSX.Element {
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
      <div className={styles.head_qlsp}></div>
      <Row
        justify={"space-between"}
        className={styles.quan_ly_sp_head}
        gutter={16}
      >
        <Col span={16} className={styles.padding_none}>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {t("manage_psr.title_main")} (
            {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
          </Typography.Title>
        </Col>

        <div style={{ flex: "1 1 0" }}>
          <Col
            span={7}
            style={{ maxWidth: "400px", marginLeft: "auto" }}
            className={styles.padding_none}
          >
            <Input.Search
              onSearch={handleSearch}
              placeholder={t("manage_psr.search_placeholder") || ""}
            />
          </Col>
        </div>
        <Col className={styles.padding_l_1}>
          <UpdateModalPSR isCreate />
        </Col>
      </Row>
      <div className={"content-table"}>
        <ListPSRTable />
      </div>
    </div>
  );
}
