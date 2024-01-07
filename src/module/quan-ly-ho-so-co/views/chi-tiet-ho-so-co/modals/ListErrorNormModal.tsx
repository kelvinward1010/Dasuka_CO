import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Table, TableColumnsType, Typography } from "antd";

import styles from "./ChiTietBoTaiLieu.module.scss";

interface item {
  file: string;
  error: string;
}

interface Props {
  listItems: item[];
  setList: any;
  showModal: boolean;
  setShowModal: any;
}

const messageFind = [
  "STT chỉ định sai",
  "Các đơn vị tính sau không hợp lệ",
  "Các tờ khai nhập/vat sau không có mã hợp đồng hoặc mã hợp đồng không khớp với tờ khai nhập",
  "Các cặp Tờ khai-NVL dưới đây có lỗi, vui lòng kiểm tra lại",
  "Các cặp VAT-NVL dưới đây có lỗi, vui lòng kiểm tra lại",
];

export function ListErrorNormModal({
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

  const handleFormatMessageNorm = (message: string) => {
    const text = messageFind.find((m) => message?.includes(m));
    if (text) {
      const paragraphs = message?.split(";");

      return (
        paragraphs &&
        paragraphs?.map((paragraph: string) => {
          const params = paragraph?.split(":");

          const title = params[0];
          const listItems = params[1]?.split(",");

          return (
            <div>
              <div>{title}:</div>
              <div style={{ maxHeight: 150, overflowY: "auto" }}>
                {listItems &&
                  listItems.map((item, index: number) => {
                    const listTextArrow = item.split("=>");
                    return (
                      <div>
                        {listTextArrow[0]
                          .replace(/ -/g, ":")
                          .replace(/\)|\(/g, "")}
                        {" => "}{" "}
                        <Typography.Text type="danger">
                          {listTextArrow?.[1]}
                        </Typography.Text>
                        {index === listItems?.length - 1 ? ";" : ","}
                      </div>
                    );
                  })}
              </div>
              <br />
            </div>
          );
        })
      );
    }

    return message;
  };

  const columns: TableColumnsType<item> = [
    {
      title: "STT",
      width: "10%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: "Tên file",
      dataIndex: "file",
      key: "file",
      sorter: (a, b) => {
        const nameA = a?.file.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.file.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Tên lỗi",
      dataIndex: "error",
      key: "error",
      sorter: (a, b) => {
        const nameA = a?.error.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.error.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },

      render: (value: string) => {
        return handleFormatMessageNorm(value);
      },
    },
  ];

  return (
    <>
      <Modal
        zIndex={10000}
        style={{ top: 110 }}
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
            Danh sách lỗi khi thêm mới định mức
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>

        <div className="modal-body">
          <div className={styles.top_ctbtl}>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={listItems}
              rowKey={(record) => record.file}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
