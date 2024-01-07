import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { FormListFieldData } from "antd/lib/form";

import { RULES_VAT_INVOICE_DETAIL } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/api/createVatInvoice";
import { formatNumber } from "@/utils/format";
import { decimalUSD } from "@/utils/intl";

export function DanhSachHangHoavatTable() {
  const columns = (): TableColumnsType<FormListFieldData> => [
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
      title: "Mã hàng hóa",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "material_id"]}
          rules={RULES_VAT_INVOICE_DETAIL.material_id}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Tên hàng hóa",
      width: "25%",
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
  ];
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Typography.Title level={5}>Danh sách hàng hóa</Typography.Title>
          <Form.List name="vat_invoice_detail">
            {(fields) => (
              <Table
                size="small"
                bordered
                columns={columns()}
                dataSource={fields}
              />
            )}
          </Form.List>
        </Col>
      </Row>
    </>
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
