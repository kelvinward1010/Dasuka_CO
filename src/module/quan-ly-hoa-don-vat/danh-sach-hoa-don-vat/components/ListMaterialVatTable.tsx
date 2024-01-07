import { SearchOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
  notification,
} from "antd";
import produce from "immer";
import _, { round } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";
import { checkAvailableCOInVAT } from "@/utils/check";
import { formatNumber, formatOnlyNumber } from "@/utils/format";
import { decimalUSD, intlUSD } from "@/utils/intl";

import { getSuggestMaterial } from "../api/getSuggestMaterial";
import { getSuggestMaterialAll } from "../api/getSuggestMaterialAll";
import { VatInvoice } from "../types";
import styles from "./CreateVatInvoice.module.scss";
import { DetailQuantityModal } from "./DetailQuantityModal";

export function ListMaterialVatTable({
  dataVat,
  form,
  selectedVat,
  usdExchangeRate,
  customer_id,
  groupButtonImport,
}: {
  dataVat?: VatInvoice;
  form: FormInstance;
  selectedVat: string | undefined;
  usdExchangeRate?: number | null;
  customer_id?: string;
  groupButtonImport?: any;
}): JSX.Element {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState<any[]>([]);
  const customer = useRecoilValue(customerState);
  const [dropdownSuggests, setDropdownSuggests] = useState<any[]>([]);
  const userRecoil = useRecoilValue(getUserSelector);

  const [loadingSuggest, setLoadingSuggest] = useState<any>();
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const handleSuggest =
    (vat_material_name: string, index: number) => async () => {
      if (!customer.value && !customer_id) {
        notification.warning({
          message: "Vui lòng chọn khách hàng để thực hiện chức năng.",
        });
        return;
      }
      setLoadingSuggest(index);
      const data = await getSuggestMaterial({
        params: {
          material_name: vat_material_name,
          customer_id: customer_id || customer.value,
          user_id: userRecoil.user_id,
        },
      });
      if (data?.message)
        notification.info({
          message: data.message,
        });
      else {
        const newData = _.uniqBy(
          [...dropdownSuggests, { vat_material_name, dropdown: data }],
          "vat_material_name",
        );
        setDropdownSuggests(newData);
      }
      setLoadingSuggest(null);
    };

  useEffect(() => {
    if (selectedVat) {
      const data = form
        .getFieldsValue()
        ?.vat_invoice_detail?.map((item: any) => {
          return {
            ...item,
            unit_price_cif:
              usdExchangeRate && usdExchangeRate > 0
                ? Number(item.unit_price / usdExchangeRate).toFixed(6)
                : 0,
          };
        });

      form.setFieldsValue({
        ...form.getFieldsValue(),
        vat_invoice_detail: data,
      });
      setMaterials(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVat, dropdownSuggests, usdExchangeRate]);

  const handleSelectMaterial = (
    value: string | number,
    __: any,
    index: number,
  ) => {
    const data = form.getFieldsValue();
    if (data?.vat_invoice_detail) {
      const item = dropdownSuggests
        ?.find(
          (f) => f.vat_material_name === materials?.[index]?.vat_material_name,
        )
        ?.dropdown?.find((f: any) => f.material_id === value);
      data.vat_invoice_detail[index] = {
        ...data.vat_invoice_detail[index],
        material_code: item.material_code,
        material_name: item?.material_name,
        hs_code: item?.hs_code,
        unit: item?.unit,
      };
      form.setFieldsValue(data);
    }
  };

  const handleSuggestAll = async () => {
    setLoadingBtn(true);
    const dataPost = {
      customer_id: customer.value,
      list_json_vat: materials,
    };

    const res = await getSuggestMaterialAll({ params: dataPost });

    if (res && res.length > 0) {
      setMaterials(res);
    }

    setLoadingBtn(false);
  };

  const columns: TableColumnsType<any> = [
    {
      title: t("quan_ly_vat.create.stt"),
      dataIndex: "sort_order",
      width: "3%",
      align: "center",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "sort_order"]}
        >
          <Typography.Text
            type={
              !checkAvailableCOInVAT(materials?.[name]) ? "danger" : undefined
            }
          >
            {materials?.[name]?.sort_order}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.product_name"),
      dataIndex: "vat_material_name",
      width: "20%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "vat_material_name"]}
        >
          <Typography.Text
            type={
              !checkAvailableCOInVAT(materials?.[name]) ? "danger" : undefined
            }
          >
            {materials?.[name]?.vat_material_name}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.hs_code"),
      dataIndex: "hs_code",
      width: "8%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "hs_code"]}
          rules={[...RULES_FORM.number]}
        >
          <Input
            disabled={materials?.[name]?.editable === 0}
            placeholder={t("quan_ly_vat.create.hs_code") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.material_code"),
      dataIndex: "material_code",
      width: "11%",
      render: (_, { name, ...restField }) => {
        const options: any[] =
          dropdownSuggests?.find(
            (f) => f.vat_material_name === materials?.[name]?.vat_material_name,
          )?.dropdown || [];

        return (
          <Form.Item
            className={styles.clear_margin}
            {...restField}
            style={{ marginBottom: 0 }}
            name={[name, "material_code"]}
          >
            <AutoComplete
              showSearch
              showArrow
              disabled={materials?.[name]?.editable === 0}
              onClick={(e: any) => e.target?.select?.()}
              dropdownStyle={{ maxHeight: 400 }}
              placeholder={t("quan_ly_vat.create.material_code") || ""}
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onSelect={(value, option) =>
                handleSelectMaterial(value, option, name)
              }
              options={options.map((item: any) => ({
                ...item,
                label: item.material_code,
                value: item.material_id,
              }))}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t("quan_ly_vat.create.material_name"),
      dataIndex: "material_name",
      width: "27%",
      render: (_, { name, ...restField }) => {
        const options: any[] =
          dropdownSuggests?.find(
            (f) => f.vat_material_name === materials?.[name]?.vat_material_name,
          )?.dropdown || [];

        return (
          <Row wrap={false}>
            <Form.Item
              className={styles.clear_margin}
              {...restField}
              style={{ marginBottom: 0, width: "100%" }}
              name={[name, "material_name"]}
            >
              <AutoComplete
                showSearch
                showArrow
                disabled={materials?.[name]?.editable === 0}
                onClick={(e: any) => e.target?.select?.()}
                dropdownStyle={{ maxHeight: 400 }}
                placeholder={t("quan_ly_vat.create.material_name") || ""}
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onSelect={(value, option) =>
                  handleSelectMaterial(value, option, name)
                }
                options={options.map((item: any) => ({
                  ...item,
                  label: item.material_name,
                  value: item.material_id,
                }))}
              />
            </Form.Item>
            <Tooltip title={"Nhấn để gợi ý"}>
              <Button
                disabled={materials?.[name]?.editable === 0}
                loading={loadingSuggest === name}
                style={{ marginLeft: 10 }}
                onClick={handleSuggest(
                  materials?.[name]?.vat_material_name,
                  name,
                )}
                type="primary"
              >
                <SearchOutlined /> ({options.length})
              </Button>
            </Tooltip>
          </Row>
        );
      },
    },
    {
      title: t("quan_ly_vat.create.quantity"),
      dataIndex: "quantity",
      align: "right",
      width: 100,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "quantity"]}
        >
          <InputNumber
            placeholder={t("quan_ly_vat.create.unit") || ""}
            disabled={materials?.[name]?.editable === 0}
            formatter={formatNumber}
            min={0}
            dir="rtl"
            onFocus={(e) => (e.target.dir = "ltr")}
            onBlur={(e) => (e.target.dir = "rtl")}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.co_available"),
      dataIndex: "co_available",
      align: "right",
      width: 100,
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "co_available"]}
        >
          <Typography.Text
            type={
              !checkAvailableCOInVAT(materials?.[name]) ? "danger" : undefined
            }
          >
            <DetailQuantityModal
              value={formatNumber(materials?.[name]?.co_available || 0)}
              sort_order={materials?.[name]?.sort_order}
              vatInvoiceDetail={materials?.[name]}
              vatInvoice={dataVat}
            />
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.unit"),
      dataIndex: "unit",
      width: 100,
      align: "center",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit"]}
        >
          <Input
            disabled={materials?.[name]?.editable === 0}
            placeholder={t("quan_ly_vat.create.unit") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.unit_price"),
      dataIndex: "unit_price",
      width: 150,
      align: "right",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_price"]}
        >
          <InputNumber
            placeholder={t("quan_ly_vat.create.unit_price") || ""}
            value={materials?.[name]?.unit_price}
            disabled={materials?.[name]?.editable === 0}
            formatter={formatNumber}
            style={{ width: "100%" }}
            min={0}
            dir="rtl"
            onFocus={(e) => (e.target.dir = "ltr")}
            onBlur={(e) => {
              const newMaterials = produce(materials, (draft) => {
                draft[name].unit_price = formatOnlyNumber(e.target.value);
                draft[name].unit_price_cif =
                  usdExchangeRate && usdExchangeRate > 0
                    ? Number(draft[name].unit_price / usdExchangeRate).toFixed(
                        6,
                      )
                    : 0;
              });
              setMaterials(newMaterials);
              e.target.dir = "rtl";
            }}
          />
          {/* {formatNumber(round(materials?.[name]?.unit_price, 6))} */}
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.create.cif_price"),
      dataIndex: "unit_price_cif",
      width: 150,
      align: "right",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_price_cif"]}
        >
          <Typography.Text
            type={
              !checkAvailableCOInVAT(materials?.[name]) ? "danger" : undefined
            }
          >
            {decimalUSD.format(round(materials?.[name]?.unit_price_cif, 6))}
          </Typography.Text>
        </Form.Item>
      ),
    },
    {
      title: t("import_declaration.fields.co_using"),
      align: "right",
      width: 130,
      render: (_, { name, ...restField }) => {
        const value = materials?.[name]?.co_using;

        return (
          <Form.Item
            className={styles.clear_margin}
            style={{ marginBottom: 0 }}
            {...restField}
            name={[name, "co_using"]}
          >
            <Typography.Text>{intlUSD.format(value ?? 0)}</Typography.Text>
          </Form.Item>
        );
      },
    },
  ];

  return (
    <>
      <Space
        align="center"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <Typography.Title level={5}>
          {t("quan_ly_vat.create.title_sub")}
        </Typography.Title>
        <div>
          {groupButtonImport && groupButtonImport()}
          <Button
            loading={loadingBtn}
            disabled={materials?.length <= 0}
            onClick={handleSuggestAll}
            type="primary"
            style={{ fontWeight: 500 }}
          >
            {t("for_all.button_suggest")}
          </Button>
        </div>
      </Space>

      <div style={{ margin: "10px 0" }}>
        <Form.List name={"vat_invoice_detail"}>
          {(fields) => (
            <Table
              size="small"
              bordered
              columns={columns}
              pagination={{
                total: form.getFieldsValue()?.table?.length || 0,
                size: "small",
                style: { margin: "10px 0" },
              }}
              dataSource={fields}
              rowKey={(key) => key.name}
            />
          )}
        </Form.List>
      </div>
    </>
  );
}
