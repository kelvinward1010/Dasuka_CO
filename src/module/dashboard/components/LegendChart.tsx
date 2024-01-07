import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

import { color } from "../config/data";
import styles from "../style.module.scss";

export default function LegendChart({
  data,
  listColors = color.listThree,
}: any): JSX.Element {
  const { t } = useTranslation();

  return (
    <Row justify={"space-between"}>
      <Col span={16}>
        <div className={styles.legend}>
          {data?.map((item: any, index: number) => (
            <div key={index} className={styles.legend_item}>
              <div
                className={styles.legend_item_maker}
                style={{ backgroundColor: listColors[index] }}
              ></div>
              {t(`dashboard.material_status.${item.type}`)} ({item.value})
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}
