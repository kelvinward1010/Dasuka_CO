import { Col, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dataLackedMaterialState } from "@/store/action/atom";

import styles from "../../../style.module.scss";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import WoAkTable from "../tables/wo-ak-table";

const { Text } = Typography;
export default function WoAk(): JSX.Element {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);

  const [values, setValues] = useState({
    end: sanPham?.tcs?.["wo-ak"]?.end ?? 1,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex].tcs?.["wo-ak"]) {
        draftState[spIndex].tcs["wo-ak"] = {};
      }

      if (name === "end") {
        draftState[spIndex].tcs["wo-ak"].end =
          lackedMaterial === 0 ? value : -1;
        return;
      }
      draftState[spIndex].tcs["wo-ak"][name] = value;
    });
    setSanPhams(newSanPhams);
  };

  useEffect(() => {
    const check = (sanPham?.tcs?.["wo-ak"]?.end ?? 1) > -1;

    const newProducts = produce(sanPhams, (draft) => {
      const product = draft[spIndex];
      if (!product.tcs["wo-ak"]) {
        product.tcs["wo-ak"] = {};
      }

      product.tcs["wo-ak"].end = lackedMaterial === 0 ? (check ? 1 : -1) : -1;
    });

    setSanPhams(newProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={styles.top_others}>
        <WoAkTable />
      </div>
      <Row className={styles.top_others}>
        <Col span={3}>
          <Text strong>Kết luận</Text>
        </Col>
        <Col span={19} push={1}>
          <Radio.Group onChange={handleChange} name="end" value={values.end}>
            <Radio value={1}>
              <Text type="success" strong>
                {t("for_all.achieved").toUpperCase()} TIÊU CHÍ WO-AK
              </Text>
            </Radio>
            <Radio value={-1}>
              <Text type="danger" strong>
                {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ WO-AK
              </Text>
            </Radio>
          </Radio.Group>
        </Col>
      </Row>
    </div>
  );
}
