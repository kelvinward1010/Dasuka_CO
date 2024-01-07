import { CloseCircleOutlined, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
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
import { getUserSelector } from "@/store/auth/state";

import { useResetPasswordUser } from "../services/resetPasswordUser";

interface Props {
  user_id: string;
  full_name: string;
}

export function ResetPasswordUserModal({
  user_id,
  full_name,
}: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const handleOpen = () => {
    open();
  };

  const resetPasswordUser = useResetPasswordUser({
    config: {
      onSuccess: (data) => {
        if (data.success) {
          notification.success({
            message: t("message.update_success"),
            description: "Mật khẩu mới: " + data.password,
          });
          queryClient.invalidateQueries(["users"]);
          close();
        } else {
          notification.error({
            message: data.message,
          });
        }
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    resetPasswordUser.mutate({
      user_id,
      lu_user_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_reset_password")}>
        <Button size="small" onClick={handleOpen}>
          <UndoOutlined style={{ color: "#1677ff", cursor: "pointer" }} />
        </Button>
      </Tooltip>
      <Modal
        centered
        open={isOpen}
        width={"30%"}
        okText={"Có"}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={"Không"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={resetPasswordUser.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("authorization.users.modal.title_delete")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>

        <div
          style={{
            textAlign: "center",
            fontWeight: "700",
            margin: "2rem 5rem",
          }}
        >
          <Typography.Text
            // level={4}
            style={{ fontSize: "1.1rem" }}
          >{`Bạn có reset mật khẩu của `}</Typography.Text>
          <Typography.Text type="danger" style={{ fontSize: "1.1rem" }}>
            {full_name}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
