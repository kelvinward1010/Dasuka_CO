import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Form,
  FormListFieldData,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconCoin } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { isDoneCoState } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { selectForm } from "@/module/quan-ly-ho-so-co/views/fakedata/fakedata";
import { ConfirmDateDeclaration } from "@/module/quan-ly-ho-so-co/views/modals/ConfirmDateDeclaration";
import { getUserSelector } from "@/store/auth/state";
import { checkQuantityCO } from "@/utils/check";
import { formatNumber } from "@/utils/format";
import { decimalUSD, intlUSD } from "@/utils/intl";

import styles from "../../style.module.scss";
import { useImportDeclaration } from "../api/getImportDeclaration";
import { useUpdateImportDeclaration } from "../api/updateImportDeclaration";
import { IImportDeclaration, IImportDeclarationDetail } from "../types";
import { DetailQuantityModal } from "./DetailQuantityModal";

interface Props {
  importDeclaration: IImportDeclaration;
  isNeedUpdateExchangeRate?: boolean;
  onSuccess?: (data: IImportDeclaration) => void;
  check_import_date?: number;
  indexMaterial?: number;
}

export function UpdateImportDeclaration({
  importDeclaration,
  isNeedUpdateExchangeRate = false,
  onSuccess,
  check_import_date,
  indexMaterial,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const usdExchangeRate = Form.useWatch("usd_exchange_rate", form);
  const [date, setDate] = useState<Dayjs | null>();
  const isDone = useRecoilValue(isDoneCoState);

  const { data, isLoading } = useImportDeclaration({
    id: importDeclaration.import_declaration_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        data.date_of_declaration = dayjs(data.date_of_declaration).format(
          "YYYY-MM-DD",
        );

        if (data.prefer_co_date) setDate(dayjs(data.prefer_co_date));
        else setDate(null);
        form.setFieldsValue(data);
      },
    },
  });

  useImportDeclaration({
    id: importDeclaration.import_declaration_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const updateImportDeclaration = useUpdateImportDeclaration({
    config: {
      onSuccess: (_, variables) => {
        if (!onSuccess) {
          notification.success({
            message: t("message.update_success"),
          });
          queryClient.invalidateQueries(["import-declaration"]);
        }
        close();
        form.resetFields();
        onSuccess?.(variables);
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
    form.setFieldsValue(importDeclaration);
    open();
  };

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      updateImportDeclaration.mutate({
        ...values,
        prefer_co_date: date ? dayjs(date).format("YYYY-MM-DD") : null,
        import_declaration_id: importDeclaration.import_declaration_id,
        created_by_user_id: userRecoil.user_id,
      });
    });
  };

  return (
    <>
      <Space>
        <ConfirmDateDeclaration
          declaration_number={importDeclaration.import_declaration_number}
          indexMaterial={indexMaterial || 0}
          check_import_date={check_import_date}
        />
        {check_import_date !== 0 && (
          <Typography.Link onClick={handleOpen}>
            {importDeclaration.import_declaration_number}
          </Typography.Link>
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
        width={"90%"}
        onCancel={handleCancel}
        okText={"Lưu"}
        cancelText={null}
        onOk={handleOk}
        className={styles.modal}
        okButtonProps={{
          disabled: isDone,
        }}
        maskClosable={false}
        closable={false}
        confirmLoading={updateImportDeclaration.isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("import_declaration.detail.title")}
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
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.id_full")}
                    name="import_declaration_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.invoice_number")}
                    name="invoice_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.bill")}
                    name="bill_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.exporter")}
                    name="exporter"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.date_full")}
                    name="date_of_declaration"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.shipping_terms")}
                    name="shipping_terms"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.exchange_rate")}
                    name="usd_exchange_rate"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={formatNumber}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.form")}
                    name="form"
                  >
                    <Select
                      showSearch
                      allowClear
                      style={{ width: "100%" }}
                      placeholder={t("import_declaration.fields.form") || ""}
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
                    label={t("import_declaration.fields.endow_number")}
                    name="prefer_co_document_number"
                  >
                    <Input
                      placeholder={
                        t("import_declaration.fields.endow_number") || ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label={t("import_declaration.fields.endow_date")}>
                    <DatePicker
                      style={{ width: "100%" }}
                      value={date}
                      onChange={(value) => setDate(value)}
                      format={"DD/MM/YYYY"}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.processing_contract")}
                    name="import_licence_number"
                  >
                    <Input
                      placeholder={
                        t("import_declaration.fields.processing_contract") || ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t("import_declaration.fields.x_annex_code")}
                    name="x_annex_code"
                  >
                    <Input
                      placeholder={
                        t("import_declaration.fields.x_annex_code") || ""
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <UpdateImportDeclarationTable
                importDeclaration={data}
                exchangeRate={usdExchangeRate}
                importDeclarationDetail={data?.import_declaration_detail ?? []}
              />
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
}

export function UpdateImportDeclarationTable({
  exchangeRate,
  importDeclarationDetail,
  importDeclaration,
}: {
  importDeclaration?: IImportDeclaration;
  exchangeRate: string | number;
  importDeclarationDetail: IImportDeclarationDetail[];
}) {
  const { t } = useTranslation();

  const columns = (): TableColumnsType<FormListFieldData> => [
    {
      title: t("import_declaration.fields.serial"),
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
      title: t("import_declaration.fields.hs_code"),
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
      title: t("import_declaration.fields.product_code"),
      dataIndex: "material_code",
      width: 150,
      sorter: (a, b) => {
        const nameA =
          importDeclarationDetail?.[a.name]?.material_code?.toUpperCase(); // ignore upper and lowercase
        const nameB =
          importDeclarationDetail?.[b.name]?.material_code?.toUpperCase(); // ignore upper and lowercase
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
          name={[name, "material_code"]}
          // rules={[...RULES_FORM.required]}
        >
          <Input
            placeholder="Mã hàng hóa"
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
      title: t("import_declaration.fields.product_name"),
      width: "40%",
      sorter: (a, b) => {
        const nameA =
          importDeclarationDetail?.[a.name]?.material_name?.toUpperCase(); // ignore upper and lowercase
        const nameB =
          importDeclarationDetail?.[b.name]?.material_name?.toUpperCase(); // ignore upper and lowercase
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
          name={[name, "material_name"]}
        >
          <Typography.Text
            type={
              checkQuantityCO(importDeclarationDetail[name])
                ? "danger"
                : undefined
            }
          >
            {importDeclarationDetail?.[name]?.material_name}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("import_declaration.fields.quantity"),
      align: "right",
      width: "100px",
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
      title: t("import_declaration.fields.unit"),
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
      title: t("import_declaration.fields.cif_price"),
      align: "right",
      // dataIndex: "unit_price",
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.unit_price) -
        Number(importDeclarationDetail?.[b.name]?.unit_price),
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "unit_price"]}
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
                  ? Number(
                      importDeclarationDetail[name]?.unit_price_transport || 0,
                    )
                  : 0) / Number(exchangeRate || 1),
              ),
            )}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("import_declaration.fields.taxable_price"),
      align: "right",
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.unit_price_transport || 0) -
        Number(importDeclarationDetail?.[b.name]?.unit_price_transport || 0),
      render: (_, { name, ...restField }) => {
        const value = importDeclarationDetail?.[name]?.unit_price_transport;

        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "unit_price_transport"]}
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
    {
      title: t("import_declaration.fields.co_available"),
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
              <DetailQuantityModal
                importDeclaration={importDeclaration}
                importDeclarationDetail={importDeclarationDetail[name]}
                sort_order={importDeclarationDetail?.[name]?.sort_order}
                value={intlUSD.format(value ?? 0)}
              />
            </Typography.Text>
          </Form.Item>
        );
      },
    },
    {
      title: t("import_declaration.fields.co_using"),
      align: "right",
      width: 110,
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.co_using || 0) -
        Number(importDeclarationDetail?.[b.name]?.co_using || 0),
      render: (_, { name, ...restField }) => {
        const value = importDeclarationDetail?.[name]?.co_using;

        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "co_using"]}
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
  ];

  return (
    <div style={{ marginBottom: 10 }}>
      <Form.List name={"import_declaration_detail"}>
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
