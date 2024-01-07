import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  FormListFieldData,
  Input,
  Modal,
  Row,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import produce from "immer";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getNormProductNumber } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/getNormProductNumber";
import {
  sanPhamByMaHHState,
  sanPhamState,
} from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { mappingNVL } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/utils";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import { chooseFormCOSelector } from "@/store/choose/state";

import { useCreateCoUnit } from "../api/createCoUnit";
import styles from "../style.module.scss";

export function UpdateUnitForAll({
  openModal,
  setOpenModal,
  handleSaveCo,
}: {
  openModal: boolean;
  setOpenModal: any;
  handleSaveCo: (needDownForm?: boolean) => void;
}): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [letSave, setLetSave] = useState<boolean>(false);
  const [normVatImport, setNormVatImport] = useState<any[]>([]);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const userRecoil = useRecoilValue(getUserSelector);
  const sanPhamByMaHH = useRecoilValue(sanPhamByMaHHState);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);

  useEffect(() => {
    if (sanPhams?.length > 0) {
      let array: any[] = [];
      sanPhams.forEach((sanPham) => {
        sanPham?.nguyen_lieu?.forEach((material: any) => {
          if (material.norm_vat_invoice_import_declaration) {
            array = [...array, ...material.norm_vat_invoice_import_declaration];
          }
        });
      });

      setNormVatImport(
        _.orderBy(
          [
            ..._.chain(
              array.filter(
                (item) =>
                  item?.unit_import_vat?.trim() !== item?.unit_norm?.trim(),
              ),
            )
              .uniqWith(
                (itemA, itemB) =>
                  itemA.unit_norm === itemB.unit_norm &&
                  itemA.unit_import_vat === itemB.unit_import_vat &&
                  itemA.material_code === itemB.material_code,
              )
              .filter(["conversion_factor", null])
              .value(),
          ],
          ({ conversion_factor }) => conversion_factor || -1,
          "asc",
        ),
      );
    }
  }, [sanPhams]);

  const updateCOUnit = useCreateCoUnit({
    config: {
      onSuccess: async (data) => {
        if (data.results) {
          setIsLoading(true);
          const { ma_hh, stk, key } = sanPhamByMaHH;
          const listMaterials: any = [];
          for (let i = 0; i < sanPhams.length; i++) {
            const nguyenLieu = await getNormProductNumber({
              norm_id: sanPhams[i].dinh_muc_id || 0,
              product_number: sanPhams[i].sl_done_co,
              export_declaration_id: sanPhams[i].stk,
              form_co: chooseFormCo,
              co_document_id: Number(id) || null,
            });

            listMaterials.push(nguyenLieu);
          }
          const newSanPhams = produce(sanPhams, (draft) => {
            draft.forEach((product, index) => {
              if (
                ma_hh === product.ma_hh &&
                stk === product.stk &&
                key === product.key
              ) {
                product["nguyen_lieu"] = mappingNVL(listMaterials[index]);

                let countNoMapping = 0;
                product["nguyen_lieu"]?.forEach((i: any) => {
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

                if (!("tcs" in draft[index])) {
                  product["tcs"] = {};
                }
              } else {
                product["nguyen_lieu"] = mappingNVL(listMaterials[index]);
                if (!("tcs" in draft[index])) {
                  draft[index]["tcs"] = {};
                }
              }
            });
          });
          setSanPhams(newSanPhams);
          setIsLoading(false);
          // notification.success({
          //   message: t("message.update_success"),
          // });
          setLetSave(true);
          form.resetFields();
          setOpenModal(false);
          close();
        } else {
          notification.error({
            message: t("message.update_failure"),
          });
        }
      },
    },
  });

  useEffect(() => {
    if (letSave) {
      handleSaveCo(true);
      setLetSave(!letSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letSave]);

  useEffect(() => {
    if (openModal && normVatImport) {
      form.setFieldsValue({ list: normVatImport });
      open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, normVatImport]);

  const handleCancel = () => {
    close();
    setOpenModal(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const dataPost = {
        list_detail: _.sortBy(normVatImport, "conversion_factor")?.map(
          (i: any, index: number) => ({
            material_code: i.material_code?.trim(),
            unit_import_vat: i.unit_import_vat?.trim(),
            unit_norm: i.unit_norm?.trim(),
            conversion_factor: (
              values.list[index].conversion_factor + ""
            )?.trim(),
            status: normVatImport?.[index]?.conversion_factor !== null ? 2 : 1,
          }),
        ),
        lu_user_id: userRecoil.user_id,
      };
      updateCOUnit.mutate(dataPost);
    });
  };

  const columns = (): TableColumnsType<FormListFieldData> => [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: 50,
      render: (value) => value + 1,
    },
    {
      dataIndex: "",
      title: "HS code",
      key: "hs_code",
      width: 100,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "hs_code"]}
          rules={RULES_FORM.required}
        >
          <Typography.Text>{normVatImport[name]?.hs_code}</Typography.Text>
        </Form.Item>
      ),
    },
    {
      dataIndex: "",
      title: "Mã NVL",
      key: "material_code",
      width: 120,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_code"]}
          rules={RULES_FORM.required}
        >
          <Typography.Text>
            {normVatImport[name]?.material_code}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: "Thông tin nguyên liệu vật tư",
      dataIndex: "",
      key: "material_name",
      width: "50%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_name"]}
        >
          <Typography.Text>
            {normVatImport[name]?.material_name}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: "ĐVT trong định mức",
      dataIndex: "unit_norm",
      key: "unit_norm",
      align: "center",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_norm"]}
        >
          <Typography.Text>{normVatImport[name]?.unit_norm}</Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: "ĐVT trong TKN/VAT",
      dataIndex: "unit_import_vat",
      key: "unit_import_vat",
      align: "center",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_import_vat"]}
        >
          <Typography.Text>
            {normVatImport[name]?.unit_import_vat}
          </Typography.Text>
        </Form.Item>
      ),
    },

    {
      title: "Tỷ lệ quy đổi",
      dataIndex: "conversion_factor",
      key: "conversion_factor",
      width: 100,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "conversion_factor"]}
          rules={RULES_FORM.required}
        >
          <Input placeholder={"Tỷ lệ quy đổi"} style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
  ];

  return (
    <>
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"70%"}
        onCancel={handleCancel}
        okText={"Lưu"}
        cancelText={null}
        onOk={handleOk}
        className={styles.modal}
        maskClosable={false}
        closable={false}
        confirmLoading={updateCOUnit.isLoading || isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Chuyển đổi đơn vị cho tên NVL
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Spin spinning={false}>
            <Form layout="vertical" form={form}>
              <Form.List name={"list"}>
                {(fields) => (
                  <Table dataSource={fields} columns={columns()} size="small" />
                )}
              </Form.List>
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
}
