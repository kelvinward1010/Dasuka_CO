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
import { getFunctionIdSelector } from "@/module/authorization/store/state";
import { getUserSelector } from "@/store/auth/state";

import { useDeleteFunction } from "../services/functions/deleteFunction";

export function DeleteFunctionModal(): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const function_id = useRecoilValue(getFunctionIdSelector);
  const userRecoil = useRecoilValue(getUserSelector);
  const { t } = useTranslation();

  const deleteFunction = useDeleteFunction({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.delete_success"),
        });
        queryClient.invalidateQueries(["functions"]);
        close();
      },
      onError: () => {
        notification.error({ message: t("message.delete_failure") });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    deleteFunction.mutate({
      list_json: [{ function_id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_delete")}>
        <Button type="default" disabled={!function_id} onClick={handleOpen}>
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
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
        // confirmLoading={deleteFee.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("authorization.functions.modal.title_delete")}
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
            {function_id}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
