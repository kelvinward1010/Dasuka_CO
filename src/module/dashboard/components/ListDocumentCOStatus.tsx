import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "../style.module.scss";
import LineCOStatus from "./LineCOStatus";
import LineDeclarationOpen from "./LineDeclarationOpen";

export default function ListDocumentCOStatus(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Row gutter={16} style={{ margin: 0 }}>
      <Col span={12} style={{ paddingRight: 6, paddingLeft: 20 }}>
        <div className={styles.container_card}>
          <Row>
            <Typography.Text
              className={`${styles.uppercase} ${styles.container_card_header}`}
            >
              {t("dashboard.document_co.title")}
            </Typography.Text>
          </Row>
          <Row
            gutter={16}
            className={styles.container_card_content}
            style={{ margin: 0 }}
          >
            <Col span={24}>
              <LineCOStatus />
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={12} style={{ paddingRight: 20, paddingLeft: 6 }}>
        <div className={styles.container_card}>
          <Row>
            <Typography.Text
              className={`${styles.uppercase} ${styles.container_card_header}`}
            >
              {t("dashboard.declaration.title")}
            </Typography.Text>
          </Row>
          <Row
            gutter={16}
            className={styles.container_card_content}
            style={{ margin: 0 }}
          >
            <Col span={24}>
              <LineDeclarationOpen />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
