import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { RULES_CUSTOMER_CREATE, useCreateQLKH } from "../api/createQLKH";
import styles from "../style.module.scss";

export function CreateQLKH(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const createQLKH = useCreateQLKH({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["qlkhs"]);
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
    form.validateFields().then((values) => {
      createQLKH.mutate({
        ...values,
        created_by_user_id: userRecoil.user_id,
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
        width={"60%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        className={styles.modal}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        confirmLoading={createQLKH.isLoading}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_khach_hang.create_cpnt.title_main")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <Form layout="vertical" form={form}>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.create_cpnt.customer_id")}
                name="customer_id"
                rules={RULES_CUSTOMER_CREATE.customer_id}
              >
                <Input placeholder="Mã khách hàng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.create_cpnt.tax_code")}
                name="tax_code"
                rules={RULES_CUSTOMER_CREATE.tax_code}
              >
                <Input placeholder="Mã số thuế" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.create_cpnt.customer_name")}
                name="customer_name"
                rules={RULES_CUSTOMER_CREATE.customer_name}
              >
                <Input placeholder="Tên khách hàng" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.create_cpnt.phone_number")}
                name="phone_number"
                rules={[...RULES_FORM.phone]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("quan_ly_khach_hang.create_cpnt.address")}
                name="address"
                rules={RULES_CUSTOMER_CREATE.address}
              >
                <Input.TextArea placeholder="Địa chỉ khách hàng" rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
