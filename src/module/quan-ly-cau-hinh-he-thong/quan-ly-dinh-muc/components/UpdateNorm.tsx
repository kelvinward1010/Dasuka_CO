import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, Modal, Row, Select, Typography } from "antd";

import { useDisclosure } from "@/hooks/useDisclosure";

import { useNorm } from "../api/getNorm";
import styles from "../style.module.scss";
import { ImportNormDetailTable } from "./ImportNormDetail";

interface Props {
  norm_id: number;
  norm_name: string;
}

export function UpdateNorm({ norm_id, norm_name }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();

  const { data: norm } = useNorm({
    id: norm_id!,
    config: {
      enabled: isOpen,
      onSuccess(data) {
        form.setFieldsValue(data);
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>{norm_name}</Typography.Link>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"80%"}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        footer={null}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Chi tiết định mức
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical" disabled>
            {/* <Form.Item name="customer_id" hidden></Form.Item> */}
            <Row gutter={32} justify="space-between" align="bottom">
              <Col span={12}>
                <Form.Item
                  name="product_name"
                  label="Chọn sản phẩm cần thêm định mức"
                  rules={[{ required: true, message: "Hãy chọn sản phẩm!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder={"Sản phẩm"} className={styles.select} />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  label="Tên định mức"
                  name="norm_name"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên định mức!",
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Tên định mức" disabled />
                </Form.Item>
              </Col>
              <Col span={3} className={styles.text_right}></Col>
            </Row>
          </Form>
          {/* <br /> */}
          <div style={{ padding: 17.5, paddingTop: 0 }}>
            {/* <Typography.Title level={5}>
              Danh sách nguyên liệu, vật tư
            </Typography.Title> */}
            <ImportNormDetailTable
              norm_id={norm?.norm_id || 0}
              normDetail={norm?.norm_detail ?? []}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
