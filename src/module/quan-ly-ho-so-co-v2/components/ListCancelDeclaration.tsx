import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  TableColumnProps,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";

import { useDisclosure } from "@/hooks/useDisclosure";
import { getChiTietHoSoCOUrl } from "@/urls";

import { useGetCancelDeclaration } from "../api/getCancelDeclaration";
import styles from "../style.module.scss";

export default function ListCancelDeclaration(): JSX.Element {
  const { t } = useTranslation();
  const { isOpen, open, close } = useDisclosure();

  const cancelDeclaration = useGetCancelDeclaration({});

  const columns: TableColumnProps<any>[] = [
    {
      key: "datetime",
      title: "Thời gian",
      dataIndex: "datetime",
      align: "center",
      width: 200,
    },
    {
      key: "declaration_id",
      title: "Tờ khai bị hủy",
      dataIndex: "declaration_id",
      align: "center",
      width: 200,
    },
    {
      key: "co_documents",
      title: "Bộ hồ sơ CO chứa tờ khai bị hủy",
      dataIndex: "co_documents",
      render(value: string[]) {
        return value.map((item, index) => (
          <Typography.Link
            key={index}
            strong
            href={getChiTietHoSoCOUrl(item)}
            target="_blank"
          >
            {item}
            {index === value.length - 1 ? "" : ", "}
          </Typography.Link>
        ));
      },
    },
  ];

  return (
    <>
      <Button
        className={`button`}
        style={{ background: "#ffb703" }}
        type="primary"
        onClick={open}
      >
        {"Xem bộ CO chứa TK hủy"}
      </Button>
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
            Lịch sử bộ hồ sơ CO chứa tờ khai bị hủy
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={close}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body" style={{ padding: 15 }}>
          <Table
            size="small"
            columns={columns}
            dataSource={cancelDeclaration.data?.data}
          />
        </div>
      </Modal>
    </>
  );
}
