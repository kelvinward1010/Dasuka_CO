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
  Table,
  TableColumnsType,
  Typography,
} from "antd";

import { XoaIcon } from "@/assets/svg";
import { formatNumber } from "@/utils/format";
import { decimalUSD } from "@/utils/intl";

import { RULES_VAT_INVOICE_DETAIL } from "../api/createVatInvoice";
import styles from "./FormVatInvoice.module.scss";

export function FormVatInvoice(): JSX.Element {
  const columns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: "Mã HS",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "hs_code"]}
          rules={RULES_VAT_INVOICE_DETAIL.hs_code}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Mã NL, VT",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "material_code"]}
          rules={RULES_VAT_INVOICE_DETAIL.material_id}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Tên NL, VT",
      width: "25%",
      // sortDirections: ["descend"],
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "material_name"]}
          rules={RULES_VAT_INVOICE_DETAIL.material_name}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Số lượng",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "quantity"]}
          rules={RULES_VAT_INVOICE_DETAIL.quantity}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={formatNumber}
            min={0}
          />
        </Form.Item>
      ),
    },
    {
      title: "ĐVT",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "unit"]}
          rules={RULES_VAT_INVOICE_DETAIL.unit}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Đơn giá (USD)",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "unit_price"]}
          rules={RULES_VAT_INVOICE_DETAIL.unit_price}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={formatNumber}
            min={0}
          />
        </Form.Item>
      ),
    },
    {
      title: "Thành tiền(USD)",
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
      <Form.Item name="customer_name" hidden></Form.Item>
      <Form.Item name="customer_id" hidden></Form.Item>
      <Form.Item name="status" hidden></Form.Item>
      <Col span={24}>
        <Typography.Title level={5}>Danh sách NL, VT</Typography.Title>
        <Form.List name="vat_invoice_detail">
          {(fields, { remove, add }) => (
            <Table
              size="small"
              bordered
              columns={columns({ remove })}
              dataSource={fields}
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

  const quantity = Form.useWatch(
    ["vat_invoice_detail", name, "quantity"],
    form,
  );

  const unitPrice = Form.useWatch(
    ["vat_invoice_detail", name, "unit_price"],
    form,
  );

  return (
    <Typography.Text>
      {decimalUSD.format((quantity ?? 0) * (unitPrice ?? 0))}
    </Typography.Text>
  );
};
