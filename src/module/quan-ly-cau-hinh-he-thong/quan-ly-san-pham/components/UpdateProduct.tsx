import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useUnits } from "../../quan-ly-don-vi/api/getUnits";
import { useUpdateProduct } from "../api/updateProduct";
import styles from "../style.module.scss";
import { IProduct } from "../types";

// const { Text } = Typography;
interface Props {
  product: IProduct;
}

const { Option } = Select;

export default function UpdateProduct({ product }: Props) {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const { data: listUnits } = useUnits({
    params: {
      pageIndex: 1,
      pageSize: 1000,
      user_id: userRecoil.user_id,
    },
  });

  const updateProduct = useUpdateProduct({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["products"]);
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

  const handleOpenModal = () => {
    form.setFieldsValue(product);
    open();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        updateProduct.mutate({
          ...values,
          lu_user_id: userRecoil.user_id,
        });
        close();
      })
      .catch(() => {
        notification.warning({
          message: t("Bạn cần điền đầy đủ thông tin!"),
        });
      });
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <Typography.Link onClick={handleOpenModal}>
        {product.hs_code}
      </Typography.Link>
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"55%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateProduct.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_san_pham.input_detail.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical" name="form_in_modal">
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_san_pham.input_detail.ma_hs")}
                  name="hs_code"
                  rules={[...RULES_FORM.required, ...RULES_FORM.number]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_san_pham.input_detail.ma_sp")}
                  name="product_code"
                  rules={[...RULES_FORM.required]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_san_pham.input_detail.name_sp")}
                  name="product_name"
                  rules={[...RULES_FORM.required]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_san_pham.input_detail.dvt")}
                  name="unit"
                  rules={[...RULES_FORM.required]}
                >
                  <Select
                    placeholder="Chọn một trong các đơn vị"
                    dropdownStyle={{ maxHeight: 400 }}
                    showSearch
                    filterOption={(input, option) => {
                      return (option?.value + "" ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                  >
                    {listUnits?.data?.map((unit) => (
                      <Option key={unit.unit_id} value={unit.unit_id}>
                        {unit.unit_id}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="product_id" hidden></Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}
