import { nanoid } from "@ant-design/pro-components";
import { Typography } from "antd";
import { TFunction } from "i18next";

import { handleCalculateUnitPrice } from "./sum-formula";

const { Text } = Typography;

export function customResultForm(
  kq: boolean,
  titleForm: string,
  t: TFunction<"translation", undefined, "translation">,
) {
  const key = nanoid();
  return (
    <>
      {kq ? (
        <>
          {titleForm}
          <Text type="success" strong key={key}>
            {t("for_all.achieved").toUpperCase()}
          </Text>
        </>
      ) : (
        <>
          {titleForm}
          <Text type="danger" strong key={key}>
            {t("for_all.not_achieved").toUpperCase()}
          </Text>
        </>
      )}
    </>
  );
}

export function checkResultForm(
  sanPhamSelected: any,
  materials: any[],
  sameNumber: number | string,
  chooseFormCo?: string,
) {
  if (!materials) return false;
  if (typeof sameNumber === "string") {
    sameNumber = sameNumber.toLowerCase();
    switch (sameNumber) {
      case "cc":
        sameNumber = 2;
        break;
      case "cth":
        sameNumber = 4;
        break;
      case "ctsh":
        sameNumber = 6;
        break;
      default:
        sameNumber = 0;
        break;
    }
  }
  if (sameNumber) {
    const hsProduct = sanPhamSelected.ma_hs?.substring(0, sameNumber);
    const c = materials.find((material) => {
      if (handleCalculateUnitPrice(material, chooseFormCo).isInLocal)
        return false;
      if (!material.hs_code) return false;
      return material.hs_code?.substring(0, sameNumber) === hsProduct;
    });
    return !c;
  }

  return true;
}

export function checkMaterialResultCTC(
  hsCode: any,
  sanPhamSelected: any,
  sameNumber: number | string,
  material: any,
  chooseFormCo: string,
) {
  if (handleCalculateUnitPrice(material, chooseFormCo).isInLocal) return false;
  if (!hsCode) return false;
  if (typeof sameNumber === "string") {
    sameNumber = sameNumber.toLowerCase();
    switch (sameNumber) {
      case "cc":
        sameNumber = 2;
        break;
      case "cth":
        sameNumber = 4;
        break;
      case "ctsh":
        sameNumber = 6;
        break;
      default:
        sameNumber = 0;
        break;
    }
  }
  if (sameNumber) {
    const hsProduct = sanPhamSelected.ma_hs?.substring(0, sameNumber);
    const c = hsCode?.substring(0, sameNumber) === hsProduct;

    return c;
  }

  return true;
}
