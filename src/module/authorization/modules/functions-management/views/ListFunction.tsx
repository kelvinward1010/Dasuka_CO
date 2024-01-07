import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "@/module/authorization/assets/styles/styles.module.scss";

import FunctionTable from "../components/FunctionTable";
import ActionTable from "../components/actions/ActionTable";

export function ListFunction(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="box-for-all">
      <div className={styles.head_qlsp}></div>
      <Row
        justify={"space-between"}
        className={styles.quan_ly_sp_head}
        gutter={16}
      >
        <Col span={16} className={styles.padding_none}>
          <Typography.Title
            level={3}
            style={{ marginBottom: 0, textTransform: "uppercase" }}
          >
            {t("authorization.functions.title")}
          </Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <div className={"content-table"}>
            <FunctionTable />
          </div>
        </Col>
        <Col span={18}>
          <div className="content-table">
            <ActionTable />
          </div>
        </Col>
      </Row>
    </div>
  );
}
