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
import { getUserSelector } from "@/store/auth/state";

import { useUpdateFee } from "../api/updateFee";
import { SELECT_FEE_TYPE, SELECT_UNIT } from "../config/data";
import styles from "../style.module.scss";
import { Fee } from "../types";

// const { Text } = Typography;
interface Props {
  fee: Fee;
}

export default function UpdateFeeModal({ fee }: Props) {
  const [form] = Form.useForm();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const updateFee = useUpdateFee({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["fees"]);
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
    form.setFieldsValue(fee);
    open();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        updateFee.mutate({
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
      <Typography.Link
        style={{ width: "100%", display: "block" }}
        className={styles.link}
        onClick={handleOpenModal}
      >
        {fee.fee_id}
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
        maskClosable={false}
        destroyOnClose
        confirmLoading={updateFee.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_phi.detail.title")}
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
                  label={t("quan_ly_phi.detail.fee_id")}
                  name="fee_id"
                  rules={[{ required: true, message: "Không thể để trống" }]}
                >
                  <Input
                    type="text"
                    placeholder={t("quan_ly_phi.detail.fee_id") || ""}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_phi.detail.fee_name")}
                  name="fee_name"
                  rules={[{ required: true, message: "Không thể để trống" }]}
                >
                  <Input
                    type="text"
                    placeholder={t("quan_ly_phi.detail.fee_name") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_phi.detail.unit")}
                  name="unit"
                  rules={[{ required: true, message: "Không thể để trống" }]}
                >
                  <Select
                    placeholder={t("quan_ly_phi.detail.unit")}
                    options={SELECT_UNIT}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_phi.detail.fee_type")}
                  name="fee_type"
                  rules={[{ required: true, message: "Không thể để trống" }]}
                >
                  <Select
                    placeholder={t("quan_ly_phi.detail.fee_type")}
                    options={SELECT_FEE_TYPE}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
}
