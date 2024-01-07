import { Col, Form, Input, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { queryClient } from "@/lib/react-query";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { dataLackedMaterialState } from "@/store/action/atom";
import { chooseFormCOSelector } from "@/store/choose/state";
import { containsOnlyNumbersAndDotAndComma } from "@/utils/magic-regexp";

import styles from "../../../style.module.scss";
import { checkResultForm } from "../../config/result-form";
import {
  CongThucTinhTriGiaFBOCTC,
  CongThucTinhTrongLuongCTC,
} from "../../config/sum-formula";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import { CCTable } from "../tables/cc-table";
import { calculateTotalOfWeightCTC, isDoneCoDocument } from "../utils";

const { Text } = Typography;
export default function Cc(): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const coDocument = queryClient.getQueryData<ICoDocument>([
    "co-documents",
    id,
  ]);
  const isDone = isDoneCoDocument(coDocument?.status_id);

  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);
  const values = {
    end: sanPham?.tcs?.cc?.end ?? 1,
    is_deminimis: sanPham?.tcs?.cc?.is_deminimis ?? 0,
    deminimis: sanPham?.tcs?.cc?.deminimis ?? 1,
    value_none_xx:
      sanPham?.tcs?.cc?.value_none_xx ??
      calculateTotalOfWeightCTC(sanPham, 2, chooseFormCo),
    value_co_xx: sanPham?.tcs?.cc?.value_co_xx ?? 0,
    value_trong_luong_co_xx: sanPham?.tcs?.cc?.value_trong_luong_co_xx ?? 0,
    nguong_de_minimis: sanPham?.tcs?.cc?.nguong_de_minimis ?? 0,
  };
  // const resultCC = handleTotalChiPhiNguyenLieu(
  //   sanPham?.nguyen_lieu,
  //   sanPham?.otherFees,
  // );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (!containsOnlyNumbersAndDotAndComma(value)) return;
    const newSanPhams = produce(sanPhams, (draftState) => {
      const sanPham = draftState[spIndex];
      if (!sanPham.tcs.cc) {
        sanPham.tcs.cc = {};
      }

      sanPham.tcs.cc[name] = value;

      if (sanPham.tcs.cc.deminimis === 1) {
        const totalTrongLuong = CongThucTinhTrongLuongCTC(
          sanPham.tcs.cc.value_co_xx,
          sanPham.tcs.cc.value_trong_luong_co_xx,
        );
        sanPham.tcs.cc.ratio_deminimis = totalTrongLuong;
      } else if (sanPham.tcs.cc.deminimis === 2) {
        const totalFBO = CongThucTinhTriGiaFBOCTC(
          sanPham.tcs.cc.value_none_xx,
          sanPham?.fob_value,
        );
        sanPham.tcs.cc.ratio_deminimis = totalFBO;
      }

      if (name === "end" && value === 1) return;

      sanPham.tcs.cc.end = handleCalcEndCC(
        { ...values, [name]: value },
        sanPham?.fob_value,
      );
    });
    setSanPhams(newSanPhams);
  };

  useEffect(() => {
    const checkHS =
      lackedMaterial === 0 &&
      checkResultForm(sanPham, sanPham.nguyen_lieu, 2, chooseFormCo);
    const check =
      handleCalcEndCC(sanPham?.tcs?.cc, sanPham?.fob_value) === 0 ||
      (checkHS && lackedMaterial === 0);

    const newProducts = produce(sanPhams, (draft) => {
      const product = draft[spIndex];
      if (!product.tcs.cc) {
        product.tcs.cc = {};
      }

      product.tcs.cc.end = check ? 1 : -1;
      product.tcs.cc.is_deminimis = checkHS
        ? 0
        : sanPham?.nguyen_lieu?.length
        ? 1
        : 0;
    });

    setSanPhams(newProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lackedMaterial, sanPham]);

  const totalFBO = CongThucTinhTriGiaFBOCTC(
    values?.value_none_xx,
    sanPham?.fob_value,
  );

  const totalTrongLuong = CongThucTinhTrongLuongCTC(
    values?.value_co_xx,
    values?.value_trong_luong_co_xx,
  );

  return (
    <div>
      <div className={styles.ctc_top}>
        <CCTable />
      </div>
      {values?.end === 1 &&
      checkResultForm(sanPham, sanPham.nguyen_lieu, 2, chooseFormCo) &&
      lackedMaterial === 0 ? (
        <Row className={styles.ctc_top}>
          <Col span={4}>
            <Text strong>Kết luận</Text>
          </Col>
          <Col span={15} push={1}>
            {
              <Text type="success" strong>
                {t("for_all.achieved").toUpperCase()} TIÊU CHÍ CC
              </Text>
            }
          </Col>
        </Row>
      ) : sanPham?.nguyen_lieu?.length > 0 &&
        !checkResultForm(sanPham, sanPham.nguyen_lieu, 2, chooseFormCo) ? (
        <div className={styles.ctc_top}>
          <Row>
            <Col span={3}>
              <Text strong>De Minimis</Text>
            </Col>
            <Col span={19}>
              <Radio.Group
                onChange={handleChange}
                name="deminimis"
                value={values.deminimis}
                disabled={isDone}
              >
                <Radio value={1}>
                  <Text>Trọng lượng</Text>
                </Radio>
                <Radio value={2}>
                  <Text>Trị giá FOB</Text>
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
          <div>
            <Form initialValues={values} disabled={isDone}>
              {values.deminimis === 1 && (
                <>
                  <Row className={styles.ctc_top}>
                    <Col span={9}>
                      <Text strong>
                        Tổng trọng lượng các NL không có xuất xứ và không đáp
                        ứng tiêu chí CC
                      </Text>
                    </Col>
                    <Col span={10} push={1}>
                      <Form.Item
                        // name="value_co_xx"
                        rules={[
                          {
                            required: true,
                            message:
                              "Tổng trọng lượng các NL không có xuất xứ và không đáp ứng tiêu chí CC không được bỏ trống và phải là số",
                          },
                        ]}
                      >
                        <Input
                          className={styles.ctc_input}
                          onChange={handleChange}
                          name="value_co_xx"
                          value={values.value_co_xx}
                          onClick={(e: any) => e.target?.select?.()}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles.ctc_top}>
                    <Col span={9}>
                      <Text strong>Tổng trọng lượng của thành phẩm</Text>
                    </Col>
                    <Col span={10} push={1}>
                      <Form.Item
                        // name="value_trong_luong_co_xx"
                        rules={[
                          {
                            required: true,
                            message:
                              "Tổng trọng lượng của thành phẩm không được bỏ trống và phải là số",
                          },
                        ]}
                      >
                        <Input
                          className={styles.ctc_input}
                          onChange={handleChange}
                          name="value_trong_luong_co_xx"
                          value={values.value_trong_luong_co_xx}
                          onClick={(e: any) => e.target?.select?.()}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {values.deminimis === 2 && (
                <Row className={styles.ctc_top}>
                  <Col span={9}>
                    <Text strong>
                      Tổng trị giá các NL không có xuất xứ và không đáp ứng tiêu
                      chí CC
                    </Text>
                  </Col>
                  <Col span={10} push={1}>
                    <Form.Item
                      // name="value_none_xx"
                      rules={[
                        {
                          required: true,
                          message:
                            "Tổng trị giá các NL không có xuất xứ và không đáp ứng tiêu chí CC không được bỏ trống và phải là số",
                        },
                      ]}
                    >
                      <Input
                        className={styles.ctc_input}
                        onChange={handleChange}
                        name="value_none_xx"
                        value={values.value_none_xx}
                        onClick={(e: any) => e.target?.select?.()}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Form>
          </div>
          <Row className={styles.ctc_top}>
            <Col span={4}>
              <Text strong>Tỷ lệ De Minimis</Text>
            </Col>
            <Col span={15} push={1}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignContent: "flex-start",
                }}
              >
                <div style={{ width: "550px", textAlign: "center" }}>
                  {values.deminimis === 2 && (
                    <span>
                      Tổng trị giá của các nguyên liệu không có xuất xứ và không
                      đáp ứng tiêu chí CC
                    </span>
                  )}
                  {values.deminimis === 1 && (
                    <span>
                      Tổng trọng lượng của các nguyên liệu không có xuất xứ và
                      không đáp ứng tiêu chí CC
                    </span>
                  )}
                  <div style={{ border: "1px solid black" }} />
                  {values.deminimis === 2 && (
                    <Typography.Text
                      type={sanPham?.fob_value ? undefined : "danger"}
                    >
                      Trị giá FOB của thành phẩm{" "}
                      {sanPham?.fob_value
                        ? `(${sanPham?.fob_value})`
                        : `(Chưa có giá FOB)`}
                    </Typography.Text>
                  )}
                  {values.deminimis === 1 && (
                    <span>Tổng trọng lượng của thành phẩm</span>
                  )}
                </div>
                <span>&nbsp;x 100 =</span>
                {values.deminimis === 2 && (
                  <Text type={"success"}>&nbsp;{totalFBO} %</Text>
                )}
                {values.deminimis === 1 && (
                  <Text type={"success"}>&nbsp;{totalTrongLuong} %</Text>
                )}
              </div>
            </Col>
          </Row>
          <Row className={styles.ctc_top}>
            <Col span={9}>
              <Text strong>Ngưỡng De Minimis (%)</Text>
            </Col>
            <Col span={10} push={1}>
              <Form initialValues={values} disabled={isDone}>
                <Form.Item
                  // name="nguong_de_minimis"
                  rules={[
                    {
                      required: true,
                      message:
                        "Ngưỡng De Minimis không được bỏ trống và phải là số",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "30%", textAlign: "right" }}
                    onChange={handleChange}
                    name="nguong_de_minimis"
                    value={values.nguong_de_minimis}
                    onClick={(e: any) => e.target?.select?.()}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row className={styles.ctc_top}>
            <Col span={4}>
              <Text strong>Kết luận</Text>
            </Col>
            <Col span={15} push={1}>
              {handleCalcEndCC(values, sanPham?.fob_value) === 0 ? (
                <Text type="success" strong>
                  {t("for_all.achieved").toUpperCase()} TIÊU CHÍ CC + De Minimis{" "}
                  {values.nguong_de_minimis}%
                </Text>
              ) : (
                <Text type={"danger"} strong>
                  {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ CC + De
                  Minimis {values.nguong_de_minimis}%
                </Text>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <Row className={styles.ctc_top}>
          <Col span={4}>
            <Text strong>Kết luận</Text>
          </Col>
          <Col span={15} push={1}>
            {
              <Text type="danger" strong>
                {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ CC
              </Text>
            }
          </Col>
        </Row>
      )}
    </div>
  );
}

export function handleCalcEndCC(values: any, result: any) {
  const totalFBO = CongThucTinhTriGiaFBOCTC(values?.value_none_xx || 0, result);
  const totalTrongLuong = CongThucTinhTrongLuongCTC(
    values?.value_co_xx || 0,
    values?.value_trong_luong_co_xx,
  );

  const isBelowThreshold =
    (values?.deminimis || 1) === 1
      ? values?.nguong_de_minimis > Number(totalTrongLuong)
      : values?.nguong_de_minimis > Number(totalFBO);

  return isBelowThreshold ? 0 : -1;
}
