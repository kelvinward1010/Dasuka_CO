import { CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Col, List, Modal, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useCheckCancelDeclaration } from "@/module/quan-ly-ho-so-co-v2/api/checkCancelDeclaration";

import styles from "../../style.module.scss";

export default function CheckCancelDeclaration(): JSX.Element {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isOpen, open, close } = useDisclosure();

  const cancelDeclaration = useCheckCancelDeclaration({
    co_id: id!,
    config: {
      onSuccess: (data) => {
        if (data.success && data.canceled_declarations) {
          open();
        }
      },
    },
  });

  return (
    <Modal
      style={{ top: 110 }}
      open={isOpen}
      width={"600px"}
      okText={"Trở lại"}
      cancelButtonProps={{
        hidden: true,
      }}
      cancelText={t("for_all.button_cancel")}
      onOk={close}
      maskClosable={false}
      destroyOnClose
      onCancel={close}
      closable={false}
      className={styles.modal}
    >
      <Row
        gutter={16}
        justify={"space-between"}
        className={styles.modal_header}
      >
        <Typography.Title level={4} className={styles.modal_header_title}>
          Cảnh báo <WarningOutlined style={{ color: "#ffb703" }} />
        </Typography.Title>
        <Col>
          <CloseCircleOutlined
            onClick={close}
            className={styles.modal_header_close}
          ></CloseCircleOutlined>
        </Col>
      </Row>
      <div className="modal-body" style={{ padding: 15 }}>
        <Typography.Title level={5} type="danger">
          Bộ hồ sơ CO đang chọn có chứa NVL nằm trong tờ khai bị hủy, danh sách
          các NVL - STT - Tờ khai bị hủy:
        </Typography.Title>
        <List loading={cancelDeclaration.isLoading}>
          {cancelDeclaration.data?.data?.map((item: any, index: number) => (
            <List.Item key={index}>
              <Typography.Text strong>
                {`${item.matpro_code} - STT ${item.order_number} - ${item.declaration_number}`}
              </Typography.Text>
            </List.Item>
          ))}
        </List>
      </div>
    </Modal>
  );
}
