import { Col, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dataTbPECT } from "@/store/datanvl/state";

import styles from "../../../style.module.scss";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import PeTable from "../tables/pe-table";

const { Text } = Typography;
export default function Pe(): JSX.Element {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);

  const [values, setValues] = useState({
    end: sanPham?.tcs?.pe?.end ?? true,
  });

  const datatable: any[] = useRecoilValue(dataTbPECT);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex].tcs.pe) {
        draftState[spIndex].tcs.pe = {};
      }

      draftState[spIndex].tcs.pe[name] = value;
    });
    setSanPhams(newSanPhams);
  };

  useEffect(() => {
    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex].tcs.pe) {
        draftState[spIndex].tcs.pe = {};
      }
      draftState[spIndex].tcs.pe.table = datatable;
    });
    setSanPhams(newSanPhams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datatable]);

  return (
    <div>
      <div className={styles.top_others}>
        <PeTable />
      </div>
      <Row className={styles.top_others}>
        <Col span={3}>
          <Text strong>Kết luận</Text>
        </Col>
        <Col span={19} push={1}>
          <Radio.Group onChange={handleChange} name="end" value={values.end}>
            <Radio value={true}>
              <Text type="success" strong>
                {t("for_all.achieved").toUpperCase()} TIÊU CHÍ PE
              </Text>
            </Radio>
            <Radio value={false}>
              <Text type="danger" strong>
                {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ PE
              </Text>
            </Radio>
          </Radio.Group>
        </Col>
      </Row>
    </div>
  );
}
