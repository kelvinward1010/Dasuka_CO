import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  notification,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { RULES_CUSTOMER_CREATE } from "../api/createQLKH";
import { useQLKH } from "../api/getQLKH";
import { useUpdateQLKH } from "../api/updateQLKH";
import styles from "../style.module.scss";
import { ICustomer } from "../types";

interface UpdateQLKHProps {
  customer: ICustomer;
}

export function UpdateQLKH({ customer }: UpdateQLKHProps): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const [isFee, setIsFee] = useState<number>();

  useQLKH({
    id: customer?.customer_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
        setIsFee(data.processing_fee ?? 0);
      },
    },
  });

  const updateQLKH = useUpdateQLKH({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["qlkhs"]);
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

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      updateQLKH.mutate({
        ...values,
        processing_fee: isFee,
        created_by_user_id: userRecoil.user_id,
      });
    });
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>
        {customer.customer_id}
      </Typography.Link>
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
        confirmLoading={updateQLKH.isLoading}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_khach_hang.update_customer.title_main")}
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
                label={t("quan_ly_khach_hang.update_customer.customer_id")}
                name="customer_id"
                rules={RULES_CUSTOMER_CREATE.customer_id}
              >
                <Input
                  placeholder={
                    t("quan_ly_khach_hang.update_customer.customer_id") || ""
                  }
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.update_customer.tax_code")}
                name="tax_code"
                rules={RULES_CUSTOMER_CREATE.tax_code}
              >
                <Input
                  disabled
                  placeholder={
                    t("quan_ly_khach_hang.update_customer.tax_code") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.update_customer.customer_name")}
                name="customer_name"
                rules={RULES_CUSTOMER_CREATE.customer_name}
              >
                <Input
                  placeholder={
                    t("quan_ly_khach_hang.update_customer.customer_name") || ""
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.update_customer.phone_number")}
                name="phone_number"
                rules={[...RULES_FORM.phone]}
              >
                <Input
                  placeholder={
                    t("quan_ly_khach_hang.update_customer.phone_number") || ""
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("quan_ly_khach_hang.update_customer.address")}
                name="address"
                rules={RULES_CUSTOMER_CREATE.address}
              >
                <Input.TextArea
                  placeholder={
                    t("quan_ly_khach_hang.update_customer.address") || ""
                  }
                  rows={4}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                // label={t("quan_ly_khach_hang.update_customer.processing_fee")}
                name="processing_fee"
              >
                <Checkbox
                  name="processing_fee"
                  checked={isFee === 1}
                  onChange={(e) => {
                    setIsFee(+e.target.checked);
                  }}
                  style={{ userSelect: "none" }}
                >
                  {t("quan_ly_khach_hang.update_customer.processing_fee")}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
