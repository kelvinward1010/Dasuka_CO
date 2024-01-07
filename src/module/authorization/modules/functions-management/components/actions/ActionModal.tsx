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
import { getFunctionIdSelector } from "@/module/authorization/store/state";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useCreateAction } from "../../services/actions/createAction";
import { useAction } from "../../services/actions/getAction";
import { useUpdateAction } from "../../services/actions/updateAction";

interface Props {
  isCreate: boolean;
  id?: string;
}

export function ActionModal({ isCreate, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const function_id = useRecoilValue(getFunctionIdSelector);
  const userRecoil = useRecoilValue(getUserSelector);
  const { t } = useTranslation();

  useAction({
    id: id!,
    config: {
      enabled: isOpen && !!id,
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const createAction = useCreateAction({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        close();
        queryClient.invalidateQueries(["actions"]);
        form.resetFields();
      },
      onError: () => {
        notification.error({
          message: t("message.create_failure"),
        });
      },
    },
  });

  const updateAction = useUpdateAction({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_update"),
        });
        close();
        queryClient.invalidateQueries(["actions"]);
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
    close();
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const dataPost = {
          ...values,
          function_id,
          lu_user_id: userRecoil.user_id,
          created_by_user_id: userRecoil.user_id,
        };
        isCreate
          ? createAction.mutate(dataPost)
          : updateAction.mutate(dataPost);
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
        <Button
          type="primary"
          className={`${styles.button} ${styles.button_create}`}
          onClick={handleOpen}
          disabled={!function_id}
        >
          {t("for_all.button_create")}
        </Button>
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
        style={{ top: 110 }}
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
        confirmLoading={
          isCreate ? createAction.isLoading : updateAction.isLoading
        }
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
              ? t("authorization.actions.modal.title_create")
              : t("authorization.actions.modal.title_update")}
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
              <Col span={12}>
                <Form.Item
                  label={t("authorization.actions.table.action_code")}
                  name={"action_code"}
                  rules={[...RULES_FORM.required]}
                >
                  <Input
                    placeholder={
                      t("authorization.actions.table.action_code") || ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="action_name"
                  label={t("authorization.actions.table.action_name")}
                  rules={[...RULES_FORM.required]}
                >
                  <Input
                    placeholder={
                      t("authorization.actions.table.action_name") || ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label={t("authorization.actions.table.description")}
                >
                  <Input.TextArea
                    placeholder={
                      t("authorization.actions.table.description") || ""
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
