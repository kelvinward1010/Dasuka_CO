import { Button, Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import { useState } from "react";

import styles from "../../../style.module.scss";
import { DanhSachHangHoavatTable } from "../tables/danh-sach-hang-hoa-vat";

const { Text } = Typography;

interface dataset {
  setModal: any;
}

export function ThemHoaDonVat(props: dataset) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({
    so_hoa_don: "",
    ma_so_thue: "",
    ten_don_vi_ban_hang: "",
  });
  const showModal = () => {
    setIsModalOpen(true);
    props.setModal(false);
  };
  const handleOk = (value: any) => {
    console.log(value);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    console.log(value);
  };
  const handleChangeSelect = (value: any) => {
    setValues({ ...values, ten_don_vi_ban_hang: value });
  };
  return (
    <>
      <Button onClick={showModal} className={styles.add_btn_vat_modal}>
        Thêm mới VAT
      </Button>
      <Modal
        title="Thêm mới hóa đơn VAT"
        okText={"Lưu"}
        className={"modal_cnt"}
        width={"80vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            handleOk(values);
          });
        }}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
          >
            <Col className="gutter-row" span={6}>
              <Form.Item
                name="so_hoa_don"
                label="Số hóa đơn"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the blanks!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Số hóa đơn"
                  name="so_hoa_don"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item
                name="ten_don_vi_ban_hang"
                label="Tên đơn vị bán hàng"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the blanks!",
                  },
                ]}
              >
                <Select
                  //name="ten_don_vi_ban_hang"
                  defaultValue={"SEOJIN SYSTEM CO.LTD."}
                  onChange={handleChangeSelect}
                  options={[
                    {
                      value: "SEOJIN SYSTEM CO.LTD.",
                      label: "SEOJIN SYSTEM CO.LTD.",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className={styles.thd_top}>
          <Text strong>Danh sách hàng hóa</Text>
          <DanhSachHangHoavatTable />
        </div>
      </Modal>
    </>
  );
}
