import { Col, Input, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dataLackedMaterialState } from "@/store/action/atom";
import { chooseFormCOState } from "@/store/choose/atom";
import { dataTb2RvcCT, dataTb3RvcCT } from "@/store/datanvl/state";
import { total2Rvc, total3Rvc } from "@/store/total/state";
import { decimalUSD2Number } from "@/utils/intl";
import { containsOnlyNumbersAndDotAndComma } from "@/utils/magic-regexp";

import styles from "../../../style.module.scss";
import {
  handEndDirect,
  handEndIndirect,
  handleFBONgoaiNuoc,
  handleFBOTrongNuoc,
} from "../../config/sum-formula";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import ChiPhiNguyenLieuFromRvcTable from "../tables/rvc-1";
import ChiPhiPhanCongttTable from "../tables/rvc-2";
import ChiPhiPhanBottTable from "../tables/rvc-3";

const { Text } = Typography;

export default function Rvc({ percent }: { percent: number }) {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);
  const dataNVL = sanPham?.nguyen_lieu ?? [];
  const dataOtherFees = sanPham?.otherFees ?? [];
  const form = useRecoilValue(chooseFormCOState);
  // const valueTotal1: number = useRecoilValue(total1Rvc);
  const valueTotal2: number = useRecoilValue(total2Rvc);
  const valueTotal3: number = useRecoilValue(total3Rvc);

  const dataTb2: any[] = useRecoilValue(dataTb2RvcCT);
  const dataTb3: any[] = useRecoilValue(dataTb3RvcCT);

  const values = {
    end: sanPham?.tcs?.rvc?.end ?? 1,
    tldg: sanPham?.tcs?.rvc?.tldg ?? percent,
    loi_nhuan: sanPham?.tcs?.rvc?.loi_nhuan ?? 0,
    other_value: sanPham?.tcs?.rvc?.other_value ?? 0,
    ct: sanPham?.tcs?.rvc?.ct ?? 1,
  };

  const fbotrongnuoc: number = Number(handleFBOTrongNuoc(dataNVL, form));
  const fbongoainuoc: number = Number(
    handleFBONgoaiNuoc(dataNVL, dataOtherFees, form),
  );
  const sumChiPhiXuatXuong =
    Number(fbongoainuoc) + Number(valueTotal2) + Number(valueTotal3);
  // Number(valueTotal1) + Number(valueTotal2) + Number(valueTotal3);

  const sumfbo =
    Number(values?.loi_nhuan) +
    sumChiPhiXuatXuong +
    Number(values?.other_value);

  const totalEndTT = handEndDirect(
    fbotrongnuoc,
    valueTotal2,
    valueTotal3,
    values.other_value,
    values.loi_nhuan,
    // sumfbo,
    sanPham?.fob_value,
  );

  // const totalEndGT = handEndIndirect(sumfbo, fbongoainuoc);
  const totalEndGT = handEndIndirect(sanPham?.fob_value, fbongoainuoc);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (!containsOnlyNumbersAndDotAndComma(value)) return;
    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex].tcs.rvc) {
        draftState[spIndex].tcs.rvc = {};
      }

      draftState[spIndex].tcs.rvc[name] = value;

      const totalEndTT = handEndDirect(
        fbotrongnuoc,
        valueTotal2,
        valueTotal3,
        name === "other_value" ? value : values.other_value,
        name === "loi_nhuan" ? value : values.loi_nhuan,
        // sumfbo,
        draftState[spIndex].fob_value,
      );

      const totalEndGT = handEndIndirect(
        draftState[spIndex].fob_value,
        fbongoainuoc,
      );

      // lack != 0 always fail
      draftState[spIndex].tcs.rvc.end =
        lackedMaterial === 0
          ? (
              values.ct === 1
                ? values.tldg < Number(totalEndTT)
                : values.tldg < Number(totalEndGT)
            )
            ? 1
            : -1
          : -1;
    });
    setSanPhams(newSanPhams);
  };

  const handleChangeCt = (e: any) => {
    const { name, value } = e.target;
    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex]?.tcs?.rvc) {
        draftState[spIndex].tcs.rvc = {};
      }

      draftState[spIndex].tcs.rvc[name] = value;

      const values = {
        tldg: draftState[spIndex]?.tcs?.rvc?.tldg ?? percent,
        loi_nhuan: draftState[spIndex]?.tcs?.rvc?.loi_nhuan ?? 0,
        other_value: draftState[spIndex]?.tcs?.rvc?.other_value ?? 0,
        ct: draftState[spIndex]?.tcs?.rvc?.ct ?? 1,
      };

      const totalEndTT = handEndDirect(
        fbotrongnuoc,
        valueTotal2,
        valueTotal3,
        values.other_value,
        values.loi_nhuan,
        draftState[spIndex]?.fob_value,
      );

      const totalEndGT = handEndIndirect(
        draftState[spIndex]?.fob_value,
        fbongoainuoc,
      );

      // lack != 0 always fail
      draftState[spIndex].tcs.rvc.end =
        lackedMaterial === 0
          ? (
              values.ct === 1 // 1 is TT, 2 is GT
                ? values.tldg <= Number(totalEndTT)
                : values.tldg <= Number(totalEndGT)
            )
            ? 1
            : -1
          : -1;
    });

    setSanPhams(newSanPhams);
  };

  useEffect(() => {
    // const check = (sanPham?.tcs?.rvc?.end ?? 1) > -1;
    const check =
      ((
        sanPham?.tcs?.rvc?.ct === 1
          ? (sanPham?.tcs?.rvc?.tldg || percent) < Number(totalEndTT)
          : (sanPham?.tcs?.rvc?.tldg || percent) < Number(totalEndGT)
      )
        ? 1
        : -1) > -1;

    const newProducts = produce(sanPhams, (draft) => {
      const product = draft[spIndex];
      if (!product.tcs.rvc) {
        product.tcs.rvc = {};
      }

      // lack != 0 always fail
      product.tcs.rvc.end = lackedMaterial === 0 ? (check ? 1 : -1) : -1;
    });

    setSanPhams(newProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanPham]);

  useEffect(() => {
    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex]?.tcs?.rvc) {
        draftState[spIndex].tcs.rvc = {};
      }
      const rvc = draftState[spIndex].tcs.rvc;
      rvc.table2 = dataTb2;
      rvc.table3 = dataTb3;
      // rvc.total1 = valueTotal1;
      rvc.tldg = draftState[spIndex].tcs.rvc?.tldg || percent;
      rvc.total1 = fbongoainuoc;
      rvc.total2 = valueTotal2;
      rvc.total3 = valueTotal3;
      rvc.end =
        lackedMaterial === 0
          ? (
              values.ct === 1
                ? values.tldg < Number(totalEndTT)
                : values.tldg < Number(totalEndGT)
            )
            ? 1
            : -1
          : -1;
      rvc.rvc_index = values.ct === 1 ? totalEndTT : totalEndGT;
    });

    setSanPhams(newSanPhams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.tldg, dataTb2, dataTb3]);

  return (
    <div className="lvc">
      <div className="chi-phi-nguyen-lieu">
        <ChiPhiNguyenLieuFromRvcTable />
      </div>
      <Row className={styles.top_lvc_rvc}>
        <Col span={12}>
          <ChiPhiPhanCongttTable dt={sanPham?.tcs?.rvc?.table2} />
        </Col>
        <Col span={11} push={1}>
          <ChiPhiPhanBottTable dt={sanPham?.tcs?.rvc?.table3} />
        </Col>
      </Row>
      <div className={styles.lvc_end}>
        <Row justify={"space-between"}>
          <Col span={11}>
            <Row>
              <Col span={19}>
                <Row justify={"space-between"}>
                  <Col span={11}>
                    <Text strong>4.Chi phí xuất xưởng (USD)</Text>
                  </Col>
                  <Col span={10} push={1} style={{ textAlign: "right" }}>
                    <Text>
                      {decimalUSD2Number.format(sumChiPhiXuatXuong ?? 0)}
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col span={5} />
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={19}>
                <Row justify={"space-between"}>
                  <Col span={11}>
                    <Text strong>5.Lợi nhuận (USD)</Text>
                  </Col>
                  <Col span={10} push={1}>
                    <Input
                      style={{ width: "100%", textAlign: "right" }}
                      name="loi_nhuan"
                      value={values?.loi_nhuan}
                      onChange={handleChange}
                      onClick={(e: any) => e.target?.select?.()}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={5} />
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={19}>
                <Row justify={"space-between"}>
                  <Col span={11}>
                    <Text strong>6.Giá xuất xưởng (USD)</Text>
                  </Col>
                  <Col span={10} push={1} style={{ textAlign: "right" }}>
                    <Text>
                      {decimalUSD2Number.format(
                        (Number(values.loi_nhuan) ?? 0) +
                          (sumChiPhiXuatXuong ?? 0),
                      )}
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col span={5} />
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={19}>
                <Row justify={"space-between"}>
                  <Col span={11}>
                    <Text strong>7.Các chi phí khác (USD)</Text>
                  </Col>
                  <Col span={10} push={1}>
                    <Input
                      style={{ width: "100%", textAlign: "right" }}
                      onChange={handleChange}
                      value={values?.other_value}
                      name="other_value"
                      onClick={(e: any) => e.target?.select?.()}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={5} />
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={19}>
                <Row justify={"space-between"}>
                  <Col span={11}>
                    <Text strong>8.Trị giá FOB (USD)</Text>
                  </Col>
                  <Col span={10} push={1} style={{ textAlign: "right" }}>
                    <Text>{decimalUSD2Number.format(sumfbo ?? 0)}</Text>
                  </Col>
                </Row>
              </Col>
              <Col span={5} />
            </Row>
          </Col>
          <Col span={11}>
            <Row className={styles.top_lvc_rvc}>
              <Col span={7}>
                <Text strong>Sử dụng công thức tính</Text>
              </Col>
              <Col span={15} push={1}>
                <Radio.Group
                  onChange={handleChangeCt}
                  name="ct"
                  value={values.ct}
                >
                  <Radio value={1}>Trực tiếp</Radio>
                  <Radio value={2}>Gián tiếp</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={7}>
                <Text strong>Chỉ số RVC</Text>
              </Col>
              <Col span={15} push={1}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "flex-start",
                  }}
                >
                  {values.ct === 1 ? (
                    <>
                      <div style={{ width: "250px", textAlign: "center" }}>
                        <span>
                          {decimalUSD2Number.format(fbotrongnuoc ?? 0)} +{" "}
                          {decimalUSD2Number.format(valueTotal2 ?? 0)} +{" "}
                          {decimalUSD2Number.format(valueTotal3 ?? 0)} +{" "}
                          {decimalUSD2Number.format(values.other_value ?? 0)} +{" "}
                          {decimalUSD2Number.format(values.loi_nhuan ?? 0)}
                        </span>
                        <div style={{ border: "1px solid black" }} />
                        {/* <span>{decimalUSD2Number.format(sumfbo ?? 0)}</span> */}
                        <span>
                          {decimalUSD2Number.format(sanPham?.fob_value)}
                        </span>
                      </div>
                      <span>&nbsp;x 100 =</span>
                      <Text type={"success"}>
                        &nbsp;
                        {decimalUSD2Number.format(Number(totalEndTT) ?? 0)}%
                      </Text>
                    </>
                  ) : (
                    <>
                      <div style={{ width: "150px", textAlign: "center" }}>
                        <span>
                          {/* {decimalUSD2Number.format(sumfbo ?? 0)} -{" "} */}
                          {decimalUSD2Number.format(sanPham?.fob_value)} -{" "}
                          {decimalUSD2Number.format(fbongoainuoc ?? 0)}
                        </span>
                        <div style={{ border: "1px solid black" }} />
                        {/* <span>{decimalUSD2Number.format(sumfbo ?? 0)}</span> */}
                        <span>
                          {decimalUSD2Number.format(sanPham?.fob_value)}
                        </span>
                      </div>
                      <span>&nbsp;x 100 =</span>
                      <Text type={"success"}>
                        &nbsp;
                        {decimalUSD2Number.format(Number(totalEndGT) ?? 0)}%
                      </Text>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={7}>
                <Text strong>Tiêu chuẩn RVC (%)</Text>
              </Col>
              <Col span={15} push={1}>
                <Input
                  style={{ width: "200px", textAlign: "right" }}
                  onChange={handleChange}
                  name="tldg"
                  value={values.tldg}
                  onClick={(e: any) => e.target?.select?.()}
                />
              </Col>
            </Row>
            <Row className={styles.top_lvc_rvc}>
              <Col span={7}>
                <Text strong>Kết luận</Text>
              </Col>
              <Col span={15} push={1}>
                {(sanPham?.tcs?.rvc?.end ?? 1) > -1 ? (
                  <Text type="success" strong>
                    {t("for_all.achieved").toUpperCase()} TIÊU CHÍ RVC
                  </Text>
                ) : (
                  <Text type={"danger"} strong>
                    {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ RVC
                  </Text>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
