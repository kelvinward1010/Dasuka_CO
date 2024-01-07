/* eslint-disable eqeqeq */
import {
  InputNumber,
  Select,
  Space,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { DefaultOptionType } from "antd/es/select";
import produce from "immer";
import * as _ from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { INormDropdown } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getDropdownByMultiProductCodes";
import { getNormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import { UpdateNorm } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/components/UpdateNorm";
import { INormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/types";
import { STATUS_DROPDOWN_TEXT_TYPE } from "@/module/quan-ly-ho-so-co-v2/api/getDropdownStatus";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { UpdateExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/UpdateExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";
import { dataLackedMaterialState } from "@/store/action/atom";
import { chooseFormCOSelector } from "@/store/choose/state";
import { dataSelected } from "@/store/datanvl/state";
import { getChiTietHoSoCOUrl } from "@/urls";
import { formatNumber } from "@/utils/format";
import { decimalUSD2Number, intlUSD } from "@/utils/intl";

import { checkResultForm } from "../../config/result-form";
import {
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "../state/bigA";
import { handleCalcEndCC } from "../tabs/Cc";
import { handleCalcEndCth } from "../tabs/Cth";
import { handleCalcEndCtsh } from "../tabs/Ctsh";
import {
  checkLackedMaterial,
  handleCalculateCoDone,
  isDoneCoDocument,
  mappingNVL,
  mappingNVLFromMapped,
} from "../utils";

const { Text } = Typography;

interface Props {
  sanPhamWithSTK: any[];
  setNormProduct: React.Dispatch<
    React.SetStateAction<string | number | undefined>
  >;
  getQuotasLazy: any;
  dropdownExportDeclarations: any;
  dataDropdownNorms: INormDropdown[] | undefined;
  isLoadingDropdownNorms: boolean;
}

export function DanhSachSanPhamInCoTable({
  getQuotasLazy,
  setNormProduct,
  dropdownExportDeclarations,
  dataDropdownNorms = [],
  isLoadingDropdownNorms = false,
}: Props) {
  const { id } = useParams();
  const { t } = useTranslation();
  const coDocument = queryClient.getQueryData<ICoDocument>([
    "co-documents",
    id,
  ]);
  const isDone = isDoneCoDocument(coDocument?.status_id);

  const [sanPhamByMaHH, setSanPhamByMaHH] = useRecoilState(sanPhamByMaHHState);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const [, setLackedMaterial] = useRecoilState(dataLackedMaterialState);
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const selectedSanPham: string[] = useRecoilValue(dataSelected);
  const customer = useRecoilValue(customerState);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);

  const sanPhamFilterBySelected = sanPhams?.filter((item) =>
    selectedSanPham.includes(item?.stk),
  );
  const [isLoading, setIsLoading] = useState<any>();

  const handleSelect = (key: number) => async () => {
    // const sanPhamIndex = sanPhams.findIndex(
    //   (i) => i.ma_hh === ma_hh && i.stk === stk,
    // );
    const sanPhamIndex = sanPhams.findIndex(
      (i) => Number(i.key) === Number(key),
    );
    if (sanPhamIndex === -1) return;
    const selectedSanPham = sanPhams[sanPhamIndex];
    setSanPhamByMaHH({
      stk: selectedSanPham.stk,
      ma_hh: selectedSanPham.ma_hh,
      key,
    });

    if ("dinh_muc_id" in selectedSanPham) {
      let nguyenLieuFromNorm: INormProductNumber;
      if (!selectedSanPham.nguyen_lieu)
        nguyenLieuFromNorm = await getNormProductNumber({
          norm_id: selectedSanPham.dinh_muc_id,
          product_number: selectedSanPham.sl_done_co,
          export_declaration_id: selectedSanPham.stk,
          form_co: chooseFormCo,
          co_document_id: Number(id),
        });
      const newSanPham = produce(sanPhams, (draftState) => {
        const nguyen_lieu = draftState[sanPhamIndex].nguyen_lieu;
        if (nguyen_lieu)
          draftState[sanPhamIndex].nguyen_lieu =
            mappingNVLFromMapped(nguyen_lieu);
        else
          draftState[sanPhamIndex].nguyen_lieu = mappingNVL(nguyenLieuFromNorm);

        let countNoMapping = 0;
        draftState[sanPhamIndex].nguyen_lieu?.forEach((i: any) => {
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

        if (!("tcs" in draftState[sanPhamIndex])) {
          draftState[sanPhamIndex]["tcs"] = {};
        }
      });
      setSanPhams(newSanPham);
      setNormProduct(selectedSanPham.dinh_muc_id);
    } else {
      const quota = await getQuotasLazy({
        customer_id: customer.value,
        product_code: selectedSanPham.product_code,
      });
      const nguyenLieuFromNorm = await getNormProductNumber({
        norm_id: selectedSanPham.dinh_muc_id,
        product_number: selectedSanPham.sl_done_co,
        export_declaration_id: selectedSanPham.stk,
        form_co: chooseFormCo,
        co_document_id: Number(id),
      });

      const newSanPham = produce(sanPhams, (draftState) => {
        draftState[sanPhamIndex].dinh_muc = quota[0]?.label;
        draftState[sanPhamIndex].dinh_muc_id = quota[0]?.value;
        draftState[sanPhamIndex].nguyen_lieu = mappingNVL(nguyenLieuFromNorm);
        if (!("tcs" in draftState[sanPhamIndex])) {
          draftState[sanPhamIndex]["tcs"] = {};
        }
      });
      setNormProduct(quota[0]?.value);
      setSanPhams(newSanPham);
    }
  };

  const handleChange = (ma_hh: string, stk: string) => (e: number | null) => {
    const newSanPhams = produce(sanPhams, (draft) => {
      const sanPhamIndex = draft.findIndex(
        (item) => item.ma_hh === ma_hh && item.stk === stk,
      );

      if (sanPhamIndex === -1) return;
      draft[sanPhamIndex].sl_done_co = e;
    });
    setSanPhams(newSanPhams);
  };

  const handleSelectNorm = async (
    value: string,
    option: DefaultOptionType,
    indexProduct: number,
  ) => {
    const listMaterialDetails = handleCalculateCoDone(indexProduct, sanPhams);
    setIsLoading(indexProduct);
    const { ma_hh, stk, key } = sanPhamByMaHH;
    const sanPhamSelected = sanPhams.find(
      (i: any) => i.ma_hh === ma_hh && i.stk === stk && i.key == key,
    );
    const nguyenLieu = await getNormProductNumber({
      norm_id: option.value || 0,
      product_number: sanPhamSelected.sl_done_co,
      export_declaration_id: sanPhamSelected.stk,
      list_json_material_detail: listMaterialDetails,
      list_json_nguyen_lieus:
        coDocument?.status_id == 4 ? sanPhamSelected.nguyen_lieu : null,
      form_co: chooseFormCo,
      co_document_id: Number(id),
    });
    const newSanPhams = produce(sanPhams, (draft) => {
      draft[indexProduct].dinh_muc = option.label;
      draft[indexProduct].dinh_muc_id = value;

      if (
        ma_hh === draft[indexProduct].ma_hh &&
        stk === draft[indexProduct].stk &&
        key == draft[indexProduct].key
      ) {
        draft[indexProduct]["nguyen_lieu"] = mappingNVL(nguyenLieu);

        let countNoMapping = 0;
        draft[indexProduct]["nguyen_lieu"]?.forEach((i: any) => {
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

        if (!("tcs" in draft[indexProduct])) {
          draft[indexProduct]["tcs"] = {};
        }
      }
    });
    setSanPhams(newSanPhams);
    setIsLoading(undefined);
  };

  const handleUpdateProducts = (export_declaration: IExportDeclaration) => {
    const newProducts = produce(sanPhams, (draft) => {
      draft.forEach((product) => {
        if (product.stk === export_declaration.export_declaration_id) {
          export_declaration.export_declaration_detail.forEach((item) => {
            if (item.export_declaration_detail_id == product.key)
              product.don_gia = item.unit_price;
          });
        }
      });
    });

    setSanPhams(newProducts);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      align: "center",
      width: 50,
      render: (_, __, index) => <Typography.Text>{++index}</Typography.Text>,
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.stk"),
      dataIndex: "stk",
      key: "stk",
      width: 150,
      render: (text: any, record) => (
        <UpdateExportDeclaration
          exportDeclaration={{
            ...record,
            export_declaration_id: text,
            export_declaration_number:
              dropdownExportDeclarations?.find((i: any) => i?.value === text)
                ?.label || text,
            shipping_terms: record.number_tkx_with_shipping_terms,
          }}
          isShowTerm
          callbackUpdate={handleUpdateProducts}
        />
      ),
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.title_info_sp"),
      dataIndex: "name_hh",
      width: 330,
      render: (text, record) => (
        <Typography.Link
          onClick={handleSelect(record.key)}
          className={
            // sanPham?.ma_hh === record.ma_hh &&
            // sanPham.stk === record.stk
            sanPham?.key === record.key ? "text-selected-rainbow" : ""
          }
        >
          {record.ma_hs +
            " - " +
            (record.product_code ? record.product_code + " - " : "") +
            text}
        </Typography.Link>
      ),
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.so_luong"),
      dataIndex: "so_luong",
      key: "so_luong",
      width: 80,
      align: "right",
      render: (value) => intlUSD.format(value),
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.sl_done_co"),
      dataIndex: "co_documents",
      width: 150,
      render: (co_documents: any[], record) => {
        // TODO: Write code drunkenly. Fix later
        const coDocument = co_documents?.filter((i) => i.co_document_number);

        return (
          <Space direction="vertical">
            {coDocument?.map((i, index) => {
              if (record.ma_hh === i.product_id) {
                return (
                  <Link key={index} to={getChiTietHoSoCOUrl(i?.co_document_id)}>
                    <Text
                      type={STATUS_DROPDOWN_TEXT_TYPE[i?.status_id]}
                    >{`${i?.co_document_number}(${i?.co_doned})`}</Text>
                  </Link>
                );
              } else {
                return null;
              }
            })}
          </Space>
        );
      },
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.sl_not_co"),
      dataIndex: "sl_done_co",
      width: 100,
      render: (sl_done_co: any, record) => {
        const total =
          record.co_documents
            ?.filter((i: any) => i.co_document_number)
            ?.filter((i: any) => i.product_id === record.ma_hh)
            ?.reduce((acc: number, cur: any) => acc + cur.co_doned, 0) ?? 0;

        return (
          <InputNumber
            defaultValue={sl_done_co ?? record?.so_luong - total}
            onChange={handleChange(record.ma_hh, record.stk)}
            name="sl_none_co"
            style={{ textAlign: "right", width: "100%" }}
            min={0}
            max={record?.so_luong - total}
            disabled={isDone}
            formatter={formatNumber}
          />
        );
      },
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.don_vi"),
      dataIndex: "don_vi",
      width: 60,
      align: "center",
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.don_gia"),
      dataIndex: "don_gia",
      align: "right",
      width: 80,
      render: (value) => decimalUSD2Number.format(+_.round(value, 2)),
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.don_gia_fob"),
      dataIndex: "fob_value",
      align: "right",
      width: 100,
      render: (fob_value) =>
        fob_value
          ? decimalUSD2Number.format(+_.round(fob_value, 2).toFixed(2))
          : "",
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.dinh_muc"),
      dataIndex: isDone ? "dinh_muc" : "dinh_muc_id",
      key: "dinh_muc_id",
      width: 260,
      render: (value: any, record: any, index: number) => {
        const options = _.uniqBy(
          dataDropdownNorms?.filter(
            (dropdown) => dropdown?.product_code === record.product_code,
          ) || [],
          "value",
        );

        const val = isDone
          ? value.split("=>")?.[1]
            ? value.split("=>")?.[1]
            : value
          : value;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "nowrap",
            }}
          >
            <Select
              disabled={isDone}
              loading={isLoadingDropdownNorms || isLoading === index}
              style={{ flex: "1 1 0" }}
              dropdownStyle={{ maxHeight: 400 }}
              options={options}
              placeholder={"Chưa có định mức"}
              value={val}
              onSelect={(value, option) =>
                handleSelectNorm(value, option, index)
              }
            />
            <div style={{ width: 50, textAlign: "center", paddingLeft: 10 }}>
              <UpdateNorm norm_id={record?.dinh_muc_id} norm_name={"Xem"} />
            </div>
          </div>
        );
      },
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.tc_kq"),
      dataIndex: "tieu_chi",
      key: "tieu_chi",
      width: 130,
      render: (__: any, record: any) => {
        function checkResult(tieu_chi: string) {
          const result = _.get(
            record,
            `tcs.${tieu_chi}.end`,
            defaultValueChiTieu[tieu_chi] ?? -1,
          );

          if (typeof result === "number") {
            return result > -1;
          }

          return result;
        }

        function checkDeMinimis(tieu_chi: any, record: any) {
          if (
            tieu_chi?.toLowerCase() === "cc" ||
            tieu_chi?.toLowerCase() === "cth" ||
            tieu_chi?.toLowerCase() === "ctsh"
          ) {
            switch (tieu_chi?.toLowerCase()) {
              case "cc":
                return (
                  handleCalcEndCC(
                    tieu_chi?.toLowerCase() === "cc" && record?.tcs?.cc,
                    // handleTotalChiPhiNguyenLieu(
                    //   record?.nguyen_lieu,
                    //   record?.otherFees,
                    // ),
                    record?.fob_value,
                  ) === 0
                );
              case "cth":
                return (
                  handleCalcEndCth(
                    tieu_chi?.toLowerCase() === "cth" && record?.tcs?.cth,
                    // handleTotalChiPhiNguyenLieu(
                    //   record?.nguyen_lieu,
                    //   record?.otherFees,
                    // ),
                    record?.fob_value,
                  ) === 0
                );
              case "ctsh":
                return (
                  handleCalcEndCtsh(
                    tieu_chi?.toLowerCase() === "ctsh" && record?.tcs?.ctsh,
                    // handleTotalChiPhiNguyenLieu(
                    //   record?.nguyen_lieu,
                    //   record?.otherFees,
                    // ),
                    record?.fob_value,
                  ) === 0
                );

              default:
                break;
            }
          }
          return false;
        }

        return (
          <div>
            {record?.tieu_chi?.map((item: string, idx: any) => {
              const check =
                checkDeMinimis(item, record) ||
                (checkResult(item.toLowerCase()) &&
                  !checkLackedMaterial(record, t) &&
                  checkResultForm(
                    record,
                    record.nguyen_lieu,
                    item,
                    chooseFormCo,
                  ));
              return (
                <div key={idx}>
                  {item} -{" "}
                  <Text type={check ? "success" : "danger"}>
                    {check ? t("for_all.achieved") : t("for_all.not_achieved")}
                  </Text>
                </div>
              );
            })}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      scroll={{ y: 330 }}
      size="small"
      bordered
      columns={columns}
      pagination={false}
      dataSource={sanPhamFilterBySelected}
      rowKey={(record) => record.key}
    />
  );
}

export const defaultValueChiTieu: Record<string, boolean | number> = {
  cc: 1,
  cth: 1,
  ctsh: 1,
  wo: 1,
  "wo-ak": 1,
  rvc: 1,
  lvc: 1,
  pe: 1,
};
