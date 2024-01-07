import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  FormListFieldData,
  FormListOperation,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { OptionProps } from "antd/es/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { getUserSelector } from "@/store/auth/state";
import { formatNumber } from "@/utils/format";
import { decimalUSD } from "@/utils/intl";

import { RULES_DECLARATION_DETAIL } from "../api/createDeclarationReport";
import { useFees } from "../api/getFees";
import styles from "./FormFee.module.scss";

export function FormFee({ form }: { form: any }): JSX.Element {
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const [feeOptions, setFeeOptions] = useState<OptionProps[]>([]);

  const { data: dataFees } = useFees({
    params: {
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        setFeeOptions(
          data.data.map(
            (item) =>
              ({
                label: item.fee_name,
                value: item.fee_id,
                children: [],
              } || []),
          ),
        );
      },
    },
  });

  const handleSelect = (value: string, index: number) => {
    const data = form.getFieldsValue();
    if (data?.fees) {
      data.fees[index].unit = dataFees?.data?.find(
        (f) => f.fee_id === value,
      )?.unit;
      form.setFieldsValue(data);
    }
  };

  const columns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: t("quan_ly_dv_mo_tk.detail.stt"),
      width: "5%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.fee_name"),
      width: "25%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "fee_name"]}
          rules={RULES_DECLARATION_DETAIL.fee_name}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            dropdownStyle={{
              maxHeight: 400,
            }}
            options={feeOptions}
            onSelect={(value) => handleSelect(value, name)}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.quantity"),
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "quantity"]}
          rules={RULES_DECLARATION_DETAIL.quantity}
        >
          <InputNumber
            placeholder={t("quan_ly_dv_mo_tk.detail.quantity") || ""}
            style={{ width: "100%" }}
            formatter={formatNumber}
            min={0}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.unit"),
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit"]}
        >
          <Input
            disabled
            placeholder={t("quan_ly_dv_mo_tk.detail.unit") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.unit_price"),
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_price"]}
          rules={RULES_DECLARATION_DETAIL.unit_price}
        >
          <InputNumber
            placeholder={t("quan_ly_dv_mo_tk.detail.unit_price") || ""}
            style={{ width: "100%" }}
            formatter={formatNumber}
            min={0}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.total"),
      width: "10%",
      align: "right",
      render: (_, { name }) => <MakeMoney name={name} />,
    },
    {
      title: "Action",
      width: "5%",
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
    <Row gutter={16}>
      <Col span={24}>
        <Typography.Title level={5}>
          {t("quan_ly_dv_mo_tk.detail.title_sub_table")}
        </Typography.Title>
        <Form.List name="fees">
          {(fields, { remove, add }) => (
            <Table
              size="small"
              columns={columns({ remove })}
              dataSource={fields}
              bordered
              footer={() => {
                return (
                  <Row justify={"end"}>
                    <Col>
                      <PlusCircleOutlined
                        className={styles.icon_add}
                        onClick={() => add()}
                      />
                    </Col>
                  </Row>
                );
              }}
            />
          )}
        </Form.List>
      </Col>
    </Row>
  );
}

const MakeMoney = ({ name }: { name: number }) => {
  const form = Form.useFormInstance();

  const quantity = Form.useWatch(["fees", name, "quantity"], form);

  const unitPrice = Form.useWatch(["fees", name, "unit_price"], form);

  return (
    <Typography.Text>
      {decimalUSD.format((quantity ?? 0) * (unitPrice ?? 0))}
    </Typography.Text>
  );
};
