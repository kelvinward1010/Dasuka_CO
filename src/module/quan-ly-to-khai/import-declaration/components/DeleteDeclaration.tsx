import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { IMessageDeleteVat } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/DeleteVatInvoice";
import { getUserSelector } from "@/store/auth/state";
import { chiTietHoSoCOUrl } from "@/urls";

import { useDeleteExportExpected } from "../../export-declaration-expected/api/deleteExportExpected";
import { useDeleteExportDeclaration } from "../../export-declaration/api/deleteExportDeclaration";
import styles from "../../style.module.scss";
import { useDeleteImportDeclaration } from "../api/deleteImportDeclaration";

interface Props {
  declaration_id: string;
  isImport?: boolean;
  co_used: number;
  isExpected?: boolean;
}

export function DeleteDeclaration({
  declaration_id,
  isImport = true,
  isExpected = false,
  co_used,
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

  const getLinkCODocument = (list_ids: string[] | number[] | null) => {
    if (list_ids) {
      const url = chiTietHoSoCOUrl.replace(":id", "");

      return (
        <div>
          <span>Danh sách CO: </span>
          {list_ids?.map((id, index) => (
            <Typography.Link href={url + id}>
              {id} {index === list_ids.length - 1 ? "" : ", "}
            </Typography.Link>
          ))}
        </div>
      );
    }
  };

  const deleteImportDeclaration = useDeleteImportDeclaration({
    config: {
      onSuccess: (data: IMessageDeleteVat[]) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.status) {
              notification.success({
                message:
                  message.message + ": " + message.import_declaration_number,
              });
            } else {
              notification.error({
                message: message.message,
                description: getLinkCODocument(message.co_document_ids),
              });
            }
          });
        }
        queryClient.invalidateQueries(["import-declarations"]);
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

  const deleteExportDeclaration = useDeleteExportDeclaration({
    config: {
      onSuccess: (data: IMessageDeleteVat[]) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.status) {
              notification.success({
                message:
                  message.message + ": " + message.export_declaration_number,
              });
            } else {
              notification.error({
                message: message.message,
                description: getLinkCODocument(message.co_document_ids),
              });
            }
          });
        }
        queryClient.invalidateQueries(["export-declarations"]);
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

  const deleteExportExpected = useDeleteExportExpected({
    config: {
      onSuccess: (data: IMessageDeleteVat[]) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.status) {
              notification.success({
                message:
                  message.message + ": " + message.export_declaration_number,
              });
            } else {
              notification.error({
                message: message.message,
                description: getLinkCODocument(message.co_document_ids),
              });
            }
          });
        }
        queryClient.invalidateQueries(["export-expected-s"]);
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
    if (co_used > 0) {
      notification.info({
        message: `Bạn không thể xóa do tờ khai ${declaration_id} đã được dùng làm CO.`,
      });
    }
    if (isExpected) {
      deleteExportExpected.mutate({
        list_json: [{ export_declaration_id: declaration_id }],
        updated_by_id: userRecoil.user_id,
      });
      return;
    }
    if (isImport) {
      deleteImportDeclaration.mutate({
        list_json: [{ import_declaration_id: declaration_id }],
        updated_by_id: userRecoil.user_id,
      });
    } else {
      deleteExportDeclaration.mutate({
        list_json: [{ export_declaration_id: declaration_id }],
        updated_by_id: userRecoil.user_id,
      });
    }
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
        confirmLoading={deleteImportDeclaration.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Xóa tờ khai
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
            {declaration_id}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
