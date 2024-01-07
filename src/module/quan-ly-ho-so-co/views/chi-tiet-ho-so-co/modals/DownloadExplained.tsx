import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

import styles from "./ChiTietBoTaiLieu.module.scss";

interface Props {
  handleSaveCo: (needDownForm?: boolean) => void;
  isLoading?: boolean;
  status?: string;
  isDone?: boolean;
  setStatus: Dispatch<SetStateAction<string | undefined>>;
  handleDownload?: () => void;
}

export function DownloadExplained({
  handleSaveCo,
  isLoading = false,
  status = "2",
  isDone = false,
  setStatus,
  handleDownload,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    // Dang thuc hien
    if (status === "2") setIsModalOpen(true);
    else handleCancel();
  };
  const handleOk = () => {
    setStatus("4");
    handleSaveCo(true);
  };
  const handleCancel = async () => {
    if (!isDone) handleSaveCo(true);
    else handleDownload && handleDownload();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        className={"button button_download"}
        loading={isLoading}
        style={{ zIndex: 2 }}
      >
        Tải về form giải trình
      </Button>
      <Modal
        style={{ top: 110 }}
        okText={"Có"}
        cancelText={"Không"}
        className={styles.modal}
        closable={false}
        width={"40vw"}
        bodyStyle={{
          padding: "0px !important",
        }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Chú ý
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={() => setIsModalOpen(false)}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <div style={{ minHeight: 50, padding: 15 }}>
            <Typography.Text style={{ fontSize: 15 }}>
              Bạn có muốn chuyển bộ hồ sơ CO sang trạng thái chờ duyệt (giữ
              NVL)? Điều này sẽ giữ lại NVL để các bộ sau không lấy những NVL đã
              dùng.
            </Typography.Text>
          </div>
        </div>
      </Modal>
    </>
  );
}
