/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Checkbox, Col, Form, Row, Select, Typography } from "antd";
import produce from "immer";
import _, { xor } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { getNormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { dataLackedMaterialState } from "@/store/action/atom";
import { chooseNormState } from "@/store/choose/atom";
import { chooseFormCOSelector } from "@/store/choose/state";

import {
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "../chi-tiet-ho-so-co/state/bigA";
import {
  handleCalculateCoDone,
  isDoneCoDocument,
  mappingNVL,
} from "../chi-tiet-ho-so-co/utils";
import styles from "./checkbox-hsco.module.scss";

const { Text } = Typography;

interface DataType {
  sanPhamWithSTK: any[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  checkbox: any[];
  setCheckbox: React.Dispatch<React.SetStateAction<string[]>>;
  getQuotasLazy: any;
}

export function CheckBoxHsco({
  sanPhamWithSTK,
  checkbox,
  setCheckbox,
  visible,
  setVisible,
  getQuotasLazy,
}: DataType) {
  const { id } = useParams();
  const { t } = useTranslation();
  const setSanPhamByMaHH = useSetRecoilState(sanPhamByMaHHState);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const [search, setSearch] = React.useState("");
  const customer = useRecoilValue(customerState);
  const [, setNormProduct] = useRecoilState<any>(chooseNormState);
  const [isLoadingSelect, setIsLoadingSelect] = useState<boolean>(false);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);

  const options = useMemo(
    () => [
      {
        label: "Tất cả",
        value: "all",
      },
      ...sanPhamWithSTK
        // filter by search
        ?.filter((item: any) => {
          const name = item?.name_hh?.toLowerCase();
          const ma_hs = item?.ma_hs?.toLowerCase();
          const stk = item?.stk?.toLowerCase();
          const searchLowerCase = search?.toLowerCase().trim();
          return (
            name?.includes(searchLowerCase) ||
            ma_hs?.includes(searchLowerCase) ||
            stk?.includes(searchLowerCase)
          );
        })
        // map to options
        ?.map((item: any) => ({
          label:
            item?.ma_hs + " - " + item?.product_code + " - " + item?.name_hh,
          value: `${item?.ma_hh}???${item?.stk}???${item?.key}`,
          key: item.key,
        })),
    ],
    [sanPhamWithSTK, search],
  );

  const coDocument = queryClient.getQueryData<ICoDocument>([
    "co-documents",
    id,
  ]);
  const isDone = isDoneCoDocument(coDocument?.status_id);

  useEffect(() => {
    const checkData =
      !checkbox.includes("all") && checkbox?.length === options.length - 1;
    if (checkbox?.length > 0 && checkData) {
      setCheckbox(["all", ...checkbox]);
    }
  }, [checkbox, setCheckbox, options]);

  const handleChangeSelect = async (values: string[], value: string) => {
    setIsLoadingSelect(true);
    if (values.length < options.length)
      values.indexOf("all") > -1 && values.splice(values.indexOf("all"), 1);
    if (value === "all") {
      if (checkbox.includes(value)) {
        values = [];
        setCheckbox(values);

        setSanPhams(values);
        setIsLoadingSelect(false);
        setLackedMaterial(0);
        return;
      } else values = options.map((i) => i.value);
      setCheckbox(values);

      // setIsLoadingSelect(false);
      // return;
    } else setCheckbox(values);
    const newSanPham = produce(sanPhams, (draftState) => {
      values.forEach((item: string) => {
        const [__, ___, key] = item.split("???");
        const index = draftState.findIndex(
          // (i) => i.ma_hh === ma_hh && i.stk === stk,
          (i) => Number(i.key) === Number(key),
        );
        if (index !== -1) return;

        const sanPhamSelected = sanPhamWithSTK.find(
          (i) => Number(i.key) === Number(key),
        );
        if (!sanPhamSelected) return;
        draftState.push(sanPhamSelected);
      });
      // remove sp not in value
      draftState.forEach((item, index) => {
        let c = false;

        values.forEach((val) => {
          const [__, ___, key] = val.split("???");

          if (Number(item.key) === Number(key)) {
            c = true;
          }
        });

        if (!c) draftState.splice(index, 1);
      });
    });

    const [__, ___, keyI] = (value === "all" ? values?.[1] : value).split(
      "???",
    );
    const sanPhamIndex = newSanPham.findIndex(
      (i) => Number(i.key) === Number(keyI),
    );
    if (sanPhamIndex === -1) {
      setSanPhams(newSanPham);
      setIsLoadingSelect(false);
      return;
    }

    const listMaterialDetails = handleCalculateCoDone(sanPhamIndex, newSanPham);

    // if (isChecked) {
    const selectedSanPham = newSanPham[sanPhamIndex];
    setSanPhamByMaHH({
      stk: selectedSanPham.stk,
      ma_hh: selectedSanPham.ma_hh,
      key: selectedSanPham.key,
    });

    let listProductsNeedShow = _.clone(newSanPham);

    if (value !== "all") {
      if (selectedSanPham) {
        const quota = await getQuotasLazy({
          product_code: selectedSanPham.product_code,
          customer_id: customer.value,
        });

        if ("dinh_muc_id" in selectedSanPham) {
          const nguyenLieu = await getNormProductNumber({
            norm_id: selectedSanPham.dinh_muc_id,
            product_number: selectedSanPham.sl_done_co,
            export_declaration_id: selectedSanPham.stk,
            list_json_material_detail: listMaterialDetails,
            form_co: chooseFormCo,
            co_document_id: Number(id) || null,
          });

          const newSP = produce(newSanPham, (draftState) => {
            draftState[sanPhamIndex].nguyen_lieu = mappingNVL(nguyenLieu);

            let countNoMapping = 0;
            draftState[sanPhamIndex].nguyen_lieu?.forEach((i: any) => {
              if (
                i?.status_nvl?.toLowerCase() ===
                  t("for_all.lack").toLowerCase() ||
                i?.status_nvl?.toLowerCase() ===
                  t("for_all.over").toLowerCase() ||
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
          setSanPhams(newSP);
          setNormProduct(selectedSanPham.dinh_muc_id);
        } else {
          const nguyenLieu = await getNormProductNumber({
            norm_id: quota[0]?.value,
            product_number: selectedSanPham.sl_done_co,
            export_declaration_id: selectedSanPham.stk,
            list_json_material_detail: listMaterialDetails,
            form_co: chooseFormCo,
            co_document_id: Number(id),
          });

          const newSP = produce(newSanPham, (draftState) => {
            draftState[sanPhamIndex].dinh_muc = quota[0]?.label;
            draftState[sanPhamIndex].dinh_muc_id = quota[0]?.value;
            draftState[sanPhamIndex].nguyen_lieu = mappingNVL(nguyenLieu);
            let countNoMapping = 0;
            draftState[sanPhamIndex].nguyen_lieu?.forEach((i: any) => {
              if (
                i?.status_nvl?.toLowerCase() ===
                  t("for_all.lack").toLowerCase() ||
                i?.status_nvl?.toLowerCase() ===
                  t("for_all.over").toLowerCase() ||
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
          setNormProduct(quota[0]?.value);
          setSanPhams(newSP);
        }
      }
    } else {
      for (let i = 0; i < listProductsNeedShow.length; i++) {
        let listMaterialDetails = null;

        if (!id) {
          listMaterialDetails = handleCalculateCoDone(
            -1,
            _.clone(listProductsNeedShow).slice(0, i),
          );
        } else
          listMaterialDetails = handleCalculateCoDone(i, listProductsNeedShow);

        if (listProductsNeedShow[i]) {
          const quota = await getQuotasLazy({
            product_code: listProductsNeedShow[i].product_code,
            customer_id: customer.value,
          });

          if ("dinh_muc_id" in listProductsNeedShow[i]) {
            const nguyenLieu = await getNormProductNumber({
              norm_id: listProductsNeedShow[i].dinh_muc_id,
              product_number: listProductsNeedShow[i].sl_done_co,
              export_declaration_id: listProductsNeedShow[i].stk,
              list_json_material_detail: listMaterialDetails,
              form_co: chooseFormCo,
              co_document_id: Number(id),
            });

            listProductsNeedShow[i] = produce(
              listProductsNeedShow[i],
              (draft: any) => {
                draft.nguyen_lieu = mappingNVL(nguyenLieu);

                if (i === 0) {
                  let countNoMapping = 0;
                  draft.nguyen_lieu?.forEach((i: any) => {
                    if (
                      i?.status_nvl?.toLowerCase() ===
                        t("for_all.lack").toLowerCase() ||
                      i?.status_nvl?.toLowerCase() ===
                        t("for_all.over").toLowerCase() ||
                      i?.norm_vat_invoice_import_declaration?.find(
                        (i: any) => i.check_import_date === 0,
                      )
                    )
                      countNoMapping++;
                  });
                  setLackedMaterial(countNoMapping);
                }

                if (!("tcs" in draft)) {
                  draft["tcs"] = {};
                }
              },
            );
          } else {
            const nguyenLieu = await getNormProductNumber({
              norm_id: quota[0]?.value,
              product_number: listProductsNeedShow[i].sl_done_co,
              export_declaration_id: listProductsNeedShow[i].stk,
              list_json_material_detail: listMaterialDetails,
              form_co: chooseFormCo,
              co_document_id: Number(id),
            });

            listProductsNeedShow[i] = produce(
              listProductsNeedShow[i],
              (draft: any) => {
                draft.dinh_muc = quota[0]?.label;
                draft.dinh_muc_id = quota[0]?.value;
                draft.nguyen_lieu = mappingNVL(nguyenLieu);
                if (i === 0) {
                  let countNoMapping = 0;
                  draft.nguyen_lieu?.forEach((i: any) => {
                    if (
                      i?.status_nvl?.toLowerCase() ===
                        t("for_all.lack").toLowerCase() ||
                      i?.status_nvl?.toLowerCase() ===
                        t("for_all.over").toLowerCase() ||
                      i?.norm_vat_invoice_import_declaration?.find(
                        (i: any) => i.check_import_date === 0,
                      )
                    )
                      countNoMapping++;
                  });
                  setLackedMaterial(countNoMapping);
                }
                if (!("tcs" in draft)) {
                  draft["tcs"] = {};
                }
              },
            );
          }
        }
      }

      setSanPhams(listProductsNeedShow);
    }

    setIsLoadingSelect(false);
    // setSanPhams(newSanPham);
  };

  function logicCheckbox(value: string) {
    const checkData = checkbox.filter((i) => value.includes(i));
    return checkData?.length > 0;
  }

  return (
    <Form.Item
      label={
        <Text strong className="text-16px">
          {t("quan_ly_hs_co.sub_title_b")}
        </Text>
      }
      style={{ margin: 0 }}
    >
      <Select
        showSearch
        optionFilterProp="children"
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        loading={isLoadingSelect}
        style={{ width: "100%" }}
        open={visible}
        onDropdownVisibleChange={(open) => setVisible(open)}
        disabled={isDone || isLoadingSelect}
        value={
          sanPham.name_hh &&
          sanPham.ma_hs + " - " + sanPham.product_code + " - " + sanPham.name_hh
        }
        popupClassName={styles.popup}
        onSearch={(value) => setSearch(value)}
        dropdownRender={() => (
          <div className={styles.dropdown}>
            {options.map(({ label, value }) => (
              <Button
                key={value}
                type="text"
                className={styles.button}
                onClick={() => {
                  handleChangeSelect(xor(checkbox, [value]), value);
                }}
              >
                <Row gutter={[8, 8]} align="middle">
                  <Col span={2}>
                    <Checkbox
                      disabled={isDone}
                      checked={logicCheckbox(value)}
                    />
                  </Col>
                  <Col span={22} className={styles.text}>
                    <Typography.Text ellipsis>{label}</Typography.Text>
                  </Col>
                </Row>
              </Button>
            ))}
          </div>
        )}
      />
    </Form.Item>
  );
}
