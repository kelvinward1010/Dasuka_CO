import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Affix,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputProps,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import dayjs from "dayjs";
import produce from "immer";
import * as _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueries } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { customerState, staffState } from "@/components/AppFilter/index.atom";
import LoadingCalculate from "@/components/shared/LoadingCalculate";
import { SESSION_CUSTOMER, SESSION_EMPLOYEE } from "@/constant/config";
import { quotaLink } from "@/constant/links";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { useDropdownNormMultiProductCodesLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getDropdownByMultiProductCodes";
import { useDropdownNormProductCodeLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getDropdownNormProductCode";
import { getNormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import { INormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/types";
import { useCoDocument } from "@/module/quan-ly-ho-so-co-v2/api/getCoDocument";
import { useCriteria } from "@/module/quan-ly-ho-so-co-v2/api/getCriteria";
import { useDropdownStatusDetail } from "@/module/quan-ly-ho-so-co-v2/api/getDropdownStatusDetail";
import { useUpdateCoDocument } from "@/module/quan-ly-ho-so-co-v2/api/updateCoDocument";
import { UpdateUnit } from "@/module/quan-ly-ho-so-co-v2/components/UpdateUnit";
import { UpdateUnitForAll } from "@/module/quan-ly-ho-so-co-v2/components/UpdateUnitForAll";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { useDropdownExportDeclarationV2 } from "@/module/quan-ly-to-khai/export-declaration/api/getDropdownExportDeclarationV2";
import {
  getExportDeclaration,
  getExportDeclarationCO,
} from "@/module/quan-ly-to-khai/export-declaration/api/getExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";
import {
  dataLackedMaterialState,
  handleSaveCoState,
} from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import {
  chooseFormCOState,
  chooseNormState,
  dataListCriteriaState,
} from "@/store/choose/atom";
import { chooseFOBSelector } from "@/store/choose/state";
import { DataSelectedState } from "@/store/datanvl/atom";
import { quanLyHoSoCOUrl } from "@/urls";
import { sessionService } from "@/utils/storage";

import { downloadFormExplanation } from "../../api/bo-tai-lieu/downloadCODocument";
import styles from "../../style.module.scss";
import CheckCancelDeclaration from "../components/CheckCancelDeclaration";
import CheckboxShowLackedMaterial from "../components/CheckboxShowLackedMaterial";
import NotifyCO from "../components/NotifyCO";
import SelectExportDeclaration from "../components/SelectExportDeclaration";
import { CheckBoxHsco } from "../config/check-box-hsco";
import ImportNorm from "../config/import-norm";
import { selectForm } from "../fakedata/fakedata";
import { DeleteTKXKModal } from "../modals/DeleteTKXK";
import { AlertImportUsdExchange } from "./modals/AlertImportUsdExchange";
import { ChiTietBoTaiLieuCOModal } from "./modals/ChiTietBoTaiLieuCo";
import { DownloadExplained } from "./modals/DownloadExplained";
import { ReCalculateMaterial } from "./modals/ReCalculateMaterial";
import {
  dataDropdownExportState,
  isDoneCoState,
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "./state/bigA";
import {
  DanhSachSanPhamInCoTable,
  defaultValueChiTieu,
} from "./tables/danh-sach-san-pham-in-co";
import LayoutTabs from "./tabs/LayoutTabs";
import {
  checkCanSaveCOComplete,
  checkNotConversionFactor,
  getCheckedTabsOfCriteria,
  getTabsCriteria,
  handleCalculateCoDone,
  mappingNVL,
  mappingNVLFromMapped,
  mappingProduct,
} from "./utils";

const { Title, Text } = Typography;

export function ChiTietHoSoCO(): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>();
  const userRecoil = useRecoilValue(getUserSelector);

  useEffect(() => {
    document.title = "Chi tiết hồ sơ CO - " + id;
  }, [id]);

  const {
    mutate: mutateUpdateCoDocument,
    isLoading,
    isSuccess,
  } = useUpdateCoDocument({
    config: {
      onSuccess: (_, variables: any) => {
        notification.success({
          message: t("message.update_success"),
        });
        if (
          // eslint-disable-next-line eqeqeq
          variables.status_id !=
          queryClient.getQueryData<ICoDocument>(["co-documents", id])?.status_id
        )
          queryClient.invalidateQueries(["co-documents", id]);
        if (variables?.needDownForm) handleDownloadFormExplanation();
        status === "1" && navigate(quanLyHoSoCOUrl);
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const {
    data: dataDropdownNorms,
    mutate: getDataDropdownNorms,
    isLoading: isLoadingDropdownNorms,
  } = useDropdownNormMultiProductCodesLazy({});

  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const [sanPham, setSanPham] = useRecoilState(sanPhamState);
  const [isDone, setIsDone] = useRecoilState(isDoneCoState);
  const setSanPhamByMaHH = useSetRecoilState(sanPhamByMaHHState);
  const [chooseFormCo, setChooseFormCo] = useRecoilState(chooseFormCOState);
  const [listCriteria, setListCriteria] = useRecoilState(dataListCriteriaState);
  const [, setNormProduct] = useRecoilState<any>(chooseNormState);
  const [, setSelected] = useRecoilState<string[]>(DataSelectedState);
  const [, setDropdownExports] = useRecoilState<any>(dataDropdownExportState);
  const [customer, setCustomer] = useRecoilState(customerState);
  const [staff, setStaff] = useRecoilState(staffState);
  const [lackedMaterial, setLackedMaterial] = useRecoilState(
    dataLackedMaterialState,
  );

  const getChooseFOB = useRecoilValue(chooseFOBSelector);
  const sanPhamSelected = useRecoilValue(sanPhamSelector);

  const [values, setValues] = useState<any>();
  const [dateHs, setDateHs] = useState<dayjs.Dayjs | null>(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [select, setSelect] = useState<string[]>([]);
  const [tt, setTt] = useState(false);
  const [productsSelected, setProductSelected] = useState<string[]>([]);
  const [visibleCheckbox, setVisibleCheckbox] = useState(false);
  const [soCO, setSoCO] = useState<string>("");
  const [currentCustomer, setCurrentCustomer] = useState<any>();
  const [textHs, setTextHs] = useState<string>("");

  const { data: dropdownStatus } = useDropdownStatusDetail({
    data: { co_document_id: id },
  });
  const { mutateAsync: getQuotasLazy } = useDropdownNormProductCodeLazy({});

  // get criteria
  useCriteria({
    params: {
      co_form_id: chooseFormCo,
      hs_code: sanPhamSelected?.sanPham?.ma_hs,
    },
    config: {
      onSuccess(data) {
        if (!data?.message) {
          if (_.find(data, (value) => value.length >= 50)) {
            setTextHs(data.join(" "));
            // setLackedMaterial(0);
            const newProducts = produce(sanPham, (draft) => {
              const index = sanPhamSelected.spIndex;
              draft[index]["tieu_chi"] = [];
              draft[index]["tcs"] = {};
            });

            setSanPham(newProducts);
            setListCriteria([]);
            return;
          }

          setTextHs("");
          setListCriteria(data);
          if (chooseFormCo !== coDocument?.co_form_id) {
            // const newProducts = produce(sanPham, (draft) => {
            //   const index = sanPhamSelected.spIndex;

            //   const listCri = getCheckedTabsOfCriteria(data);
            //   if ("tcs" in draft[index]) {
            //     listCri.forEach((cri) => {
            //       draft[index]["tcs"][cri.toLowerCase()] = {
            //         end: 1,
            //         ...draft[index]["tcs"][cri.toLowerCase()],
            //       };
            //     });

            //     draft[index]["tieu_chi"] = _.uniq([
            //       ...listCri,
            //       ...draft[index]["tieu_chi"],
            //     ]);
            //   } else {
            //     draft[index]["tcs"] = {
            //       ...listCri.map((cri) => {
            //         const item: any = {};
            //         item[cri.toLowerCase()] = {
            //           end: -1,
            //         };

            //         return item;
            //       }),
            //     };

            //     draft[index]["tieu_chi"] = listCri;
            //   }
            // });

            // setSanPham(newProducts);
            // setLackedMaterial(0);
            const newProducts = produce(sanPham, (draft) => {
              const index = sanPhamSelected.spIndex;
              draft[index]["tieu_chi"] = [];
              draft[index]["tcs"] = {};
            });

            setSanPham(newProducts);
          }
        }
      },
    },
  });

  useEffect(() => {
    if (customer.tax_code === currentCustomer?.tax_code) refetchDataCO();
    else if (
      currentCustomer &&
      customer.tax_code !== currentCustomer.tax_code
    ) {
      form.resetFields();
      setChooseFormCo("");
      setSelect([]);
      setSelected([]);
      setDateHs(dayjs());
      setSanPham([]);
      setNormProduct("");
      setSoCO("");
      setStatus("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.tax_code]);

  useEffect(() => {
    if (sanPham?.length > 0 && !isDone && customer.value) {
      getDataDropdownNorms({
        product_codes: [
          ...sanPham.map((item) => ({
            product_code: item.product_code,
            product_id: item.ma_hh,
          })),
        ],
        customer_id: customer.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanPham?.length, customer]);

  const {
    data: coDocument,
    refetch: refetchDataCO,
    isRefetching: isRefetchingCoDocument,
  } = useCoDocument({
    id: id!,
    config: {
      enabled: !!id,
      onSuccess: async (data) => {
        if (data?.message) {
          notification.info({
            message: data.message,
          });
          return;
        }
        setCurrentCustomer(customer);
        setChooseFormCo(data.co_form_id);
        const dateDoc = data?.co_document_detail?.date_hs?.split("-");
        if (dateDoc) {
          setDateHs(dayjs(`${dateDoc?.[2]}/${dateDoc?.[1]}/${dateDoc?.[0]}`));
        }
        // setSelect(_.uniq(data.co_document_detail?.sps?.map((i: any) => i.stk)));
        setSelect(_.uniq(data.co_document_detail?.number_tkx));
        setProductSelected(
          data.co_document_detail?.sps
            ?.filter((i: any) => i.sl_done_co > 0)
            ?.map((i: any) => `${i.ma_hh}???${i.stk}???${i.key}`),
        );
        setSoCO(data.co_document_number);
        setStatus(String(data.status_id));
        const cus = {
          label: data.customer_id,
          value: data.customer_id,
          tax_code: data.tax_code,
          processing_fee: data.processing_fee,
        };
        const emp = {
          label: data.employee_id,
          value: data.employee_id,
        };
        setCustomer(cus);
        setStaff(emp);
        sessionService.setStorage(SESSION_CUSTOMER, cus);
        sessionService.setStorage(SESSION_EMPLOYEE, emp);
        setIsDone(data?.status_id === 1 || data?.status_id === 8);

        // selected sản phẩm đầu tiên
        const selectedSanPham = data.co_document_detail?.sps?.[0];
        setSanPhamByMaHH({
          stk: selectedSanPham?.stk,
          ma_hh: selectedSanPham?.ma_hh,
          key: selectedSanPham?.key,
        });
        if (selectedSanPham) {
          const quota = await getQuotasLazy({
            product_code: selectedSanPham.product_code,
            customer_id: data.customer_id,
          });

          if ("dinh_muc_id" in selectedSanPham) {
            let nguyenLieuFromNorm: INormProductNumber;
            if (!selectedSanPham.nguyen_lieu) {
              nguyenLieuFromNorm = await getNormProductNumber({
                norm_id: selectedSanPham?.dinh_muc_id,
                product_number: selectedSanPham.sl_done_co,
                export_declaration_id: selectedSanPham.stk,
                form_co: chooseFormCo,
                co_document_id: Number(id) || null,
              });
              data.co_document_detail.sps[0].nguyen_lieu =
                mappingNVL(nguyenLieuFromNorm);
            } else {
              const nguyen_lieu = data.co_document_detail.sps[0].nguyen_lieu;
              data.co_document_detail.sps[0].nguyen_lieu =
                mappingNVLFromMapped(nguyen_lieu);
            }

            let countNoMapping = 0;
            data.co_document_detail.sps[0].nguyen_lieu?.forEach((i: any) => {
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

            if (quota.length > 0) setNormProduct(selectedSanPham?.dinh_muc_id);
          } else {
            const nguyenLieuFromNorm = await getNormProductNumber({
              norm_id: selectedSanPham?.dinh_muc_id,
              product_number: selectedSanPham.sl_done_co,
              export_declaration_id: selectedSanPham.stk,
              form_co: chooseFormCo,
              co_document_id: Number(id) || null,
            });
            data.co_document_detail.sps[0].dinh_muc = quota?.[0]?.label;
            data.co_document_detail.sps[0].dinh_muc_id = quota?.[0]?.value;
            data.co_document_detail.sps[0].nguyen_lieu =
              mappingNVL(nguyenLieuFromNorm);
            if (!("tcs" in selectedSanPham)) {
              data.co_document_detail.sps[0].tcs = {};
            }
            setNormProduct(quota?.[0]?.value);
          }

          setSanPham(data.co_document_detail?.sps);
        }
      },
    },
  });

  const [pageExportSize, setPageExportSize] = useState<number>(10);
  const [searchContentExport, setSearchContentExport] = useState<
    string | null
  >();
  const {
    data: dropdownExportDeclaration,
    isLoading: loadingDropdownExportDeclaration,
  } = useDropdownExportDeclarationV2({
    isDone,
    params: {
      pageIndex: 1,
      pageSize: pageExportSize,
      customer_id: customer.value,
      list_export_declaration: select.map((item) => ({
        export_declaration_id: item,
      })),
      search_content: searchContentExport,
    },
    config: {
      enabled: !!customer.value && !!status,
      onSuccess: (data) => {
        if (data) setDropdownExports(data);
      },
    },
  });

  const tkxkSelected = dropdownExportDeclaration?.filter((i) =>
    select?.includes(i.value),
  );

  const exportDeclarations = useQueries(
    tkxkSelected?.map((i) => ({
      queryKey: ["export-declaration", i.value, isDone],
      queryFn: () =>
        isDone
          ? getExportDeclarationCO({ id: i.value })
          : getExportDeclaration({ id: i.value }),
      onSuccess: (data: IExportDeclaration) => {
        const newSanPham = produce(sanPham, (draft) => {
          data?.export_declaration_detail.forEach((d) => {
            const spIndex = draft.findIndex(
              (sanPham) =>
                sanPham.stk === d.export_declaration_id &&
                sanPham.ma_hh === d.product_id,
            );
            if (spIndex === -1) return;

            draft[spIndex].co_documents = d.co_documents;
          });
        });
        setSanPham(newSanPham);
      },
    })) ?? [],
  );

  const onChangeFormCo = (value: any) => {
    setChooseFormCo(value);
  };

  const onChangeDate = (date: dayjs.Dayjs | null) => {
    date && setDateHs(date);
  };

  const [isLoadingRefresh, setIsLoadingRefresh] = useState<boolean>(false);
  const onChangeStatus = async (value: string) => {
    setStatus(value);

    if (status === "2" && value === "4") {
      setIsLoadingRefresh(true);
      let listProductsNeedShow = _.clone(sanPham);
      for (let i = 0; i < listProductsNeedShow.length; i++) {
        let listMaterialDetails = null;

        listMaterialDetails = handleCalculateCoDone(
          -1,
          _.clone(listProductsNeedShow).slice(0, i),
        );

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

      setSanPham(listProductsNeedShow);
      setIsLoadingRefresh(false);
    }
  };

  const onChangeSoCO: InputProps["onChange"] = (e) => {
    setSoCO(e.target.value);
  };

  const tieu_chi_ap_dung: { label: string; value: string }[] =
    listCriteria?.length > 0
      ? getTabsCriteria(listCriteria)
      : selectForm
          .find((i) => i.value === chooseFormCo)
          ?.tc.map((i) => ({
            label: i.tcItem,
            value: i.tcItem,
          })) ?? [];

  const sanPhamWithSTK = _.flatten(
    exportDeclarations.map((i) =>
      mappingProduct(
        i.data?.export_declaration_detail?.filter((i) => {
          if (isDone) {
            return productsSelected.includes(
              `${i.product_id}???${i.export_declaration_id}`,
            );
          } else {
            return true;
          }
        }) ?? [],
        i.data?.shipping_terms ?? "",
      ),
    ),
  );

  const handleChangeTC = (checkedValues: CheckboxValueType[]) => {
    const { ma_hh, stk, key } = sanPhamSelected.sanPham;
    const listCri = getCheckedTabsOfCriteria(listCriteria);
    const sanPhamIndex = sanPhamWithSTK.findIndex(
      (i: any) =>
        i.ma_hh === ma_hh && i.stk === stk && Number(i.key) === Number(key),
    );
    if (sanPhamIndex === -1) return;
    const selectedSanPham = sanPhamWithSTK[sanPhamIndex];

    let criterialRemoved = "";
    let spIndex = -1;
    let newSanPham = produce(sanPham, (draft) => {
      const selectedSpIndex = draft.findIndex(
        (i) =>
          i.ma_hh === selectedSanPham.ma_hh &&
          i.stk === selectedSanPham.stk &&
          Number(i.key) === Number(selectedSanPham.key),
      );
      if (selectedSpIndex === -1) return;
      spIndex = selectedSpIndex;
      if ("tieu_chi" in draft[selectedSpIndex]) {
        draft[selectedSpIndex]["tieu_chi"]?.forEach((i: string) => {
          if (checkedValues.includes(i)) return;
          criterialRemoved = i;
        });
      }

      const Ok = () => {
        delete draft[selectedSpIndex]["tcs"][
          String(criterialRemoved).toLowerCase()
        ];

        draft[selectedSpIndex]["tieu_chi"] = checkedValues;

        if (!("tcs" in draft[selectedSpIndex])) {
          draft[selectedSpIndex]["tcs"] = {};
        }
        checkedValues.forEach((i) => {
          const tc = String(i).toLowerCase();
          if (tc && tc in draft[selectedSpIndex]["tcs"]) return;
          draft[selectedSpIndex]["tcs"][tc] = {
            end: defaultValueChiTieu?.[tc] ?? -1,
            // end: defaultValueChiTieu?.[tc] ?? -1,
          };
        });
      };

      if (!listCri.includes(criterialRemoved)) Ok();
    });

    if (!listCri.includes(criterialRemoved)) setSanPham(newSanPham);
    else {
      Modal.confirm({
        title: "Cảnh báo",
        content: `Theo quy định thì mã HS: ${sanPham[spIndex]["ma_hs"]} cần phải đạt cả 2 tiêu chí. Bạn có muốn bỏ chọn tiêu chí không?`,
        onOk() {
          newSanPham = produce(newSanPham, (draft) => {
            if (spIndex < 0) return;
            delete draft[spIndex]["tcs"][
              String(criterialRemoved).toLowerCase()
            ];

            draft[spIndex]["tieu_chi"] = checkedValues;

            if (!("tcs" in draft[spIndex])) {
              draft[spIndex]["tcs"] = {};
            }
            checkedValues.forEach((i) => {
              const tc = String(i).toLowerCase();
              if (tc && tc in draft[spIndex]["tcs"]) return;
              draft[spIndex]["tcs"][tc] = {
                end: defaultValueChiTieu?.[tc] ?? -1,
                // end: defaultValueChiTieu?.[tc] ?? -1,
              };
            });
          });

          setSanPham(newSanPham);
        },
      });
    }
  };

  useEffect(() => {
    if (tt === true) {
      let newslt = select.filter((item) => !values.includes(item));
      setSelect(newslt);
      setTt(false);
    }
  }, [values, tt, productsSelected, select]);

  useEffect(() => {
    setSelected(select);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select]);

  const [, setHandleSaveCo] = useRecoilState(handleSaveCoState);
  const handleEdit = useCallback(
    (needDownForm?: boolean) => {
      if (customer.value === "") {
        notification.error({
          message: t("message.required_customer"),
        });
      } else if (staff.value === "") {
        notification.error({
          message: t("message.required_staff"),
        });
      } else if (select.length === 0) {
        notification.error({
          message: t("message.required_export"),
        });
      } else if (sanPham.length === 0) {
        notification.error({
          message: t("message.required_product"),
        });
      } else if (status === "1" && (soCO?.trim() ?? "") === "") {
        notification.error({
          message: t("message.required_number_co"),
        });
      } else if (status === "1" && !checkCanSaveCOComplete(sanPham)) {
        notification.error({
          message: t("message.required_material"),
        });
      } else if (status === "1" && checkNotConversionFactor(sanPham)) {
        notification.warning({
          message: t("message.required_conversion_factor"),
        });
      } else {
        const coDocument = {
          needDownForm,
          co_document_id: id,
          created_date: dayjs(dateHs).format("YYYY-MM-DD"),
          employee_id: staff.value,
          customer_id: customer.value,
          co_form_id: chooseFormCo,
          co_document_number: status === "1" ? soCO : undefined,
          status_id: status,
          co_document_detail: {
            form: chooseFormCo,
            date_hs: dayjs(dateHs).format("DD-MM-YYYY"),
            staff: staff.value,
            customer: customer.value,
            status: status,
            number_tkx: select,
            number_tkx_with_shipping_terms: select.map((i) =>
              dropdownExportDeclaration?.find((j) => j.value === i),
            ),
            sps: sanPham,
          },
          lu_user_id: userRecoil.user_id,
        };

        let normWithoutUsdExchangeRate = _.chain(
          coDocument.co_document_detail.sps?.map((sp) =>
            sp.nguyen_lieu?.map((nl: any) =>
              nl.norm_vat_invoice_import_declaration?.filter(
                (ip: any) => ip.usd_exchange_rate <= 0,
              ),
            ),
          ),
        )
          .flattenDeep()
          .remove(undefined)
          .value();

        if (normWithoutUsdExchangeRate.length > 0) {
          const arrayWithImportDeclarations = _.chain(
            normWithoutUsdExchangeRate.filter(
              (item) => item.import_declaration_id,
            ),
          )
            .uniqBy("import_declaration_id")
            .value();
          const arrayWithVats = _.chain(
            normWithoutUsdExchangeRate.filter((item) => item.vat_invoice_id),
          )
            .uniqBy("vat_invoice_id")
            .value();

          normWithoutUsdExchangeRate = [
            ...arrayWithImportDeclarations,
            ...arrayWithVats,
          ];

          modal.confirm({
            title: "Bạn chưa nhập tỷ giá trong tờ khai nhập, vui lòng cập nhật",
            icon: <ExclamationCircleFilled />,
            content: (
              <AlertImportUsdExchange
                importDeclarations={normWithoutUsdExchangeRate}
              />
            ),
            onOk() {
              mutateUpdateCoDocument(coDocument);
            },
            okText: "Vẫn lưu",
          });
        } else mutateUpdateCoDocument(coDocument);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      customer,
      staff,
      select,
      status,
      sanPham,
      chooseFormCo,
      id,
      soCO,
      dateHs,
      userRecoil.user_id,
      dropdownExportDeclaration,
      modal,
    ],
  );

  useEffect(() => {
    setHandleSaveCo(() => handleEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleEdit]);

  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [openUpdateAllUnits, setOpenUpdateAllUnits] = useState<boolean>(false);
  const handleDownloadFormExplanation = () => {
    if (!getChooseFOB) {
      notification.warning({
        message: "Vui lòng nhập giá FOB!",
      });
      return;
    }
    if (checkNotConversionFactor(sanPham)) {
      notification.warning({
        message: "Bạn cần chuyển đổi đơn vị trước.",
      });
      setOpenUpdateAllUnits(true);
      return;
    }
    if (id) {
      setIsLoadingExplanation(true);
      downloadFormExplanation(id)
        .then(() => setIsLoadingExplanation(false))
        .catch((err) => {
          setIsLoadingExplanation(false);
          notification.error({
            message: t("message.error"),
            description: err.message,
          });
        });
    }
  };

  const handleChangeTypePSR = (e: number) => {
    const psr = sanPhamSelected.sanPham?.tcs?.psr;

    if (!psr) return;

    const newProducts = produce(sanPham, (draft) => {
      if (!draft[sanPhamSelected.spIndex]?.tcs)
        draft[sanPhamSelected.spIndex].tcs = {};

      if (!draft[sanPhamSelected.spIndex].tcs?.psr)
        draft[sanPhamSelected.spIndex].tcs.psr = {};

      draft[sanPhamSelected.spIndex].tcs.psr.type = e;
    });

    setSanPham(newProducts);
  };

  return (
    <div>
      <CheckCancelDeclaration />
      {isLoadingRefresh && <LoadingCalculate />}
      <Spin spinning={!coDocument || isRefetchingCoDocument}>
        <AppFilter isCustomer isStaff hasAll={false} isDisabled={isDone} />
        <Affix offsetTop={42}>
          <Row
            justify={"space-between"}
            className={styles.quan_ly_ho_so_co_head}
          >
            <Col span={14}>
              <Title level={4}>{t("quan_ly_hs_co.detail.title")}</Title>
            </Col>
            <Col>
              <ReCalculateMaterial
                id={id}
                handleSave={handleEdit}
                isLoadingSave={isLoading}
                isSuccess={isSuccess}
                isDone={isDone}
              />
              <Link to={"/quan-ly-ho-so-c-o"}>
                <Button
                  className={styles.button + " " + styles.button_cancel}
                  style={{ marginRight: 0, marginLeft: 10 }}
                >
                  {t("for_all.button_cancel")}
                </Button>
              </Link>
              <Button
                type="primary"
                onClick={() => handleEdit()}
                className={styles.button + " " + styles.button_create}
                disabled={isDone}
                style={{ marginRight: 0, marginLeft: 10 }}
                loading={isLoading}
              >
                {t("for_all.button_save")}
              </Button>
            </Col>
          </Row>
        </Affix>
        <div className={styles.chi_tiet_ho_so_co}>
          <Row justify={"space-between"}>
            <Col span={10}>
              <Text strong className="text-16px">
                {t("quan_ly_hs_co.sub_title_a")}
              </Text>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <ChiTietBoTaiLieuCOModal isDone={isDone} />
            </Col>
          </Row>
          <div
            className={styles.top_add_detail_hs}
            style={{ marginBottom: 10 }}
          >
            <Form form={form} layout={"vertical"}>
              <Row justify={"space-between"} wrap={true}>
                <Col span={7}>
                  <Form.Item
                    label="Tờ khai xuất khẩu"
                    rules={[...RULES_FORM.required]}
                    required
                  >
                    <SelectExportDeclaration
                      isDone={isDone}
                      styles={styles}
                      select={select}
                      setSelect={setSelect}
                      setValues={setValues}
                      setIsModalOpen={setIsModalOpen}
                      loadingDropdownExportDeclaration={
                        loadingDropdownExportDeclaration
                      }
                      dropdownExportDeclaration={dropdownExportDeclaration}
                      setPageExportSize={setPageExportSize}
                      setSearchContentExport={setSearchContentExport}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="Form C/O"
                    rules={[...RULES_FORM.required]}
                    required
                  >
                    <Select
                      showSearch
                      disabled={isDone}
                      placeholder="Form"
                      value={chooseFormCo}
                      optionFilterProp="children"
                      onChange={onChangeFormCo}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={selectForm}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="Ngày tạo"
                    rules={[...RULES_FORM.required]}
                    required
                  >
                    <DatePicker
                      allowClear={false}
                      onChange={onChangeDate}
                      format={"DD-MM-YYYY"}
                      value={dateHs}
                      className={styles.date_pick}
                      name="date"
                      disabled={isDone}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="Trạng thái"
                    rules={[...RULES_FORM.required]}
                    required
                  >
                    <Select
                      disabled={isDone}
                      showSearch
                      placeholder="Form"
                      optionFilterProp="children"
                      onChange={onChangeStatus}
                      value={status}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={dropdownStatus?.filter(
                        (status) => status.value !== "5",
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Số C/O">
                    <Input
                      type="text"
                      disabled={status !== "1" || isDone}
                      // disabled={status !== "1"}
                      value={soCO}
                      onChange={onChangeSoCO}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div>
              <Form form={form} layout={"vertical"}>
                <Row
                  justify={"space-between"}
                  className={styles.checkbox_hscospbox}
                >
                  <Col style={{ width: "64.7%" }}>
                    <CheckBoxHsco
                      sanPhamWithSTK={sanPhamWithSTK}
                      checkbox={productsSelected}
                      setCheckbox={setProductSelected}
                      visible={visibleCheckbox}
                      setVisible={setVisibleCheckbox}
                      getQuotasLazy={getQuotasLazy}
                    />
                  </Col>
                  <Col style={{ display: "flex", width: "34.3%" }}>
                    <Form.Item label=" " style={{ marginTop: "2px" }}>
                      <Space>
                        <ImportNorm
                          isEnabled={true}
                          isDone={isDone}
                          getQuotasLazy={getQuotasLazy}
                          getDataDropdownNorms={getDataDropdownNorms}
                        />
                        <Button type="link" href={quotaLink} target="_blank">
                          Tải mẫu định mức chuẩn
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Text strong>
                {t("quan_ly_hs_co.sub_title_c")} ({sanPham?.length || 0} sản
                phẩm)
              </Text>
              <DanhSachSanPhamInCoTable
                sanPhamWithSTK={sanPhamWithSTK}
                getQuotasLazy={getQuotasLazy}
                setNormProduct={setNormProduct}
                dropdownExportDeclarations={dropdownExportDeclaration}
                dataDropdownNorms={dataDropdownNorms}
                isLoadingDropdownNorms={isLoadingDropdownNorms}
              />
            </div>
          </div>
          <NotifyCO />
          <div className={styles.hs_sp} style={{ marginTop: 10 }}>
            <div className={styles.box_checkbox_tc} style={{ marginTop: 0 }}>
              <Text strong>{t("quan_ly_hs_co.sub_title_d")}</Text>
              <Checkbox.Group
                className={styles.checkbox_tc}
                onChange={handleChangeTC}
                value={sanPhamSelected.sanPham?.tieu_chi ?? []}
                disabled={isDone}
              >
                {tieu_chi_ap_dung.map((i, index) => (
                  <React.Fragment key={i.value}>
                    <Checkbox key={i.value} value={i.value}>
                      {i.label}
                    </Checkbox>
                    {i.value === "PSR" && (
                      <Select
                        disabled={isDone}
                        key={i.value + index}
                        size="small"
                        value={sanPhamSelected?.sanPham?.tcs?.psr?.type || 4}
                        onSelect={handleChangeTypePSR}
                        options={[
                          { label: "4 số", value: 4 },
                          { label: "6 số", value: 6 },
                        ]}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Checkbox.Group>

              {textHs && (
                <Typography.Paragraph
                  title={textHs}
                  style={{ marginBottom: 0, marginLeft: 16, flex: "1 0 0" }}
                  type="warning"
                  strong
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: (
                      <b
                        onClick={(event) => {
                          event.stopPropagation();
                          Modal.info({
                            width: "60vw",
                            title: "Thông tin",
                            content: textHs,
                          });
                        }}
                      >
                        Xem thêm
                      </b>
                    ),
                  }}
                >
                  {textHs}
                </Typography.Paragraph>
              )}
            </div>
            <div className={styles.thd_top}>
              <Row justify={"end"}>
                <Col
                  style={{ marginRight: 10, marginBottom: -35, zIndex: 4 }}
                  // className={styles.box_down_form_gt}
                >
                  <CheckboxShowLackedMaterial lackedMaterial={lackedMaterial} />
                </Col>
                <Col
                  style={{ marginRight: 10, marginBottom: -35 }}
                  // className={styles.box_down_form_gt}
                >
                  <UpdateUnitForAll
                    openModal={openUpdateAllUnits}
                    setOpenModal={setOpenUpdateAllUnits}
                    handleSaveCo={handleEdit}
                  />
                  <UpdateUnit isDone={isDone} />
                </Col>
                <Col
                  style={{ marginBottom: -35 }}
                  // className={styles.box_down_form_gt}
                >
                  <DownloadExplained
                    isLoading={isLoadingExplanation}
                    handleDownload={handleDownloadFormExplanation}
                    handleSaveCo={handleEdit}
                    status={status}
                    isDone={isDone}
                    setStatus={setStatus}
                  />
                </Col>
              </Row>
              {sanPhamSelected.spIndex > -1 && (
                <LayoutTabs check_tabs={sanPhamSelected?.sanPham?.tieu_chi} />
              )}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <DeleteTKXKModal
            status={isModalOpen}
            setCheckbox={setProductSelected}
            setModal={setIsModalOpen}
            value={values}
            st={setTt}
          />
        )}
        {contextHolder}
      </Spin>
    </div>
  );
}
