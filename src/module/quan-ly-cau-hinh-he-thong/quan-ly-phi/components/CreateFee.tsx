import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
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

import { RULES_FEE_CREATE, useCreateFee } from "../api/createFee";
import { SELECT_FEE_TYPE, SELECT_UNIT } from "../config/data";
import styles from "../style.module.scss";

export function CreateFee(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const createFee = useCreateFee({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["fees"]);
        close();
        form.resetFields();
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
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
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ ...values }) => {
        createFee.mutate({
          ...values,
          created_by_user_id: userRecoil.user_id,
        });
        close();
      })
      .catch(() => {
        notification.warning({
          message: t("Bạn cần điền đầy đủ thông tin!"),
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
        maskClosable={false}
        destroyOnClose
        onCancel={handleCancel}
        confirmLoading={createFee.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_phi.create.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical">
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label={t("quan_ly_phi.detail.fee_id")}
                  name={"fee_id"}
                  rules={RULES_FEE_CREATE.fee_id}
                >
                  <Input placeholder={t("quan_ly_phi.detail.fee_id") || ""} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fee_name"
                  label={t("quan_ly_phi.detail.fee_name")}
                  rules={RULES_FEE_CREATE.fee_name}
                >
                  <Input placeholder={t("quan_ly_phi.detail.fee_name") || ""} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="unit"
                  label={t("quan_ly_phi.detail.unit")}
                  rules={RULES_FEE_CREATE.unit}
                >
                  <Select
                    placeholder={t("quan_ly_phi.detail.unit")}
                    options={SELECT_UNIT}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fee_type"
                  label={t("quan_ly_phi.detail.fee_type")}
                  rules={RULES_FEE_CREATE.fee_type}
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
