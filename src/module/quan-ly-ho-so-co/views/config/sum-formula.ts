import _, { meanBy, round } from "lodash";

import { formatOnlyNumber } from "@/utils/format";
import { decimalUSD } from "@/utils/intl";

import { checkEndowCO, checkIsFBOInVN } from "../chi-tiet-ho-so-co/utils";

export const handleCalculateUnitPrice = (material: any, chooseFormCo: any) => {
  const values = material?.norm_vat_invoice_import_declaration
    ?.filter((detail: any) => detail.usd_exchange_rate && detail.unit_price_cif)
    ?.map(
      (detail: any) =>
        Number(detail?.unit_price_cif || 0) /
          detail.usd_exchange_rate /
          detail?.conversion_factor || 1,
    );
  const arithmeticMeanCif = _.meanBy(values || [0]);

  // Check endow CO
  let checkEndow = false;
  material?.norm_vat_invoice_import_declaration?.forEach((item: any) => {
    checkEndow = checkEndowCO(
      item,
      material?.norm_vat_invoice_import_declaration,
      chooseFormCo,
    );
    if (checkEndow) return;
  });

  return {
    isInLocal: checkEndow && arithmeticMeanCif,
    value_cif: decimalUSD.format(_.round(arithmeticMeanCif, 6)),
    value: decimalUSD.format(
      _.round(arithmeticMeanCif, 6) * _.round(material.dmkchh, 6),
    ),
  };
};

export const handleTotalChiPhiPhanCongAndPhanBo = (data: any) => {
  let sum = 0;
  data?.forEach((e: any) => {
    const take_value = Number(e?.value ?? 0);
    sum += take_value;
  });
  return sum.toFixed(6);
};

function cif(record: any) {
  const usdExchangeRate = meanBy(
    record?.norm_vat_invoice_import_declaration,
    (i: any) => i.usd_exchange_rate,
  );

  const endUsdExchangeRate = usdExchangeRate
    ? round(Number(record?.cif) / usdExchangeRate, 6).toFixed(6)
    : 0;

  return record?.cif
    ? round(Number(record?.dmkchh) * Number(endUsdExchangeRate), 6).toFixed(6)
    : 0;
}

export const handleTotalChiPhiNguyenLieu = (
  data: any,
  dataOtherFees: any[] = [],
) => {
  let sum: number = 0;
  data?.forEach((e: any) => {
    const take_value = Number(
      formatOnlyNumber(handleCalculateUnitPrice(e, "").value) ?? 0,
    );
    sum += take_value;
  });

  dataOtherFees?.forEach((e: { unit_price: number }) => {
    const take_value = Number(e?.unit_price ?? 0);
    sum += take_value;
  });

  return sum?.toFixed(6);
};

// ??? not used
export const handleTotalChiPhiNguyenLieuKhongXuatXu = (
  data: any,
  dataOtherFees: any[] = [],
  form: string,
) => {
  let sum: number = 0;
  data?.forEach((e: any) => {
    // const take_value = Number(cif(e) ?? 0);
    const take_value = Number(checkIsFBOInVN(e, form) ? 0 : cif(e));
    sum += take_value;
  });

  dataOtherFees?.forEach((e: { unit_price: number }) => {
    const take_value = Number(e?.unit_price ?? 0);
    sum += take_value;
  });

  return sum?.toFixed(6);
};

// Total FBO trong nuoc
export const handleFBOTrongNuoc = (data: any, form: string) => {
  let sum: number = 0;
  data?.forEach((e: any) => {
    // const take_value = Number(checkIsFBOInVN(e, form) ? cif(e) : 0);
    const take_value = Number(
      checkIsFBOInVN(e, form)
        ? formatOnlyNumber(handleCalculateUnitPrice(e, form).value)
        : 0,
    );
    sum += take_value;
  });

  return sum?.toFixed(6);
};

// Total FBO ngoai nuoc
export const handleFBONgoaiNuoc = (
  data: any,
  dataOtherFees: any[] = [],
  form: string,
) => {
  let sum: number = 0;
  data?.forEach((e: any) => {
    // const take_value = Number(checkIsFBOInVN(e, form) ? 0 : cif(e));
    const take_value = Number(
      checkIsFBOInVN(e, form)
        ? 0
        : formatOnlyNumber(handleCalculateUnitPrice(e, form).value),
    );
    sum += take_value;
  });

  dataOtherFees?.forEach((e: { unit_price: number }) => {
    const take_value = Number(e?.unit_price ?? 0);
    sum += take_value;
  });

  return sum?.toFixed(6);
};

// ??? not used
export const handleSumCif = (data: any) => {
  let sum_tg_cif = 0;
  data?.forEach((item: any) => {
    const t_item = Number(item?.tg_ngoai_nuoc ?? 0).toFixed(6);
    sum_tg_cif += Number(t_item);
  });
  return sum_tg_cif;
};

export const handEndDirect = (
  cif: number,
  tb2: number,
  tb3: number,
  value_other: number,
  loi_nhuan: number,
  sumfbo: number,
) => {
  const sumend =
    ((Number(cif) +
      Number(tb2) +
      Number(tb3) +
      Number(value_other) +
      Number(loi_nhuan)) /
      Number(sumfbo)) *
    100;
  return sumend?.toFixed(6) ?? 0;
};

// RVC, LVC
export const handEndIndirect = (fbo: number, value: number) => {
  const sumend = ((Number(fbo) - Number(value)) / Number(fbo)) * 100;
  return sumend?.toFixed(6) ?? 0;
};

// CTC
export const CongThucTinhTriGiaFBOCTC = (total: number, fbo: number) => {
  const sumend = (Number(total) / Number(fbo)) * 100;
  return sumend?.toFixed(6);
};

// CTC
export const CongThucTinhTrongLuongCTC = (
  trong_luong1: number,
  trong_luong2: number,
) => {
  const sumend = (Number(trong_luong1 ?? 0) / Number(trong_luong2 ?? 0)) * 100;
  return sumend?.toFixed(6);
};
