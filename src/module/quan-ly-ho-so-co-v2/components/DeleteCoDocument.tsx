import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useDeleteCoDocument } from "../api/deleteCoDocument";
import styles from "../style.module.scss";

interface Props {
  co_document_id: string;
  status: string | number;
}

export function DeleteCoDocument({
  co_document_id,
  status,
}: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const handleOpenModal = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const deleteCoDocument = useDeleteCoDocument({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.delete_success"),
        });
        queryClient.invalidateQueries(["co-documents"]);
        close();
      },
      onError: (err) => {
        notification.error({
          message: t("message.delete_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOk = () => {
    deleteCoDocument.mutate({
      list_json: [{ co_document_id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Typography.Link
        style={{ width: "100%", display: "block" }}
        className={styles.link}
        onClick={handleOpenModal}
        disabled={status !== 2}
      >
        <Button disabled={status !== 2} icon={<XoaIcon />} type="text" danger />
      </Typography.Link>
      <Modal
        centered
        open={isOpen}
        width={"30%"}
        okText={t("for_all.button_delete_ok")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
          disabled: status !== 2,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_delete_no")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={deleteCoDocument.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Xóa Hồ sơ Co
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
          >{`Bạn có muốn xoá hồ sơ `}</Typography.Text>
          <Typography.Text type="danger" style={{ fontSize: "1.1rem" }}>
            {co_document_id}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
