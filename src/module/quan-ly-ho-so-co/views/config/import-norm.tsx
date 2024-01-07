import { Button, Form, Upload, UploadProps, notification } from "antd";
import { UploadFile } from "antd/lib/upload";
import produce from "immer";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { removeVietnameseTones } from "@/apis/useUploadFile";
import { customerState } from "@/components/AppFilter/index.atom";
import LoadingCalculate from "@/components/shared/LoadingCalculate";
import { queryClient } from "@/lib/react-query";
import { getNormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import { useImportNorm } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/importNorm";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import { chooseNormState } from "@/store/choose/atom";
import { chooseFormCOSelector } from "@/store/choose/state";

import { ExistingNormModal } from "../chi-tiet-ho-so-co/modals/ExistingNormModal";
import { ListErrorNormModal } from "../chi-tiet-ho-so-co/modals/ListErrorNormModal";
import {
  dataDropdownExportState,
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "../chi-tiet-ho-so-co/state/bigA";
import { handleCalculateCoDone, mappingNVL } from "../chi-tiet-ho-so-co/utils";

interface Props {
  isEnabled: boolean;
  isDone?: boolean;
  getQuotasLazy: any;
  getDataDropdownNorms: any;
}

export default function ImportNorm({
  isEnabled,
  isDone = false,
  getQuotasLazy,
  getDataDropdownNorms,
}: Props): JSX.Element {
  const { id } = useParams();
  const coDocument = queryClient.getQueryData<ICoDocument>([
    "co-documents",
    id,
  ]);
  const { t } = useTranslation();
  const [listFiles, setListFiles] = useState<UploadFile<Blob>[]>([]);
  const customer = useRecoilValue(customerState);
  const setSanPhamByMaHH = useSetRecoilState(sanPhamByMaHHState);
  const setNormProduct = useSetRecoilState(chooseNormState);
  const [listErrorItems, setListErrorItems] = useState<any[]>([]);
  const [listExistingItems, setListExistingItems] = useState<any[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const sanPhamSelected = useRecoilValue(sanPhamSelector);
  const userRecoil = useRecoilValue(getUserSelector);
  const dropdownExports = useRecoilValue(dataDropdownExportState);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState<boolean>(false);

  const importNorm = useImportNorm({
    config: {
      onSuccess: async (data) => {
        let existingItems: any[] = [];
        data?.added_norms?.forEach((norm) => {
          notification.success({
            message: `Thêm định mức ${norm.norm_name} thành công!`,
          });
        });

        existingItems =
          data?.existing_norms?.map((norm, index) => ({
            ...norm,
            key: index,
            file: listFiles.find(
              (f) => removeVietnameseTones(f.name) === norm.file,
            ),
          })) || [];

        setListFiles([]);
        setListErrorItems(data?.errors || []);
        setShowErrorModal(data?.errors?.length > 0);
        setListExistingItems(existingItems);

        if (data?.added_norms?.length > 0) {
          const indexChanged: number[] = [];
          const newSanPham = produce(sanPhams, (draft) => {
            data?.added_norms.forEach((norm) => {
              const normName = norm?.norm_name?.split("=>")?.[1];
              const index = draft.findIndex(
                (i) => normName.indexOf(i.product_code) > -1,
              );

              if (index === -1) return;
              indexChanged.push(index);
              draft[index].dinh_muc = norm.norm_name;
              draft[index].dinh_muc_id = norm.norm_id;
            });
          });

          handleRefreshProduct(newSanPham, indexChanged);
        }
      },
      onError: (err) => {
        setListFiles([]);
        notification.error({
          message: "Lỗi",
          description: err.response?.data.error,
        });
      },
    },
  });

  const handleRefreshProduct = async (products: any[], __: number[]) => {
    const { ma_hh, stk, key } = sanPhamSelected.sanPham;
    const sanPhamIndex = products.findIndex(
      (i) => i.ma_hh === ma_hh && i.stk === stk && i.key === key,
    );
    if (sanPhamIndex === -1) return;
    const currentProduct = products[sanPhamIndex];
    setSanPhamByMaHH({
      stk: currentProduct.stk,
      ma_hh: currentProduct.ma_hh,
      key: currentProduct.key,
    });

    let newSanPhams = _.clone(products);
    setIsLoadingRefresh(true);
    for (let i = 0; i < products.length; i++) {
      const listMaterialDetails = handleCalculateCoDone(
        -1,
        _.clone(newSanPhams).slice(0, i),
      );
      let selectedSanPham = products[i];
      if ("dinh_muc_id" in selectedSanPham) {
        const nguyenLieu = await getNormProductNumber({
          norm_id: selectedSanPham.dinh_muc_id,
          product_number: selectedSanPham.sl_done_co,
          export_declaration_id: selectedSanPham.stk,
          list_json_material_detail: listMaterialDetails,
          list_json_nguyen_lieus:
            // eslint-disable-next-line eqeqeq
            coDocument?.status_id == 4 ? selectedSanPham.nguyen_lieu : null,
          form_co: chooseFormCo,
          co_document_id: Number(id) || null,
          running_style: "dinhmuc",
        });

        newSanPhams = produce(newSanPhams, (draft) => {
          draft[i].nguyen_lieu = mappingNVL(nguyenLieu);
          if (i === sanPhamIndex) {
            let countNoMapping = 0;
            draft[sanPhamIndex].nguyen_lieu?.forEach((i: any) => {
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
            setNormProduct(selectedSanPham.dinh_muc_id);
          }
          if (!("tcs" in draft[i])) {
            draft[i]["tcs"] = {};
          }
        });
        await getDataDropdownNorms({
          product_codes: [
            ...products.map((item) => ({
              product_code: item.product_code,
              product_id: item.ma_hh,
            })),
          ],
          customer_id: customer.value,
        });
      } else {
        const quota = await getQuotasLazy({
          customer_id: customer.value,
          product_code: selectedSanPham.product_code,
        });
        const nguyenLieu = await getNormProductNumber({
          norm_id: quota[0]?.value,
          product_number: selectedSanPham.sl_done_co,
          export_declaration_id: selectedSanPham.stk,
          list_json_material_detail: listMaterialDetails,
          list_json_nguyen_lieus: null,
          form_co: chooseFormCo,
          co_document_id: Number(id) || null,
          running_style: "dinhmuc",
        });

        newSanPhams = produce(products, (draft) => {
          draft[i].dinh_muc = quota[0]?.label;
          draft[i].dinh_muc_id = quota[0]?.value;
          draft[i].nguyen_lieu = mappingNVL(nguyenLieu);
          if (!("tcs" in draft[i])) {
            draft[i]["tcs"] = {};
          }
        });

        getDataDropdownNorms({
          product_codes: [
            ...sanPhams.map((item) => ({
              product_code: item.product_code,
              product_id: item.ma_hh,
            })),
          ],
          customer_id: customer.value,
        });
      }
      setSanPhams(newSanPhams);
    }
    setIsLoadingRefresh(false);
  };

  useEffect(() => {
    if (listFiles.length > 10) {
      notification.info({
        message: t("message.over_files"),
      });
      setListFiles([]);
      return;
    }
    if (listFiles?.length > 0) {
      const formData = new FormData();
      // const fileName = removeVietnameseTones(fileList[0].name);
      listFiles.forEach((file) => {
        formData.append(
          "files",
          file as unknown as Blob,
          removeVietnameseTones(file.name),
        );
      });
      formData.append("customer_id", customer?.value);
      formData.append("tax_code", customer?.tax_code);
      formData.append("created_by_user_id", userRecoil.user_id);
      formData.append("is_overwrite_mode", "0");
      formData.append(
        "list_product",
        JSON.stringify(
          sanPhams.map((product) => ({
            product_code: product.product_code,
            export_licence_number: _.find(dropdownExports, {
              value: product?.stk,
            })?.export_licence_number,
            product_name: product.name_hh,
          })),
        ),
      );

      importNorm.mutate(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFiles]);

  const uploadProps: UploadProps = {
    beforeUpload: (_, ListFile) => {
      setListFiles([...listFiles, ...ListFile]);

      return false;
    },
    showUploadList: false,
    maxCount: 5,
    multiple: true,
    accept: ".xlsx, .xls, .csv",
  };

  return (
    <>
      {listErrorItems?.length > 0 && showErrorModal && (
        <ListErrorNormModal
          showModal={showErrorModal}
          setShowModal={setShowErrorModal}
          listItems={listErrorItems}
          setList={setListErrorItems}
        />
      )}
      {listExistingItems?.length > 0 && !showErrorModal && (
        <ExistingNormModal
          listItems={listExistingItems}
          setList={setListExistingItems}
          handleRefreshProduct={handleRefreshProduct}
        />
      )}
      {isLoadingRefresh && <LoadingCalculate />}
      <Form.Item style={{ textAlign: "right", padding: 0, margin: 0 }}>
        <Upload
          {...uploadProps}
          disabled={isDone || !isEnabled || importNorm.isLoading}
        >
          <Button
            loading={importNorm.isLoading}
            className={
              "bttn-open-tlco button " +
              `${isDone || !isEnabled ? "button_disabled" : "button_primary"}`
            }
            disabled={isDone || !isEnabled}
            style={{ width: "100%" }}
          >
            {t("for_all.button_create")} định mức
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
}
