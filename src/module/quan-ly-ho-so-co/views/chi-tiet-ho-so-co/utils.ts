/* eslint-disable eqeqeq */
import dayjs from "dayjs";
import { TFunction } from "i18next";
import produce from "immer";
import _ from "lodash";
import { SetterOrUpdater } from "recoil";

import { INormDeclarationDTO } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import { INormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/types";
import { IExportDeclarationDetail } from "@/module/quan-ly-to-khai/export-declaration/types";

import { handleCalculateUnitPrice } from "../config/sum-formula";
import { materialErrorMessages } from "../fakedata/fakedata";

export function isDoneCoDocument(status?: number | string) {
  return status === 1;
}

export const mappingProduct = (
  data: IExportDeclarationDetail[],
  shippingTerms: string,
) => {
  return data?.map((i) => ({
    ma_hs: i?.hs_code,
    ma_hh: i?.product_id,
    name_hh: i.product_name,
    key: i.export_declaration_detail_id,
    don_vi: i.unit,
    so_luong: i.quantity,
    sl_done_co: i.co_available,
    sl_not_co: i.co_used,
    don_gia: i.unit_price,
    fob_value: i.fob_value,
    stk: i.export_declaration_id,
    export_declaration_number: i.export_declaration_number,
    value: Number(i.unit_price) * Number(i.quantity),
    co_documents: i?.co_documents ?? [],
    number_tkx_with_shipping_terms: shippingTerms,
    product_code: i?.product_code,
    invoice_value: i?.invoice_value,
  }));
};

export const mappingNVLFromMapped = (data: any) => {
  return data?.map((i: any) => ({
    ...i,
    cif: i?.cif,
    code_nvl: i?.material_code?.trim(),
    dateT: i?.dateT ?? "",
    mmnv: i?.mmnv?.trim(),
    dvt: i?.dvt?.trim(),
    hs_code:
      i?.hs_code ||
      i?.norm_vat_invoice_import_declaration?.find(
        (item: any) => item.material_code?.trim() === i.mmnv?.trim(),
      )?.hs_code,
    status_nvl: i.dmkchh == 0 ? "Đủ" : i?.material_status || i?.status_nvl,
  }));
};

export const mappingNVL = (data: INormProductNumber) => {
  return data.norm_detail?.map(
    ({ norm_vat_invoice_import_declaration = {}, ...i }) => ({
      cif: i?.cif ?? norm_vat_invoice_import_declaration?.[0]?.unit_price_cif,
      code_nvl: i?.material_code,
      dateT: i?.dateT ?? "",
      dm: i?.norm_value,
      dmkchh: i?.norm_value_loss,
      dvt: i?.unit,
      hs_code: norm_vat_invoice_import_declaration?.find(
        (item: any) => item.material_code?.trim() === i.material_code?.trim(),
      )?.hs_code,
      info_tkn_vat:
        norm_vat_invoice_import_declaration?.[0]?.import_declaration_id,
      infomation: {
        dg_usd: norm_vat_invoice_import_declaration?.[0]?.unit_price_cif,
        ma_hh_tks:
          norm_vat_invoice_import_declaration?.[0]?.import_declaration_id,
        ma_hh_vat: i?.material_code,
        name_hh: i?.norm_material_name,
        status_nvl: i?.material_status,
        total_usd: 0,
      },
      norm_detail_id: i?.norm_detail_id,
      invoice_value: i?.invoice_value,
      mnvl: i?.material_id,
      mmnv: i?.material_code,
      name_nvl: i?.norm_material_name,
      nguon_cc: i.source,
      number: i?.number ?? "",
      status_nvl: i?.norm_value_loss == 0 ? "Đủ" : i?.material_status,
      tlhh: i.loss_ratio,
      norm_vat_invoice_import_declaration,
      norm_detail: i,
    }),
  );
};

// Check endow CO
export const checkEndowCO = (detail: any, endowArray: any[], form: string) => {
  if (!detail || !endowArray) return;
  let result = endowArray.find(
    (endow) =>
      ((endow?.import_declaration_id &&
        endow?.import_declaration_id === detail?.import_declaration_id) ||
        (endow?.vat_invoice_id &&
          endow?.vat_invoice_id === detail?.vat_invoice_id)) &&
      endow?.material_code === detail?.material_code,
  );

  return (
    !!result?.x_annex_code ||
    (result?.prefer_co_document_number &&
      result?.prefer_co_date &&
      result?.form === form)
  );
};

// START check fbo
export const checkIsFBOInVN = (material: any, form: string) => {
  let result = false;
  if (!material) return result;
  const normDeclarations = material.norm_vat_invoice_import_declaration;

  normDeclarations?.forEach((norm: any) => {
    if (
      !!norm?.x_annex_code ||
      (norm?.prefer_co_document_number &&
        norm?.prefer_co_date &&
        norm?.form === form)
    ) {
      result = true;
      return;
    }
  });

  return result;
};
// END check fbo

// START Endow CO
export const getEndowCO = (detail: any, endowArray: any[]) => {
  if (!detail || !endowArray) return;
  let result = endowArray.find(
    (endow) =>
      ((endow?.import_declaration_id &&
        endow?.import_declaration_id === detail?.import_declaration_id) ||
        (endow?.vat_invoice_id &&
          endow?.vat_invoice_id === detail?.vat_invoice_id)) &&
      endow?.material_code === detail?.material_code,
  );

  return result;
};

export const handleChangeNumberEndow = (
  indexOfMaterial: number,
  indexOfInvoice: number,
  sanPhams: any[],
  setSanPhams: SetterOrUpdater<any[]>,
  spIndex: number,
  value: string,
) => {
  const newSanPhams = produce(sanPhams, (draft) => {
    const normVatInvoice = sanPhams[spIndex].nguyen_lieu[indexOfMaterial];
    const normDeclaration =
      normVatInvoice.norm_vat_invoice_import_declaration[indexOfInvoice];
    const normDateTime =
      normVatInvoice.norm_vat_invoice_import_datetime?.[indexOfInvoice];

    draft[spIndex].nguyen_lieu.forEach((nl: any, index: number) => {
      const c = nl.norm_vat_invoice_import_declaration?.find(
        (i: any) =>
          (normDeclaration.import_declaration_id &&
            normDeclaration.import_declaration_id ===
              i.import_declaration_id) ||
          (normDeclaration.vat_invoice_id &&
            normDeclaration.vat_invoice_id === i.vat_invoice_id),
      );

      if (c && index === indexOfMaterial) {
        const dataPush = {
          import_declaration_id: c.import_declaration_id,
          vat_invoice_id: c.vat_invoice_id,
          number: value,
          material_code: c.material_code,
        };
        let norm = nl.norm_vat_invoice_import_datetime?.find(
          (norm: any) =>
            norm?.material_code &&
            (norm.import_declaration_id ===
              normDateTime?.import_declaration_id ||
              norm.vat_invoice_id === normDateTime?.vat_invoice_id) &&
            norm.material_code === normDateTime?.material_code,
        );

        if (norm) norm.number = value;
        else norm = dataPush;

        if (nl.norm_vat_invoice_import_datetime)
          nl.norm_vat_invoice_import_datetime[indexOfInvoice] = norm;
        else nl.norm_vat_invoice_import_datetime = [norm];
        nl.norm_vat_invoice_import_declaration[indexOfInvoice].number = value;
      }
    });
  });

  setSanPhams(newSanPhams);
};

export const handleChangeDateEndow = (
  indexOfMaterial: number,
  indexOfInvoice: number,
  sanPhams: any[],
  setSanPhams: SetterOrUpdater<any[]>,
  spIndex: number,
  dateString: string,
) => {
  const newSanPhams = produce(sanPhams, (draft) => {
    const normVatInvoice = sanPhams[spIndex].nguyen_lieu[indexOfMaterial];
    const normDeclaration =
      normVatInvoice.norm_vat_invoice_import_declaration[indexOfInvoice];
    const normDateTime =
      normVatInvoice.norm_vat_invoice_import_datetime?.[indexOfInvoice];

    draft[spIndex].nguyen_lieu.forEach((nl: any, index: number) => {
      const c = nl.norm_vat_invoice_import_declaration?.find(
        (i: any) =>
          (normDeclaration.import_declaration_id &&
            normDeclaration.import_declaration_id ===
              i.import_declaration_id) ||
          (normDeclaration.vat_invoice_id &&
            normDeclaration.vat_invoice_id === i.vat_invoice_id),
      );

      if (c && index === indexOfMaterial) {
        const dataPush = {
          import_declaration_id: c.import_declaration_id,
          vat_invoice_id: c.vat_invoice_id,
          dateT: dateString,
          material_code: c.material_code,
        };
        let norm = nl.norm_vat_invoice_import_datetime.find(
          (norm: any) =>
            norm?.material_code &&
            (norm.import_declaration_id ===
              normDateTime?.import_declaration_id ||
              norm.vat_invoice_id === normDateTime?.vat_invoice_id) &&
            norm.material_code === normDateTime?.material_code,
        );

        if (norm) norm.dateT = dateString;
        else norm = dataPush;

        if (nl.norm_vat_invoice_import_datetime)
          nl.norm_vat_invoice_import_datetime[indexOfInvoice] = norm;
        else nl.norm_vat_invoice_import_datetime = [norm];
        nl.norm_vat_invoice_import_declaration[indexOfInvoice].dateT =
          dateString;
      }
    });
  });

  setSanPhams(newSanPhams);
};

export const handleChangeFormCO = (
  indexOfMaterial: number,
  indexOfInvoice: number,
  sanPhams: any[],
  setSanPhams: SetterOrUpdater<any[]>,
  spIndex: number,
  value: string,
) => {
  const newSanPhams = produce(sanPhams, (draft) => {
    const normVatInvoice = sanPhams[spIndex].nguyen_lieu[indexOfMaterial];
    const normDeclaration =
      normVatInvoice.norm_vat_invoice_import_declaration[indexOfInvoice];
    const normDateTime =
      normVatInvoice.norm_vat_invoice_import_datetime?.[indexOfInvoice];

    draft[spIndex].nguyen_lieu.forEach((nl: any, index: number) => {
      const c = nl.norm_vat_invoice_import_declaration?.find(
        (i: any) =>
          (normDeclaration.import_declaration_id &&
            normDeclaration.import_declaration_id ===
              i.import_declaration_id) ||
          (normDeclaration.vat_invoice_id &&
            normDeclaration.vat_invoice_id === i.vat_invoice_id),
      );

      if (c && index === indexOfMaterial) {
        const dataPush = {
          import_declaration_id: c.import_declaration_id,
          vat_invoice_id: c.vat_invoice_id,
          form: value,
          material_code: c.material_code,
        };
        let norm = nl.norm_vat_invoice_import_datetime?.find(
          (norm: any) =>
            norm?.material_code &&
            (norm.import_declaration_id ===
              normDateTime?.import_declaration_id ||
              norm.vat_invoice_id === normDateTime?.vat_invoice_id) &&
            norm.material_code === normDateTime?.material_code,
        );

        if (norm) norm.form = value;
        else norm = dataPush;

        if (nl.norm_vat_invoice_import_datetime)
          nl.norm_vat_invoice_import_datetime[indexOfInvoice] = norm;
        else nl.norm_vat_invoice_import_datetime = [norm];
        nl.norm_vat_invoice_import_declaration[indexOfInvoice].form = value;
      }
    });
  });

  setSanPhams(newSanPhams);
};

// END Endow CO

// START conversion factor
export const checkNotConversionFactor = (sanPham: any[]): boolean => {
  let result = false;
  if (sanPham) {
    sanPham.forEach((product) => {
      product?.nguyen_lieu?.forEach((material: any) => {
        const item = material?.norm_vat_invoice_import_declaration?.find(
          (item: any) => !item.conversion_factor,
        );
        if (item) {
          result = true;
          return;
        }
      });
      if (result) return;
    });
  }

  return result;
};
// END conversion factor

// START handle change materials when changed import declaration
export const handleChangeImportDeclaration = (
  importDeclaration: any, // IImportDeclaration | VatInvoice
  importDeclarationId: string,
  sanPhams: any[],
  setSanPhams: any,
  setNeedSave?: any,
) => {
  const newSanPhams = produce(sanPhams, (draft) => {
    draft.forEach((sanPham) => {
      sanPham?.nguyen_lieu?.forEach((nl: any) => {
        nl?.norm_vat_invoice_import_declaration?.forEach((norm: any) => {
          if (norm?.import_declaration_id === importDeclarationId) {
            norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
            norm.form = importDeclaration.form;
            norm.prefer_co_date = importDeclaration.prefer_co_date
              ? dayjs(importDeclaration.prefer_co_date).format("YYYY-MM-DD")
              : null;
            norm.prefer_co_document_number =
              importDeclaration.prefer_co_document_number;
            norm.x_annex_code = importDeclaration.x_annex_code;
          } else if (norm?.vat_invoice_id === importDeclarationId) {
            norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
            norm.x_annex_date = importDeclaration.date
              ? dayjs(importDeclaration.date).format("YYYY-MM-DD")
              : null;
            norm.x_annex_code = importDeclaration.x_annex_code;
          }
        });
      });
    });
  });

  setSanPhams(newSanPhams);
  if (setNeedSave) setNeedSave(true);
};
// END handle change materials when changed import declaration

export const checkCanSaveCOComplete = (sanPhams: any[]): boolean => {
  let result = true;

  sanPhams.forEach((product) => {
    if (!product?.nguyen_lieu) {
      result = false;
      return;
    }
    product.nguyen_lieu?.forEach((material: any) => {
      if (material?.status_nvl === "Thiếu") {
        result = false;
        return;
      }

      material?.norm_vat_invoice_import_declaration?.forEach(
        (normVatDeclaration: any) => {
          if (normVatDeclaration?.check_import_date === 0) {
            result = false;
            return;
          }
        },
      );

      if (!result) return;
    });

    if (!result) return;
  });

  return result;
};

// START calculate co done
export const handleCalculateCoDone = (index: number, sanPhams: any[] = []) => {
  const products =
    index >= 0
      ? produce(sanPhams, (draft) => {
          draft.splice(index, 1);
        })
      : _.clone(sanPhams);

  const materials = _.flatten(
    products?.map((product: any) => product.nguyen_lieu),
  );

  const normDeclarations =
    _.flatten(
      materials.map(
        (material: any) => material?.norm_vat_invoice_import_declaration,
      ),
    ) || [];

  const resultArray: INormDeclarationDTO[] = [];

  for (const obj of normDeclarations) {
    if (obj) {
      const {
        vat_invoice_id,
        import_declaration_id,
        serial_number,
        co_doned,
        material_id,
        conversion_factor,
        sort_order,
      } = obj;

      const index = resultArray.findIndex(
        (item) =>
          ((item.import_declaration_id &&
            item.import_declaration_id === import_declaration_id) ||
            (item.vat_invoice_id && item.vat_invoice_id === vat_invoice_id)) &&
          item.material_id === material_id,
      );

      if (index >= 0)
        resultArray[index].co_doned +=
          co_doned / Number(conversion_factor || 1);
      else
        resultArray.push({
          vat_invoice_id,
          import_declaration_id,
          co_doned,
          material_id,
          sort_order,
          serial_number,
        });
    }
  }

  return resultArray.length > 0 ? resultArray : null;
};
// END calculate co done

// START handle get fob value
export const getFobValue = (sanPham: any, getChooseFOB: any) => {
  let fobValue = sanPham?.fob_value;
  if (fobValue) return fobValue;

  fobValue =
    getChooseFOB?.house_bill_number?.toUpperCase()?.indexOf("HOUSEBILLFOB") > -1
      ? sanPham?.don_gia
      : 0;
  return fobValue;
};
// END handle get fob value

// START handle refetch dropdown norm when import declaration or vat
export const refetchDropdownNorm = (
  t: TFunction,
  sanPhams: any[],
  sanPhamByMaHH: any,
  setLackedMaterial: any,
  setSanPhams: any,
) => {
  const newProducts = produce(sanPhams, (draft) => {
    draft.forEach(async (product) => {
      // const materials = await getNormProductNumber({
      //   norm_id: product?.dinh_muc_id || 0,
      //   product_number: product?.sl_done_co,
      //   export_declaration_id: product?.stk,
      // });

      // product["nguyen_lieu"] = mappingNVL(materials);

      if (product["key"] == sanPhamByMaHH?.key) {
        let countNoMapping = 0;
        product["nguyen_lieu"]?.forEach((i: any) => {
          if (
            i?.status_nvl?.toLowerCase() === t("for_all.lack").toLowerCase() ||
            i?.status_nvl?.toLowerCase() === t("for_all.over").toLowerCase() ||
            i?.norm_vat_invoice_import_declaration?.find(
              (i: any) => i.check_import_date === 0,
            )
          )
            countNoMapping++;
        });
        setLackedMaterial(countNoMapping);

        if (!("tcs" in product)) {
          product["tcs"] = {};
        }
      }
    });
  });
  setSanPhams(newProducts);
};
// END handle refetch dropdown norm

// START handle calculate total of weight of the CTC criteria
export const calculateTotalOfWeightCTC = (
  sanPham: any,
  numberHS: number,
  chooseFormCo: any,
) => {
  let sum: number = 0;
  if (sanPham?.nguyen_lieu) {
    const productHS = sanPham.ma_hs;
    sanPham.nguyen_lieu?.forEach((material: any) => {
      const materialHS = material?.hs_code;

      const c =
        materialHS?.substring(0, numberHS) ===
        productHS?.substring(0, numberHS);

      if (c) {
        const unitPrice = handleCalculateUnitPrice(material, chooseFormCo);

        if (!unitPrice.isInLocal)
          sum += _.round(Number(unitPrice.value.replace(",", "")), 6);
      }
    });
  }

  return _.round(sum, 6);
};

// END handle calculate total of weight of the CTC criteria

// START check lacked materials
export function checkLackedMaterial(record: any, t: TFunction) {
  // if (criteria !== "cc" && criteria !== "cth" && criteria !== "ctsh")
  //   return false;
  let result = false;
  record?.nguyen_lieu?.forEach((i: any) => {
    if (
      i?.status_nvl?.toLowerCase() === t("for_all.lack").toLowerCase() ||
      i?.status_nvl?.toLowerCase() === t("for_all.over").toLowerCase() ||
      i?.norm_vat_invoice_import_declaration?.find(
        (i: any) => i.check_import_date === 0,
      )
    ) {
      result = true;
      return;
    }
  });

  return result;
}
// END check lacked materials

// START get error message of material
export const getMaterialErrorMessage = (record: any, checkCTC?: boolean) => {
  const hsCode = record.hs_code
    ? record.hs_code
    : record?.norm_vat_invoice_import_declaration?.find(
        (item: any) => item.material_code?.trim() === record.mmnv?.trim(),
      )?.hs_code;

  if (!hsCode) return materialErrorMessages.hsCode;

  if (checkCTC) return materialErrorMessages.ctc;
};
// END get error message of material

// Handle list criteria
export const getTabsCriteria = (rawList: string[]) => {
  return _.chain(
    rawList.map((raw) => {
      if (raw.includes("+")) {
        const list = raw.split("+");
        return list.map((i) => i.trim().split(" ")[0]);
      } else if (raw.includes(" ")) return raw.split(" ")[0];
      else return raw;
    }),
  )
    .flatten()
    .uniq()
    .value()
    .map((i) => ({ label: i, value: i }));
};

export const getPercentOfCriterial = (criterial: string, rawList: string[]) => {
  let percent = 35;
  const raw = rawList.find((i) => i.includes(criterial));
  if (raw) {
    if (raw.includes("+")) {
      const list = raw.split("+");
      list.forEach((item) => {
        if (item.includes("%") && item.includes(criterial))
          percent = Number(item.trim().split(" ")[1].replace("%", ""));
      });
    } else if (raw.includes(" ")) {
      percent = Number(raw.split(" ")[1].replace("%", ""));
    }
  }

  return percent;
};

export const getCheckedTabsOfCriteria = (rawList: string[]) => {
  const result: string[] = [];
  const listPluses = rawList.filter((i) => i.includes("+"));

  listPluses.forEach((plus) => {
    const list = plus.split("+");
    list.forEach((item) => {
      result.push(item.trim().split(" ")[0]);
    });
  });

  return _.uniq(result);
};
