import { Col, Row } from "antd";
import { useEffect, useState } from "react";

import { color } from "../config/data";
import styles from "../style.module.scss";

export default function LegendLineChart({ data }: any): JSX.Element {
  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    if (data) {
      const tempResult: any = {};
      for (let { category, key } of data)
        tempResult[key] = {
          category,
          key,
          count: tempResult[category] ? tempResult[category].count + 1 : 1,
        };

      setFilteredData(tempResult);
    }
  }, [data]);

  return (
    <Row justify={"space-between"}>
      <Col span={24}>
        <div className={styles.legend_horizontal}>
          {Object.values(filteredData)?.map((item: any) => (
            <div key={item?.key} className={styles.legend_horizontal_item}>
              <div
                className={styles.legend_item_maker}
                style={{
                  backgroundColor:
                    color.listColors[
                      item?.key as keyof typeof color.listColors
                    ],
                }}
              ></div>
              {item?.category}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}
