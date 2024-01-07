import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Table, TableColumnsType, Typography } from "antd";

import { IMessage } from "../import-declaration/types";
import styles from "../style.module.scss";

interface Props {
  listItems: IMessage[];
  setList: any;
  showModal: boolean;
  setShowModal: any;
}

export function ListMessagesModal({
  showModal,
  setShowModal,
  listItems,
  setList,
}: Props) {
  const handleOk = async () => {
    setShowModal(false);
    setList([]);
  };

  const handleCancel = () => {
    setShowModal(false);
    setList([]);
  };

  const columns: TableColumnsType<IMessage> = [
    {
      title: "STT",
      width: "10%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, record, index) => (
        <Typography.Text
          type={
            record?.notification?.toLocaleLowerCase()?.indexOf("lỗi") > -1
              ? "danger"
              : undefined
          }
          style={{ textAlign: "center" }}
        >
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: "Tên file",
      dataIndex: "filename",
      key: "filename",
      render: (value, record) => (
        <Typography.Text
          type={
            record?.notification?.toLocaleLowerCase()?.indexOf("lỗi") > -1
              ? "danger"
              : undefined
          }
          style={{ textAlign: "center" }}
        >
          {value}
        </Typography.Text>
      ),
      sorter: (a, b) => {
        const nameA = a?.filename?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.filename?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Tên message",
      dataIndex: "notification",
      key: "notification",
      render: (value, record) => (
        <Typography.Text
          type={
            record?.notification?.toLocaleLowerCase()?.indexOf("lỗi") > -1
              ? "danger"
              : undefined
          }
          style={{ textAlign: "center" }}
        >
          {value}
        </Typography.Text>
      ),
      sorter: (a, b) => {
        const nameA = a?.notification?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.notification?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
  ];

  return (
    <>
      <Modal
        zIndex={10000}
        centered
        width={"60vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={showModal}
        onOk={handleOk}
        closable={false}
        okText={"Đồng ý"}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        className={styles.modal}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Danh sách messages
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>

        <div className={styles.top_ctbtl}>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={listItems}
            rowKey={(record) => record.filename + record.notification}
          />
        </div>
      </Modal>
    </>
  );
}
