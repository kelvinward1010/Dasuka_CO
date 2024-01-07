import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useCreateRole } from "../services/roles/createRole";
import { useRole } from "../services/roles/getRole";
import { useUpdateRole } from "../services/roles/updateRole";

interface Props {
  isCreate: boolean;
  id?: string;
}

export function RoleModal({ isCreate, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const userRecoil = useRecoilValue(getUserSelector);
  const { t } = useTranslation();

  useRole({
    id: id!,
    config: {
      enabled: isOpen && !!id,
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const createRole = useCreateRole({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        close();
        queryClient.invalidateQueries(["roles"]);
        form.resetFields();
      },
      onError: () => {
        notification.error({
          message: t("message.create_failure"),
        });
      },
    },
  });

  const updateRole = useUpdateRole({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_update"),
        });
        close();
        queryClient.invalidateQueries(["roles"]);
        form.resetFields();
      },
      onError: () => {
        notification.error({
          message: t("message.update_failure"),
        });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const dataPost = {
          ...values,
          role_id: id,
          lu_user_id: userRecoil.user_id,
          created_by_user_id: userRecoil.user_id,
        };
        isCreate ? createRole.mutate(dataPost) : updateRole.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: "Cần điền đầy đủ thông tin",
        });
      });
  };

  return (
    <>
      {isCreate ? (
        <Tooltip title={t("authorization.tooltip.btn_create")}>
          <Button
            type="primary"
            onClick={handleOpen}
            className={`${styles.button} ${styles.button_create}`}
          >
            {t("for_all.button_create")}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title={t("authorization.tooltip.btn_update")}>
          <Button type="default" size="small" onClick={handleOpen}>
            <EditOutlined
              style={{
                color: "#faad14",
                cursor: "pointer",
              }}
            />
          </Button>
        </Tooltip>
      )}
      <Modal
        centered
        open={isOpen}
        width={"40%"}
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
        // confirmLoading={createFee.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {isCreate
              ? t("authorization.roles.modal.title_create")
              : t("authorization.roles.modal.title_update")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <Form form={form} layout="vertical">
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label={t("authorization.roles.table.role_code")}
                name={"role_code"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={t("authorization.roles.table.role_code") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("authorization.roles.table.role_name")}
                name={"role_name"}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={t("authorization.roles.table.role_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label={t("authorization.roles.table.description")}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder={t("authorization.roles.table.description") || ""}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
