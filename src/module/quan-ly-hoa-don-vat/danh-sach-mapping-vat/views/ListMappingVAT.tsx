import { Col, Form, Input, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { AppFilter } from "@/components/AppFilter";

import { ListMappingVATTable } from "../components/ListMappingVATTable";
import styles from "../style.module.scss";

export function ListMappingVAT(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.page}>
      <AppFilter isCustomer />

      <div className={styles.container}>
        <Row
          justify={"space-between"}
          align={"middle"}
          className={styles.quan_ly_sp_head}
          gutter={16}
          style={{ paddingBottom: 16 }}
        >
          <Col span={6} className={styles.padding_none}>
            <Typography.Title
              level={3}
              style={{ margin: 0 }}
              className={`${styles.padding_none} ${styles.margin_none}`}
            >
              {t("quan_ly_vat.map.title")}
            </Typography.Title>
          </Col>
          <div style={{ flex: "1 1 0" }}>
            <Col span={24} className={styles.align_right}>
              <Form>
                <Row justify="end" align="middle" gutter={16}>
                  <Col span={8}>
                    <Input.Search
                      onSearch={handleSearch}
                      placeholder={
                        t("quan_ly_vat.map.search_placeholder") || ""
                      }
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </div>
          <Col className={styles.padding_l_1}>{/* <CreateVatInvoice /> */}</Col>
        </Row>
        <ListMappingVATTable />
      </div>
    </div>
  );
}
