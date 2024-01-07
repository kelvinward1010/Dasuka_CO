import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  FormListFieldData,
  FormListOperation,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { customerState } from "@/components/AppFilter/index.atom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";
import { formatNumber } from "@/utils/format";
import { intlUSD } from "@/utils/intl";

import styles from "../../style.module.scss";
import { useCreateExportExpected } from "../api/createExportExpected";
import { getDropdownExpected } from "../api/getDropdownExpected";
import { useDropdownUnit } from "../api/getDropdownUnit";
import { shippingTerms } from "../data/fake-data";
import { IExportDeclarationDetail } from "../types";

export function CreateExportExpected(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const customer = useRecoilValue(customerState);
  const usdExchangeRate = Form.useWatch("usd_exchange_rate", form);
  const currencyType = Form.useWatch("currency_type", form);
  const listDetails = Form.useWatch(
    "list_json_export_declaration_detail",
    form,
  );

  const createExportExpected = useCreateExportExpected({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["export-expected-s"]);

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
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        createExportExpected.mutate({
          ...values,
          customer_id: customer.value,
          date_of_declaration: dayjs(values.date_of_declaration).format(
            "YYYY-MM-DD",
          ),
          list_json_export_declaration_detail:
            values.list_json_export_declaration_detail?.map((i: any) => ({
              ...i,
              origin_country: "Việt Nam",
            })),
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
      <Button
        type="primary"
        className={`${styles.button} ${styles.button_create}`}
        onClick={handleOpen}
      >
        {t("for_all.button_create")}
      </Button>

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
        confirmLoading={createExportExpected.isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("export_declaration.detail.title_create_expected")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body" style={{ minHeight: 350 }}>
          <Spin spinning={false}>
            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label="Số tờ khai"
                    name="export_declaration_number"
                    rules={[...RULES_FORM.required, ...RULES_FORM.twenty]}
                  >
                    <Input />
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
                    rules={[...RULES_FORM.required]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.bill")}
                    name="bill_number"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.importer")}
                    name="importer"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.date_full")}
                    name="date_of_declaration"
                    initialValue={dayjs()}
                    rules={[...RULES_FORM.required]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("export_declaration.fields.shipping_terms")}
                    name="shipping_terms"
                    rules={[...RULES_FORM.required]}
                  >
                    <Select
                      showSearch
                      options={shippingTerms.map((i) => ({
                        label: i,
                        value: i,
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={`Quy đổi tỷ giá (${currencyType})`}
                    name="usd_exchange_rate"
                    rules={[...RULES_FORM.required]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={formatNumber}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item
                    label={"Loại tiền tệ"}
                    name="currency_type"
                    rules={[...RULES_FORM.required]}
                    initialValue={"USD"}
                  >
                    <Input style={{ width: "100%" }} placeholder="USD,..." />
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
                importDeclarationDetail={listDetails || []}
                form={form}
                currencyType={currencyType}
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
  form,
  currencyType = "USD",
}: {
  importDeclarationDetail: IExportDeclarationDetail[];
  exchangeRate: string | number;
  form: FormInstance;
  currencyType?: string;
}) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<any>({});

  const unitDropdown = useDropdownUnit({});

  const handleSearchCode = async (key: number, value: string) => {
    const dropdown = await getDropdownExpected({
      product_code: value,
    });
    if (!dropdown?.message)
      setOptions({
        key,
        values: dropdown.map((i: any) => ({
          ...i,
          label: i.product_code,
          value: i.product_code,
        })),
      });
  };

  const handleSelectCode = async (key: number, option: any) => {
    const { label, value, ...values } = option;
    const list = form.getFieldValue("list_json_export_declaration_detail");

    list[key] = { ...list[key], ...values };

    form.setFieldValue("list_json_export_declaration_detail", list);
  };

  const columns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: t("export_declaration.fields.serial"),
      width: 50,
      align: "center",
      render: (_, { name }) => <Typography.Text>{name + 1}</Typography.Text>,
    },
    {
      title: t("export_declaration.fields.hs_code"),
      width: 150,
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
          rules={[...RULES_FORM.required]}
        >
          <Input
            placeholder={t("export_declaration.fields.hs_code") || ""}
            spellCheck={false}
          />
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
          <Select
            showSearch
            onSearch={(value) => handleSearchCode(name, value)}
            onSelect={(_, option) => handleSelectCode(name, option)}
            placeholder={t("export_declaration.fields.product_code") || ""}
            style={{ width: "100%" }}
            options={options?.key === name ? options.values : []}
          />
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.product_name"),
      width: "45%",
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
          rules={[...RULES_FORM.required]}
        >
          <Input
            placeholder={t("export_declaration.fields.product_name") || ""}
            spellCheck={false}
          />
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.quantity"),
      align: "right",
      width: 120,
      sorter: (a, b) =>
        importDeclarationDetail?.[a.name]?.quantity -
        importDeclarationDetail?.[b.name]?.quantity,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "quantity"]}
          rules={[...RULES_FORM.required]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder={t("export_declaration.fields.quantity") || ""}
            spellCheck={false}
            formatter={formatNumber}
            min={0}
          />
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.unit"),
      width: 130,
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
          rules={[...RULES_FORM.required]}
        >
          <Select
            showSearch
            loading={unitDropdown.isLoading}
            options={unitDropdown.data}
            placeholder={t("export_declaration.fields.unit") || ""}
            disabled={
              typeof importDeclarationDetail[name]?.editable === "number"
                ? !importDeclarationDetail[name]?.editable
                : false
            }
            filterOption={(input, option) =>
              (option?.label + "" ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      title: `Đơn giá (${currencyType})`,
      align: "right",
      width: 100,
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
          name={[name, "unit_price"]}
          rules={[...RULES_FORM.required]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("export_declaration.fields.unit_price") || ""}
            spellCheck={false}
            formatter={formatNumber}
            disabled={
              typeof importDeclarationDetail[name]?.editable === "number"
                ? !importDeclarationDetail[name]?.editable
                : false
            }
          />
        </Form.Item>
      ),
    },
    {
      title: t("export_declaration.fields.taxable_price"),
      align: "right",
      width: 150,
      sorter: (a, b) =>
        Number(importDeclarationDetail?.[a.name]?.taxable_price || 0) -
        Number(importDeclarationDetail?.[b.name]?.taxable_price || 0),
      render: (_, { name, ...restField }) => {
        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "taxable_price"]}
          >
            <Typography.Text>
              {intlUSD.format(
                Number(
                  (exchangeRate
                    ? Number(importDeclarationDetail[name]?.unit_price || 0)
                    : 0) * Number(exchangeRate || 0),
                ),
              )}
            </Typography.Text>
          </Form.Item>
        );
      },
    },
    {
      title: "",
      width: "50px",
      dataIndex: "name",
      align: "center",
      render: (name) => (
        <Button
          icon={<XoaIcon />}
          type="text"
          danger
          onClick={() => remove(name)}
        />
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 10 }}>
      <Form.List name={"list_json_export_declaration_detail"}>
        {(fields, { remove, add }) => (
          <Table
            size="small"
            scroll={{ y: 390 }}
            dataSource={fields}
            columns={columns({ remove })}
            bordered
            pagination={{
              size: "small",
              style: { margin: "10px 0" },
            }}
            footer={() => {
              return (
                <Row justify={"end"}>
                  <Col>
                    <Tooltip title="Thêm sản phẩm">
                      <PlusCircleOutlined
                        className={styles.icon_add}
                        onClick={() => add()}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              );
            }}
          />
        )}
      </Form.List>
    </div>
  );
}
