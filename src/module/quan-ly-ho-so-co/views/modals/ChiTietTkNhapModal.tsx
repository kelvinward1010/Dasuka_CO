import { Col, Form, Input, Modal, Row, Typography } from "antd";
import { useState } from "react";

import ChiTietTkNhapTable from "../tables/chi-tiet-tk-nhap-table";

const { Text } = Typography;

interface dataset {
  // stk: any;
  // date: string;
  // bill: any;
  // number_invoice: any;
  // people_xk: any;
  // dkvc: any;
  // data_table: any[];
  open: boolean;
  setOpen: any;
}

export default function ChiTietToKhaiNhapModal(props: dataset) {
  const [form] = Form.useForm();
  const [data] = useState<any[]>([]);
  const [isModalOpen] = useState(props.open);

  const handleOk = () => {
    props.setOpen(false);
  };

  const handleCancel = () => {
    props.setOpen(false);
  };

  return (
    <>
      <Modal
        title="Chi tiết tờ khai nhập khẩu"
        okText={"Quay lại"}
        className={"modal_cnt"}
        width={"80vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            form.resetFields();
            handleOk();
          });
        }}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row justify={"space-between"}>
            <Col span={5}>
              <Form.Item label="Số tờ khai">
                <Input type="text" placeholder="Số tờ khai" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Số Invoice">
                <Input type="text" placeholder="Số Invoice" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Bill">
                <Input type="text" placeholder="Bill" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Người xuất khẩu">
                <Input type="text" placeholder="Người xuất khẩu" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row justify={"space-between"}>
            <Col span={5}>
              <Form.Item label="Ngày khai">
                <Input type="text" placeholder="Ngày khai" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Điều kiện vận chuyển">
                <Input type="text" placeholder="Điều kiện vận chuyển" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Phí vận chuyển">
                <Input type="text" placeholder="Phí vận chuyển" />
              </Form.Item>
            </Col>
            <Col span={5}></Col>
          </Row>
        </Form>
        <div style={{ marginTop: "30px" }}>
          <Text strong>Danh sách hàng hóa</Text>
          <ChiTietTkNhapTable data={data} />
        </div>
      </Modal>
    </>
  );
}
