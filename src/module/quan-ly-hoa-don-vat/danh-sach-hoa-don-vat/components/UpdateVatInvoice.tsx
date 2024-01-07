import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  notification,
} from "antd";
import { OptionProps } from "antd/es/select";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconCoin } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { ConfirmDateVAT } from "@/module/quan-ly-ho-so-co/views/modals/ConfirmDateVAT";
import { getUserSelector } from "@/store/auth/state";
import { formatNumber } from "@/utils/format";

import { useVatInvoice } from "../api/getVatInvoice";
import { useUpdateVatInvoice } from "../api/updateVatInvoice";
import styles from "../style.module.scss";
import { ListMaterialVatTable } from "./ListMaterialVatTable";

interface Props {
  vatInvoiceId: string;
  serialNumber?: string;
  isNeedUpdateExchangeRate?: boolean;
  onSuccess?: (data: any) => void;
  check_import_date?: number;
  indexMaterial?: number;
}

export function UpdateVatInvoice({
  isNeedUpdateExchangeRate,
  vatInvoiceId,
  serialNumber,
  check_import_date,
  onSuccess,
  indexMaterial,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedVat, setSelectedVat] = useState<string | undefined>();
  const userRecoil = useRecoilValue(getUserSelector);
  const [vatOptions, setVatOptions] = useState<OptionProps[]>([]);
  const [dateExport, setDateExport] = useState<Dayjs | null>();
  const [dateX, setDateX] = useState<Dayjs | null>();
  const usdExchangeRate = Form.useWatch("usd_exchange_rate", form);

  const { isOpen, close, open } = useDisclosure();

  // Get vat by vat_invoice_id
  const { data: dataVat } = useVatInvoice({
    id: vatInvoiceId!,
    serial_number: serialNumber!,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
        setSelectedVat(data.vat_invoice_id);
        setDateExport(dayjs(data.invoice_date));
        data.date && setDateX(dayjs(data.date));
      },
    },
  });

  // Update vat invoice
  const updateVatInvoice = useUpdateVatInvoice({
    config: {
      onSuccess: (data, variables) => {
        if (data.results) {
          if (!onSuccess) {
            notification.success({
              message: data.message,
            });
            queryClient.invalidateQueries(["vat_invoices"]);
          }
          form.resetFields();
          onSuccess?.(variables);
          setSelectedVat(undefined);
          close();
        } else
          notification.error({
            message: data.message,
          });
      },
      onError: (err) => {
        notification.error({
          message: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    setSelectedVat(undefined);
    setVatOptions([]);
    setDateX(null);
    form.resetFields();
    close();
  };

  const handleOk = () => {
    // Check validation
    form
      .validateFields()
      .then(async (values) => {
        const dataPost = {
          ...values,
          ...dataVat,
          vat_license_number: values.vat_license_number,
          invoice_date: dateExport?.isValid()
            ? dayjs(dateExport).format("YYYY-MM-DD")
            : null,
          usd_exchange_rate: form.getFieldValue("usd_exchange_rate") || null,
          x_annex_code: form.getFieldValue("x_annex_code"),
          date: dateX?.isValid() ? dayjs(dateX).format("YYYY-MM-DD") : null,
          lu_user_id: userRecoil.user_id,
          list_json_vat_invoice_detail: form
            .getFieldValue("vat_invoice_detail")
            .map((item: any, index: number) => ({
              ...item,
              material_code: item.material_code?.trim(),
              material_name: item.material_name?.trim(),
              material_id: "",
              sort_order: item.sort_order || index + 1,
            })),
        };

        updateVatInvoice.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  return (
    <>
      <Space>
        <ConfirmDateVAT
          vat_invoice_id={vatInvoiceId}
          indexMaterial={indexMaterial || 0}
          check_import_date={check_import_date}
        />
        {check_import_date !== 0 && (
          <Typography.Link onClick={handleOpen}>{vatInvoiceId}</Typography.Link>
        )}
        {isNeedUpdateExchangeRate && (
          <Typography.Text title="Bạn cần quy đổi tỷ giá">
            <IconCoin title="Bạn cần quy đổi tỷ giá" />
          </Typography.Text>
        )}
      </Space>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"100%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateVatInvoice.isLoading}
        closable={false}
        destroyOnClose
        className={styles.modal}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        maskClosable={false}
        cancelText={t("for_all.button_cancel")}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_vat.update.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical">
            <Row gutter={32}>
              <Col span={6}>
                <div className="ant-col ant-form-item-label">
                  <Typography.Text className={styles.label_required} strong>
                    {t("quan_ly_vat.create.vat_number")}
                  </Typography.Text>
                </div>
                <Select
                  showSearch
                  style={{ width: "100%", marginBottom: 17 }}
                  options={vatOptions}
                  value={selectedVat}
                  disabled
                  placeholder={t("quan_ly_vat.create.vat_number") || ""}
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Form.Item
                  name={"serial_number"}
                  label={"Số ký hiệu"}
                  style={{ marginBottom: 0 }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={"usd_exchange_rate"}
                  label={t("quan_ly_vat.create.exchange_rate")}
                  rules={[...RULES_FORM.required]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("quan_ly_vat.create.exchange_rate") || ""}
                    formatter={formatNumber}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  // name={"date"}
                  label={t("quan_ly_vat.create.date_export")}
                  rules={[...RULES_FORM.required]}
                >
                  <DatePicker
                    allowClear={false}
                    style={{ width: "100%" }}
                    placeholder={t("quan_ly_vat.create.date_export") || ""}
                    format={"DD-MM-YYYY"}
                    value={dateExport || dayjs()}
                    onChange={(value) => setDateExport(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Form.Item name={"vat_license_number"} label={"Số HDGC"}>
                  <Input placeholder="Số HDGC" />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Form.Item
                  name={"x_annex_code"}
                  label={t("quan_ly_vat.create.x_annex_code")}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder={t("quan_ly_vat.create.x_annex_code") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  // name={"date"}
                  label={t("quan_ly_vat.create.date_x")}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder={t("quan_ly_vat.create.date_x") || ""}
                    format={"DD-MM-YYYY"}
                    value={!dateX?.isValid() ? null : dateX}
                    onChange={(value) => setDateX(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Form.Item
                  name={"file_name"}
                  label={"Tên file"}
                  style={{ marginBottom: 0 }}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <ListMaterialVatTable
              dataVat={dataVat}
              usdExchangeRate={usdExchangeRate}
              form={form}
              selectedVat={selectedVat}
              customer_id={dataVat?.customer_id}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
}
