/* eslint-disable react-hooks/exhaustive-deps */
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
  Typography,
  notification,
} from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import dayjs from "dayjs";
import { produce } from "immer";
import * as _ from "lodash/fp";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueries } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { customerState, staffState } from "@/components/AppFilter/index.atom";
import { quotaLink } from "@/constant/links";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { useDropdownNormMultiProductCodesLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getDropdownByMultiProductCodes";
import { useDropdownNormProductCodeLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getDropdownNormProductCode";
import { useCreateCoDocument } from "@/module/quan-ly-ho-so-co-v2/api/createCoDocument";
import { useCriteria } from "@/module/quan-ly-ho-so-co-v2/api/getCriteria";
import { useDropdownStatusDetail } from "@/module/quan-ly-ho-so-co-v2/api/getDropdownStatusDetail";
import { UpdateUnit } from "@/module/quan-ly-ho-so-co-v2/components/UpdateUnit";
import { useDropdownExportDeclarationV2 } from "@/module/quan-ly-to-khai/export-declaration/api/getDropdownExportDeclarationV2";
import { getExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/api/getExportDeclaration";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import { chooseNormState, dataListCriteriaState } from "@/store/choose/atom";
import { DataSelectedState } from "@/store/datanvl/atom";
import { getChiTietHoSoCOUrl } from "@/urls";

import styles from "../../style.module.scss";
import { ChiTietBoTaiLieuCOModal } from "../chi-tiet-ho-so-co/modals/ChiTietBoTaiLieuCo";
import {
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "../chi-tiet-ho-so-co/state/bigA";
import {
  DanhSachSanPhamInCoTable,
  defaultValueChiTieu,
} from "../chi-tiet-ho-so-co/tables/danh-sach-san-pham-in-co";
import LayoutTabs from "../chi-tiet-ho-so-co/tabs/LayoutTabs";
import {
  checkCanSaveCOComplete,
  checkNotConversionFactor,
  getCheckedTabsOfCriteria,
  getTabsCriteria,
  mappingProduct,
} from "../chi-tiet-ho-so-co/utils";
import NotifyCO from "../components/NotifyCO";
import SelectExportDeclaration from "../components/SelectExportDeclaration";
import { CheckBoxHsco } from "../config/check-box-hsco";
import ImportNorm from "../config/import-norm";
import { selectForm } from "../fakedata/fakedata";
import { DeleteTKXKModal } from "../modals/DeleteTKXK";

const { Title, Text } = Typography;

export function ThemMoiHoSoCO(): JSX.Element {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Thêm mới hồ sơ CO";
  }, []);

  const { mutate: mutateCreateCoDocument, isLoading } = useCreateCoDocument({
    config: {
      onSuccess: (data) => {
        if (data.status === 1) {
          if (data?.results?.[0]?.co_document_id) {
            navigate(getChiTietHoSoCOUrl(data?.results?.[0]?.co_document_id));
            notification.success({
              message: data.message,
            });
            resetSanPhamState();
          } else {
            notification.error({
              message: t("message.create_failure"),
            });
          }
        } else {
          notification.error({
            message: t("message.create_failure"),
            description: data.message,
          });
        }
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
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

  const { mutateAsync: getQuotasLazy } = useDropdownNormProductCodeLazy({});
  const { data: dropdownStatus } = useDropdownStatusDetail({
    data: { co_document_id: null },
  });

  const [sanPham, setSanPham] = useRecoilState(sanPhamState);
  const sanPhamSelected = useRecoilValue(sanPhamSelector);
  const resetSanPhamSelected = useResetRecoilState(sanPhamByMaHHState);
  const resetSanPhamState = useResetRecoilState(sanPhamState);
  const [form] = Form.useForm();
  const [values, setValues] = useState<any>();
  const [chooseFormCo, setChooseFormCo] = useState("B");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [select, setSelect] = useState<string[]>([]);
  const [tt, setTt] = useState(false);
  const [checkbox, setCheckbox] = useState<string[]>([]);
  const [visibleCheckbox, setVisibleCheckbox] = useState(false);
  const [dateHs, setDateHs] = useState<dayjs.Dayjs | null>(dayjs());
  const [status, setStatus] = useState<string>("2");
  const [, setNormProduct] = useRecoilState<any>(chooseNormState);
  const [soCO, setSoCO] = useState<string>();
  const customer = useRecoilValue(customerState);
  const staff = useRecoilValue(staffState);
  const navigate = useNavigate();
  const [, setSelected] = useRecoilState<string[]>(DataSelectedState);
  const [listCriteria, setListCriteria] = useRecoilState(dataListCriteriaState);
  const userRecoil = useRecoilValue(getUserSelector);
  const resetLackedMaterial = useResetRecoilState(dataLackedMaterialState);
  const [textHs, setTextHs] = useState<string>("");

  useEffect(() => {
    form.resetFields();
    setChooseFormCo("B");
    setSelect([]);
    setSelected([]);
    setDateHs(dayjs());
    setSanPham([]);
    setNormProduct("");
    setSoCO("");
    setStatus("2");
    resetLackedMaterial();
  }, [customer.tax_code]);

  useEffect(() => {
    if (sanPham?.length > 0 && customer.value) {
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
  }, [sanPham?.length, customer.value]);

  // get criteria
  useCriteria({
    params: {
      co_form_id: chooseFormCo,
      hs_code: sanPhamSelected?.sanPham?.ma_hs,
    },
    config: {
      onSuccess(data) {
        if (!data?.message) {
          if (_.find(data, (value: any) => value.length >= 50)) {
            setTextHs(data.join(" "));
          }
          const newProducts = produce(sanPham, (draft) => {
            const index = sanPhamSelected.spIndex;
            if (draft?.[index]) {
              draft[index]["tieu_chi"] = [];
              draft[index]["tcs"] = {};
            }
          });

          setTextHs("");
          setSanPham(newProducts);
          setListCriteria(data);
        }
      },
    },
  });

  // const {
  //   data: dropdownExportDeclaration,
  //   isLoading: loadingDropdownExportDeclaration,
  // } = useDropdownExportDeclaration({
  //   customerId: customer.value,
  //   config: {
  //     enabled: !!customer.value,
  //   },
  // });
  const [pageExportSize, setPageExportSize] = useState<number>(10);
  const [searchContentExport, setSearchContentExport] = useState<
    string | null
  >();
  const {
    data: dropdownExportDeclaration,
    isLoading: loadingDropdownExportDeclaration,
  } = useDropdownExportDeclarationV2({
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
    },
  });

  const tkxkSelected = dropdownExportDeclaration?.filter((i) =>
    select?.includes(i.value),
  );

  const exportDeclarations = useQueries(
    tkxkSelected?.map((i) => ({
      queryKey: ["export-declaration", i.value],
      queryFn: () => getExportDeclaration({ id: i.value }),
    })) ?? [],
  );

  // TODO: sanpham selector
  const onChangeFormCo = (value: any) => {
    setChooseFormCo(value);
  };

  const onSearch = (value: any) => {
    console.log("search:", value.target?.value);
  };

  const onChangeDate = (date: dayjs.Dayjs | null) => {
    date && setDateHs(date);
  };

  const onChangeStatus = (value: string) => {
    setStatus(value);
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
        i.data?.export_declaration_detail ?? [],
        i.data?.shipping_terms ?? "",
      ),
    ),
  );

  // const handleChangeDM = async (
  //   norm_id: string | number,
  //   norm_name?:
  //     | string
  //     | { label: string; value: string }
  //     | { label: string; value: string }[],
  // ) => {
  //   const { ma_hh, stk } = sanPhamSelected.sanPham;
  //   const sanPhamIndex = sanPhamWithSTK.findIndex(
  //     (i: any) => i.ma_hh === ma_hh && i.stk === stk,
  //   );
  //   if (sanPhamIndex === -1) return;
  //   const selectedSanPham = sanPhamWithSTK[sanPhamIndex];
  //   const nguyenLieu = await getNormProductNumber({
  //     norm_id,
  //     product_number: selectedSanPham.sl_done_co,
  //   });

  //   const newSanPham = produce(sanPham, (draft) => {
  //     const selectedSpIndex = draft.findIndex(
  //       (i) =>
  //         i.ma_hh === selectedSanPham.ma_hh && i.stk === selectedSanPham.stk,
  //     );
  //     if (selectedSpIndex === -1) return;
  //     draft[selectedSpIndex]["dinh_muc"] =
  //       typeof norm_name === "string"
  //         ? norm_name
  //         : dataQuotas?.find((i) => i.value === norm_id)?.label ?? "";
  //     draft[selectedSpIndex]["dinh_muc_id"] = norm_id;
  //     draft[selectedSpIndex]["nguyen_lieu"] = mappingNVL(nguyenLieu);
  //     console.log(draft[selectedSpIndex]["nguyen_lieu"]);
  //     if (!("tcs" in draft[selectedSpIndex])) {
  //       draft[selectedSpIndex]["tcs"] = {};
  //     }
  //   });
  //   if (typeof norm_name === "string") {
  //     setNormProduct(norm_name);
  //   } else {
  //     setNormProduct(dataQuotas?.find((i) => i.value === norm_id)?.label ?? "");
  //   }
  //   setSanPham(newSanPham);
  // };

  const handleChangeTC = (checkedValues: CheckboxValueType[]) => {
    const { ma_hh, stk, key } = sanPhamSelected.sanPham;
    const listCri = getCheckedTabsOfCriteria(listCriteria);
    const sanPhamIndex = sanPhamWithSTK.findIndex(
      (i) =>
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
          i.key === selectedSanPham.key,
      );
      if (selectedSpIndex === -1) return;
      if ("tieu_chi" in draft[selectedSpIndex]) {
        draft[selectedSpIndex]["tieu_chi"].forEach((i: string) => {
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
      setSelected(newslt);
      setTt(false);
    }
  }, [values, tt, select]);

  function handleSave() {
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
      // } else if (!sanPham.every((i) => i.dinh_muc_id !== undefined)) {
      //   notification.error({
      //     message: "Vui lòng chọn định mức cho tất cả sản phẩm",
      //   });
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
      mutateCreateCoDocument({
        created_date: dayjs(dateHs).format("YYYY-MM-DD"),
        employee_id: staff.value,
        customer_id: customer.value,
        co_form_id: chooseFormCo,
        status_id: status,
        co_document_number: soCO,
        co_document_detail: {
          form: chooseFormCo,
          date_hs: dayjs(dateHs).format("DD-MM-YYYY"),
          staff: staff.value,
          customer: customer.value,
          status: status,
          sps: sanPham,
          number_tkx: select,
          number_tkx_with_shipping_terms: select.map((i) =>
            dropdownExportDeclaration?.find((j) => j.value === i),
          ),
        },
        created_by_user_id: userRecoil.user_id,
      });
    }
  }

  useEffect(() => {
    resetSanPhamSelected();
    resetSanPhamState();
  }, []);

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
      <AppFilter isCustomer isStaff hasAll={false} />
      <Affix offsetTop={42}>
        <Row justify={"space-between"} className={styles.quan_ly_ho_so_co_head}>
          <Col span={20}>
            <Title level={4}>{t("quan_ly_hs_co.them_moi_hs.title_main")}</Title>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Link to={"/quan-ly-ho-so-c-o"}>
              <Button className={styles.button + " " + styles.button_cancel}>
                {t("for_all.button_cancel")}
              </Button>
            </Link>
            <Button
              type="primary"
              onClick={handleSave}
              className={styles.button + " " + styles.button_save}
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
            <ChiTietBoTaiLieuCOModal isCreate={true} />
          </Col>
        </Row>
        <div className={styles.top_add_detail_hs} style={{ marginBottom: 10 }}>
          <Form form={form} layout={"vertical"}>
            <Row justify={"space-between"}>
              <Col span={7}>
                <Form.Item
                  label={t("quan_ly_hs_co.them_moi_hs.sl_tkxk")}
                  rules={[...RULES_FORM.required]}
                  required
                >
                  <SelectExportDeclaration
                    // isDone={isDone}
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
                  label={t("quan_ly_hs_co.them_moi_hs.sl_form_co")}
                  initialValue={"Form B"}
                  rules={[...RULES_FORM.required]}
                  required
                >
                  <Select
                    showSearch
                    placeholder="Form"
                    optionFilterProp="children"
                    defaultValue={"Form B"}
                    onChange={onChangeFormCo}
                    onSearch={onSearch}
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
                  label={t("quan_ly_hs_co.them_moi_hs.sl_date_hs")}
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
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label={t("quan_ly_hs_co.them_moi_hs.sl_status")}
                  rules={[...RULES_FORM.required]}
                  required
                >
                  <Select
                    showSearch
                    placeholder="Form"
                    optionFilterProp="children"
                    value={status}
                    onSearch={onSearch}
                    onChange={onChangeStatus}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={dropdownStatus}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label={t("quan_ly_hs_co.them_moi_hs.so_co")}>
                  {/* TODO: move check status string to check enum */}
                  <Input
                    type="text"
                    disabled={status !== "1"}
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
                  {/* Products checkbox of export declarations */}
                  <CheckBoxHsco
                    sanPhamWithSTK={sanPhamWithSTK}
                    checkbox={checkbox}
                    setCheckbox={setCheckbox}
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
              {t("quan_ly_hs_co.sub_title_c")} ({sanPham?.length || 0} sản phẩm)
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
            {textHs ? (
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
            ) : (
              <Checkbox.Group
                className={styles.checkbox_tc}
                onChange={handleChangeTC}
                value={sanPhamSelected.sanPham?.tieu_chi ?? []}
              >
                {tieu_chi_ap_dung.map((i, index) => (
                  <React.Fragment key={i.value}>
                    <Checkbox key={i.value} value={i.value}>
                      {i.label}
                    </Checkbox>
                    {i.value === "PSR" && (
                      <Select
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
            )}
          </div>
          <div className={styles.thd_top}>
            <Row justify={"end"}>
              <Col
                style={{ marginRight: 160 }}
                className={styles.box_down_form_gt}
              >
                <UpdateUnit />
              </Col>
              <Col className={styles.box_down_form_gt}>
                <Button
                  className={"button button_download"}
                  style={{ zIndex: 2 }}
                >
                  {t("quan_ly_hs_co.them_moi_hs.title_dl_form_gt")}
                </Button>
              </Col>
            </Row>

            {/* TABs */}
            {sanPhamSelected.spIndex > -1 && (
              <LayoutTabs check_tabs={sanPhamSelected?.sanPham?.tieu_chi} />
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <DeleteTKXKModal
          status={isModalOpen}
          setCheckbox={setCheckbox}
          setModal={setIsModalOpen}
          value={values}
          st={setTt}
        />
      )}
    </div>
  );
}
