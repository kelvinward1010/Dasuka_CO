import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, Modal, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { LOCAL_USER } from "@/constant/config";
import { useDisclosure } from "@/hooks/useDisclosure";
import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { getUserSelector } from "@/store/auth/state";
import storage, { storageService } from "@/utils/storage";

import { useChangePasswordUser } from "../authorization/modules/user-management/services/changePasswordUser";
import { RULES_FORM } from "../authorization/utils/validator";

export default function ChangePasswordModal(): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const password = Form.useWatch([], form);
  const { isOpen, open, close } = useDisclosure();
  const userRecoil = useRecoilValue(getUserSelector);
  const navigate = useNavigate();

  const handleOpen = () => {
    open();
  };

  const changePassword = useChangePasswordUser({
    config: {
      onSuccess: (data) => {
        if (data.success) {
          notification.success({
            message: data.message,
          });
          close();
          form.resetFields();

          storage.clearToken();
          storageService.clearStorage(LOCAL_USER);
          navigate("/login");
        } else {
          notification.error({
            message: data.message,
          });
        }
      },
    },
  });

  const handleOk = async () => {
    form
      .validateFields()
      .then((values) => {
        const dataPost = {
          ...values,
          user_id: userRecoil.user_id,
          lu_user_id: userRecoil.user_id,
        };
        changePassword.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  return (
    <>
      <span onClick={handleOpen}>{t("for_all.change_password")}</span>
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={400}
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
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("for_all.change_password")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical">
            <Row gutter={32}>
              <Col span={24}>
                <Form.Item
                  name={"old_password"}
                  label={t("authorization.users.table.old_password")}
                  rules={[...RULES_FORM.required]}
                >
                  <Input.Password
                    placeholder={
                      t("authorization.users.table.old_password") || ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={"new_password"}
                  label={t("authorization.users.table.new_password")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.password]}
                >
                  <Input.Password
                    placeholder={
                      t("authorization.users.table.new_password") || ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name={"confirm_new_password"}
                  label={t("authorization.users.table.confirm_new_password")}
                  rules={[
                    {
                      validator(_, __, callback) {
                        try {
                          if (
                            password.new_password &&
                            password.confirm_new_password &&
                            password?.confirm_new_password !==
                              password?.new_password
                          )
                            throw new Error("Mật khẩu mới không khớp");
                          else callback(undefined);
                        } catch (err: any) {
                          callback(err);
                        }
                      },
                    },
                    ...RULES_FORM.required,
                    ...RULES_FORM.password,
                  ]}
                >
                  <Input.Password
                    placeholder={
                      t("authorization.users.table.confirm_new_password") || ""
                    }
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
