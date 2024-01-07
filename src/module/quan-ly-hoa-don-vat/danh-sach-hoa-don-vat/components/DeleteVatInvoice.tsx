import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { deleteFile } from "@/apis/downloadFile";
import { XoaIcon } from "@/assets/svg";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";
import { chiTietHoSoCOUrl } from "@/urls";

import { useDeleteVatInvoice } from "../api/deleteVatInvoice";
import styles from "../style.module.scss";
import { VatInvoice } from "../types";

interface Props {
  vat_invoice: VatInvoice;
}

export type IMessageDeleteVat = {
  co_document_ids: string[] | number[] | null;
  message: string;
  status: number;
  vat_invoice_id: string | number | null;
  import_declaration_id: string | number | null;
  import_declaration_number: string | number | null;
  export_declaration_id: string | number | null;
  export_declaration_number: string | number | null;
};

export function DeleteVatInvoice({ vat_invoice }: Props): JSX.Element {
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

  const deleteVatInvoice = useDeleteVatInvoice({
    config: {
      onSuccess: (data: IMessageDeleteVat[]) => {
        if (data.length > 0) {
          data.forEach((message) => {
            if (message.status) {
              notification.success({
                message: message.message + ": " + message.vat_invoice_id,
              });
              if (vat_invoice.file_path) deleteFile(vat_invoice.file_path);
            } else {
              notification.error({
                message: message.message,
                description: getLinkCODocument(message.co_document_ids),
              });
            }
          });
        }
        queryClient.invalidateQueries(["vat_invoices"]);
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
    deleteVatInvoice.mutate({
      list_json: [{ vat_invoice_id: vat_invoice.vat_invoice_id }],
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
        confirmLoading={deleteVatInvoice.isLoading}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Xóa hóa đơn VAT
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
            {vat_invoice?.vat_invoice_id}{" "}
          </Typography.Text>
          ?
        </div>
      </Modal>
    </>
  );
}
