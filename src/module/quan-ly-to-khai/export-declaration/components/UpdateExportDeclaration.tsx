import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  FormListFieldData,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";
import { checkQuantityCO } from "@/utils/check";
import { formatNumber } from "@/utils/format";
import { decimalUSD, intlUSD } from "@/utils/intl";

import styles from "../../style.module.scss";
import { useExportDeclaration } from "../api/getExportDeclaration";
import { useUpdateExportDeclaration } from "../api/updateExportDeclaration";
import { IExportDeclaration, IExportDeclarationDetail } from "../types";

interface Props {
  exportDeclaration: IExportDeclaration | any;
  isShowTerm?: boolean;
  callbackUpdate?: (export_declaration: IExportDeclaration) => void;
}

export function UpdateExportDeclaration({
  exportDeclaration,
  isShowTerm,
  callbackUpdate,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const usdExchangeRate = Form.useWatch("usd_exchange_rate", form);

  const { data, isLoading } = useExportDeclaration({
    id: exportDeclaration.export_declaration_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        if (callbackUpdate) callbackUpdate(data);
        data.date_of_declaration = dayjs(data.date_of_declaration).format(
          "DD-MM-YYYY",
        );
        form.setFieldsValue(data);
      },
    },
  });

  const updateExportDeclaration = useUpdateExportDeclaration({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["export-declaration"]);
        queryClient.invalidateQueries(["export-declaration-dropdown"]);

        close();
        form.resetFields();
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    form.setFieldsValue(exportDeclaration);
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        updateExportDeclaration.mutate({
          ...values,
          export_declaration_id: exportDeclaration.export_declaration_id,
          created_by_user_id: userRecoil.user_id,
        });
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>
        {exportDeclaration.export_declaration_number}{" "}
        {isShowTerm && <>({exportDeclaration.shipping_terms})</>}
      </Typography.Link>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"90%"}
        onCancel={handleCancel}
        okText={"Lưu"}
        cancelText={null}
        onOk={handleOk}
        className={styles.modal}
        closable={false}
        confirmLoading={updateExportDeclaration.isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("export_declaration.detail.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body" style={{ minHeight: 350 }}>
          <Spin spinning={isLoading}>
            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label="Số tờ khai"
                    name="export_declaration_number"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label={t("export_declaration.fields.id_full")}
                    name="export_declaration_id"
                    hidden
                  ></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.invoice_number")}
                    name="invoice_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.bill")}
                    name="bill_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.importer")}
                    name="importer"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.date_full")}
                    name="date_of_declaration"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.shipping_terms")}
                    name="shipping_terms"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.exchange_rate")}
                    name="usd_exchange_rate"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={formatNumber}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.processing_contract")}
                    name="export_licence_number"
                  >
                    <Input placeholder="Số HDGC" />
                  </Form.Item>
                </Col>
              </Row>
              <UpdateExportDeclarationTable
                exchangeRate={usdExchangeRate}
                importDeclarationDetail={data?.export_declaration_detail ?? []}
              />
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
}

export function UpdateExportDeclarationTable({
  importDeclarationDetail,
  exchangeRate,
}: {
  importDeclarationDetail: IExportDeclarationDetail[];
  exchangeRate: string | number;
}) {
  const { t } = useTranslation();

  const columns = (): TableColumnsType<FormListFieldData> => [
    {
      title: t("export_declaration.fields.serial"),
      width: "3%",
      align: "center",
      render: (_, { name }) => (
        <Typography.Text
          type={
            checkQuantityCO(importDeclarationDetail?.[name])
              ? "danger"
              : undefined
          }
        >
          {name + 1}
        </Typography.Text>
      ),
    },
    {
      title: t("export_declaration.fields.hs_code"),
      width: 85,
      sorter: (a, b) => {
        const nameA = importDeclarationDetail?.[a.name]?.hs_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = importDeclarationDetail?.[b.name]?.hs_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "hs_code"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {importDeclarationDetail?.[name]?.hs_code}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.product_code"),
      width: 150,
      sorter: (a, b) => {
        const nameA =
          importDeclarationDetail?.[a.name]?.product_code?.toUpperCase(); // ignore upper and lowercase
        const nameB =
          importDeclarationDetail?.[b.name]?.product_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "product_code"]}
          // rules={[...RULES_FORM.required]}
        >
          <Input.TextArea
            placeholder={t("export_declaration.fields.product_code") || ""}
            spellCheck={false}
            disabled={!importDeclarationDetail[name]?.editable}
            style={{
              color: checkQuantityCO(importDeclarationDetail[name])
                ? "red"
                : "inherit",
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.product_name"),
      width: "50%",
      sorter: (a, b) => {
        const nameA =
          importDeclarationDetail?.[a.name]?.product_name?.toUpperCase(); // ignore upper and lowercase
        const nameB =
          importDeclarationDetail?.[b.name]?.product_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "product_name"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {importDeclarationDetail?.[name]?.product_name}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.quantity"),
      align: "right",
      sorter: (a, b) =>
        importDeclarationDetail?.[a.name]?.quantity -
        importDeclarationDetail?.[b.name]?.quantity,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "quantity"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {intlUSD.format(importDeclarationDetail?.[name]?.quantity)}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.co_available"),
      align: "right",
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.co_available || 0) -
        Number(importDeclarationDetail?.[b.name]?.co_available || 0),
      render: (_, { name, ...restField }) => {
        const value = importDeclarationDetail?.[name]?.co_available;

        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "co_available"]}
          >
            <Typography.Text
              type={
                checkQuantityCO(importDeclarationDetail[name])
                  ? "danger"
                  : undefined
              }
            >
              {intlUSD.format(value ?? 0)}
            </Typography.Text>
          </Form.Item>
        );
      },
    },
    {
      title: t("export_declaration.fields.unit"),
      align: "center",
      sorter: (a, b) => {
        const nameA = importDeclarationDetail?.[a.name]?.unit?.toUpperCase(); // ignore upper and lowercase
        const nameB = importDeclarationDetail?.[b.name]?.unit?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "unit"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {importDeclarationDetail?.[name]?.unit}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.unit_price"),
      align: "right",
      // dataIndex: "unit_price",
      sorter: (a, b) =>
        Number(
          (exchangeRate
            ? Number(importDeclarationDetail[a.name]?.taxable_price || 0)
            : 0) / Number(exchangeRate || 1),
        ) -
        Number(
          (exchangeRate
            ? Number(importDeclarationDetail[b.name]?.taxable_price || 0)
            : 0) / Number(exchangeRate || 1),
        ),
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "taxable_price"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {decimalUSD.format(
              Number(
                (exchangeRate
                  ? Number(importDeclarationDetail[name]?.taxable_price || 0)
                  : 0) / Number(exchangeRate || 1),
              ),
            )}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.taxable_price"),
      align: "right",
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.taxable_price || 0) -
        Number(importDeclarationDetail?.[b.name]?.taxable_price || 0),
      render: (_, { name, ...restField }) => {
        const value = importDeclarationDetail?.[name]?.taxable_price;

        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "taxable_price"]}
          >
            <Typography.Text
              type={
                checkQuantityCO(importDeclarationDetail[name])
                  ? "danger"
                  : undefined
              }
            >
              {intlUSD.format(value ? +(+value?.toFixed(0)) : 0)}
            </Typography.Text>
          </Form.Item>
        );
      },
    },
  ];

  return (
    <div style={{ marginBottom: 10 }}>
      <Form.List name={"export_declaration_detail"}>
        {(fields) => (
          <Table
            size="small"
            scroll={{ y: 390 }}
            dataSource={fields}
            columns={columns()}
            bordered
            pagination={{
              size: "small",
              style: { margin: "10px 0" },
              total: importDeclarationDetail?.length,
            }}
          />
        )}
      </Form.List>
    </div>
  );
}
