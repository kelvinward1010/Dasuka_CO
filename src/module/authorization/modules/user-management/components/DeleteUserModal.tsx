import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
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

import { useDeleteUser } from "../services/deleteUser";

interface Props {
  id: string;
  name: string;
}

export function DeleteUserModal({ id, name }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const handleOpen = () => {
    open();
  };

  const deleteUser = useDeleteUser({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.delete_success"),
        });
        queryClient.invalidateQueries(["users"]);
      },
      onError: (err) => {
        notification.error({
          message: t("message.delete_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    deleteUser.mutate({
      list_json: [{ user_id: id }],
      updated_by_id: userRecoil?.user_id || userRecoil?.user_name,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_delete")}>
        <Button type="default" size="small" onClick={handleOpen}>
          <DeleteOutlined
            style={{
              color: "#ff4d4f",
              cursor: "pointer",
            }}
          />
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
        confirmLoading={deleteUser.isLoading}
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
          >{`Bạn có muốn xoá `}</Typography.Text>
          <Typography.Text type="danger" style={{ fontSize: "1.1rem" }}>
            {name}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
