import { Col, Input, Radio, Row, Typography } from "antd";
import produce from "immer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { dataLackedMaterialState } from "@/store/action/atom";
import { chooseFormCOState } from "@/store/choose/atom";
import { dataTb2LvcCT, dataTb3LvcCT } from "@/store/datanvl/state";
import { total2Lvc, total3Lvc } from "@/store/total/state";
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
import ChiPhiNguyenLieuTable from "../tables/lvc-1";
import ChiPhiPhanCongttTable from "../tables/lvc-2";
import ChiPhiPhanBottTable from "../tables/lvc-3";

const { Text } = Typography;

export default function Lvc({ percent }: { percent: number }) {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex, sanPham } = useRecoilValue(sanPhamSelector);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);
  const dataNVL = sanPham?.nguyen_lieu ?? [];
  const dataOtherFees = sanPham?.otherFees ?? [];
  const form = useRecoilValue(chooseFormCOState);
  // const valueTotal1: number = useRecoilValue(total1Lvc);
  const valueTotal2: number = useRecoilValue(total2Lvc);
  const valueTotal3: number = useRecoilValue(total3Lvc);

  const dataTb2: any[] = useRecoilValue(dataTb2LvcCT);
  const dataTb3: any[] = useRecoilValue(dataTb3LvcCT);

  const values = {
    tldg: sanPham?.tcs?.lvc?.tldg ?? percent,
    loi_nhuan: sanPham?.tcs?.lvc?.loi_nhuan ?? 0,
    other_value: sanPham?.tcs?.lvc?.other_value ?? 0,
    ct: sanPham?.tcs?.lvc?.ct ?? 1,
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
      if (!draftState[spIndex].tcs.lvc) {
        draftState[spIndex].tcs.lvc = {};
      }

      draftState[spIndex].tcs.lvc[name] = value;

      const totalEndTT = handEndDirect(
        fbotrongnuoc,
        valueTotal2,
        valueTotal3,
        name === "other_value" ? value : values.other_value,
        name === "loi_nhuan" ? value : values.loi_nhuan,
        draftState[spIndex]?.fob_value,
      );

      const totalEndGT = handEndIndirect(
        draftState[spIndex]?.fob_value,
        fbongoainuoc,
      );

      draftState[spIndex].tcs.lvc.end =
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
      if (!draftState[spIndex]?.tcs?.lvc) {
        draftState[spIndex].tcs.lvc = {};
      }

      draftState[spIndex].tcs.lvc[name] = value;

      const values = {
        tldg: draftState[spIndex]?.tcs?.lvc?.tldg ?? percent,
        loi_nhuan: draftState[spIndex]?.tcs?.lvc?.loi_nhuan ?? 0,
        other_value: draftState[spIndex]?.tcs?.lvc?.other_value ?? 0,
        ct: draftState[spIndex]?.tcs?.lvc?.ct ?? 1,
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

      draftState[spIndex].tcs.lvc.end =
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
    // const check = (sanPham?.tcs?.lvc?.end ?? 1) > -1;
    const check =
      ((
        sanPham?.tcs?.lvc?.ct === 1
          ? (sanPham?.tcs?.lvc?.tldg || percent) < Number(totalEndTT)
          : (sanPham?.tcs?.lvc?.tldg || percent) < Number(totalEndGT)
      )
        ? 1
        : -1) > -1;

    const newProducts = produce(sanPhams, (draft) => {
      const product = draft[spIndex];
      if (!product.tcs.lvc) {
        product.tcs.lvc = {};
      }

      product.tcs.lvc.end = lackedMaterial === 0 ? (check ? 1 : -1) : -1;
    });

    setSanPhams(newProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanPham]);

  useEffect(() => {
    const newSanPhams = produce(sanPhams, (draftState) => {
      if (!draftState[spIndex]?.tcs?.lvc) {
        draftState[spIndex].tcs.lvc = {};
      }
      const lvc = draftState[spIndex].tcs.lvc;

      lvc.table2 = dataTb2;
      lvc.table3 = dataTb3;
      lvc.total1 = fbongoainuoc;
      // lvc.total1 = valueTotal1;
      lvc.total2 = valueTotal2;
      lvc.total3 = valueTotal3;
      lvc.tldg = draftState[spIndex].tcs.lvc?.tldg || percent;
      lvc.end =
        lackedMaterial === 0
          ? (
              values.ct === 1
                ? values.tldg < Number(totalEndTT)
                : values.tldg < Number(totalEndGT)
            )
            ? 1
            : -1
          : -1;
      lvc.lvc_index = values.ct === 1 ? totalEndTT : totalEndGT;
    });

    setSanPhams(newSanPhams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.tldg, dataTb2, dataTb3]);

  // useEffect(() => {
  //   const newSanPhams = produce(sanPhams, (draftState) => {
  //     if (!draftState[spIndex].tcs.lvc) {
  //       draftState[spIndex].tcs.lvc = {};
  //     }

  //     const lvc = draftState[spIndex].tcs.lvc;
  //     lvc.total1 = fbongoainuoc;
  //     // lvc.total1 = valueTotal1;
  //     lvc.total2 = valueTotal2;
  //     lvc.total3 = valueTotal3;
  //     lvc.tldg = values.tldg;
  //     lvc.end = (
  //       values.ct === 1
  //         ? values.tldg < Number(totalEndTT)
  //         : values.tldg < Number(totalEndGT)
  //     )
  //       ? 1
  //       : -1;
  //   });
  //   setSanPhams(newSanPhams);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [values.tldg]);

  return (
    <div className="lvc">
      <div className="chi-phi-nguyen-lieu">
        <ChiPhiNguyenLieuTable />
      </div>
      <Row className={styles.top_lvc_rvc}>
        <Col span={12}>
          <ChiPhiPhanCongttTable dt={sanPham?.tcs?.lvc?.table2} />
        </Col>
        <Col span={11} push={1}>
          <ChiPhiPhanBottTable dt={sanPham?.tcs?.lvc?.table3} />
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
                      value={values?.loi_nhuan}
                      name="loi_nhuan"
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
                <Text strong>Chỉ số LVC</Text>
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
                          {decimalUSD2Number.format(sanPham?.fob_value ?? 0)}
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
                          {decimalUSD2Number.format(
                            sanPham?.fob_value ?? 0,
                          )} - {decimalUSD2Number.format(fbongoainuoc ?? 0)}
                        </span>
                        <div style={{ border: "1px solid black" }} />
                        {/* <span>{decimalUSD2Number.format(sumfbo ?? 0)}</span> */}
                        <span>
                          {decimalUSD2Number.format(sanPham?.fob_value ?? 0)}
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
                <Text strong>Tiêu chuẩn LVC (%)</Text>
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
                {(sanPham?.tcs?.lvc?.end ?? 1) > -1 ? (
                  <Text type="success" strong>
                    {t("for_all.achieved").toUpperCase()} TIÊU CHÍ LVC
                  </Text>
                ) : (
                  <Text type={"danger"} strong>
                    {t("for_all.not_achieved").toUpperCase()} TIÊU CHÍ LVC
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
