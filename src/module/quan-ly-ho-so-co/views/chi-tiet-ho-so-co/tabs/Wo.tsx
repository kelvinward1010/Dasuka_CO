import { Col, Form, Input, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dataLackedMaterialState } from "@/store/action/atom";

import styles from "../../../style.module.scss";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import { WoNonVat } from "../tables/wo-non-vat";
import WoTable from "../tables/wo-table";

const { Text } = Typography;
export default function Wo(): JSX.Element {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);

  const [values, setValues] = useState({
    end: sanPham?.tcs?.wo?.end ?? 1,
    exist_vat: !!sanPham?.tcs?.wo?.exist_vat,
    address: sanPham?.tcs?.wo?.address,
    name_kh: sanPham?.tcs?.wo?.name_kh,
    cmnd: sanPham?.tcs?.wo?.cmnd,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex].tcs.wo) {
        draftState[spIndex].tcs.wo = {};
      }

      if (name === "end") {
        draftState[spIndex].tcs["wo"].end = lackedMaterial === 0 ? value : -1;
        return;
      }
      draftState[spIndex].tcs.wo[name] = value;
    });
    setSanPhams(newSanPhams);
  };

  useEffect(() => {
    const check = (sanPham?.tcs?.["wo"]?.end ?? 1) > -1;

    const newProducts = produce(sanPhams, (draft) => {
      const product = draft[spIndex];
      if (!product.tcs["wo"]) {
        product.tcs["wo"] = {};
      }

      product.tcs["wo"].end = lackedMaterial === 0 ? (check ? 1 : -1) : -1;
    });

    setSanPhams(newProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Row>
        <Col span={12}>
          <Row>
            <Col span={8}>
              <Text strong>Hóa đơn VAT</Text>
            </Col>
            <Col span={8}>
              <Radio.Group
                onChange={handleChange}
                name="exist_vat"
                value={values?.exist_vat}
              >
                <Radio value={false}>
                  <Text strong>Không</Text>
                </Radio>
                <Radio value={true}>
                  <Text strong>Có</Text>
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          {!values.exist_vat && (
            <Form layout={"vertical"}>
              <Row justify={"space-between"}>
                <Col span={7}>
                  <Form.Item label="Địa chỉ nơi tổ chức thu mua">
                    <Input
                      type="text"
                      placeholder="Địa chỉ nơi tổ chức thu mua"
                      name="address_purchasing"
                      value={sanPham?.tcs?.wo?.address_purchasing}
                      onChange={handleChange}
                      onClick={(e: any) => e.target?.select?.()}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="Tên người phụ trách thu mua">
                    <Input
                      type="text"
                      placeholder="Tên người phụ trách thu mua"
                      name="person_purchasing"
                      value={sanPham?.tcs?.wo?.person_purchasing}
                      onChange={handleChange}
                      onClick={(e: any) => e.target?.select?.()}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="CMND">
                    <Input
                      placeholder="CMND"
                      name="identity_number"
                      value={sanPham?.tcs?.wo?.identity_number}
                      onChange={handleChange}
                      onClick={(e: any) => e.target?.select?.()}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </Col>
      </Row>
      <div className={styles.top_others}>
        {values.exist_vat ? <WoTable /> : <WoNonVat />}
      </div>
      <Row className={styles.top_others}>
        <Col span={3}>
          <Text strong>Kết luận</Text>
        </Col>
        <Col span={19} push={1}>
          <Radio.Group onChange={handleChange} name="end" value={values.end}>
            <Radio value={1}>
              <Text type="success" strong>
                {t("for_all.achieved").toUpperCase()} TIÊU CHÍ WO
              </Text>
            </Radio>
            <Radio value={-1}>
              <Text type="danger" strong>
                {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ WO
              </Text>
            </Radio>
          </Radio.Group>
        </Col>
      </Row>
    </div>
  );
}
