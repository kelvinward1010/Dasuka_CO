import { Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import ListDocumentCOStatus from "../components/ListDocumentCOStatus";
import StatisticDash from "../components/statistics/Statistic";
import styles from "../style.module.scss";

export function Dashboard(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="box-for-all">
      <div className={styles.head_qlsp}></div>
      <Row
        justify={"space-between"}
        className={styles.quan_ly_sp_head}
        gutter={16}
      >
        <Typography.Title
          level={3}
          className={styles.uppercase}
          style={{ marginBottom: 0, lineHeight: "22px" }}
        >
          {t("dashboard.title")}
        </Typography.Title>
      </Row>

      <StatisticDash />

      <ListDocumentCOStatus />
    </div>
  );
}
