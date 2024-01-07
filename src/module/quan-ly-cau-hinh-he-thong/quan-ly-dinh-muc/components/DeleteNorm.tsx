import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useDeleteNorm } from "../api/deleteNorm";
import styles from "../style.module.scss";

interface Props {
  norm_id: number;
  norm_name: string;
}

export function DeleteNorm({ norm_id, norm_name }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const handleOpenModal = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const deleteNorm = useDeleteNorm({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.delete_success"),
        });
        queryClient.invalidateQueries(["norms"]);
        close();
      },
      onError: () => {
        notification.error({
          message: t("message.delete_failure"),
        });
      },
    },
  });

  const handleOk = () => {
    deleteNorm.mutate({
      list_json: [{ norm_id }],
      updated_by_id: userRecoil.user_id,
    });
  };

  return (
    <>
      <Typography.Link
        style={{ width: "100%", display: "block" }}
        className={styles.link}
        onClick={handleOpenModal}
      >
        <Button icon={<XoaIcon />} type="text" danger />
      </Typography.Link>
      <Modal
        centered
        open={isOpen}
        width={"30%"}
        okText={t("for_all.button_delete_ok")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_delete_no")}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={deleteNorm.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Xóa định mức
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
            {norm_name}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
