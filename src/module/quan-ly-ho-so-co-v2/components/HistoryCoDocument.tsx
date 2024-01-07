import { CloseCircleOutlined, HistoryOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { useDisclosure } from "@/hooks/useDisclosure";
import { UpdateExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/UpdateExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";

import { useHistories } from "../api/getHistories";
import styles from "../style.module.scss";

const columns: TableColumnsType<any> = [
  {
    title: "Thời gian",
    align: "center",
    dataIndex: "created_date_time",
    width: 100,
    render: (date) => dayjs(date).format("DD/MM/YYYY"),
  },
  {
    title: "Lý do",
    width: "50%",
    dataIndex: "reason",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
  {
    title: "Người phê duyệt",
    dataIndex: "accepted_by",
  },
  {
    title: "Trạng thái",
    dataIndex: "is_accept",
    render: (value) => {
      if (value === null) return "";
      return value ? "Đồng ý" : "Từ chối";
    },
  },
];

export function HistoryCoDocument({
  co_document_id,
}: {
  co_document_id: string;
}): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const { data: dataHistory } = useHistories({
    id: co_document_id,
    config: {
      enabled: isOpen,
    },
  });

  return (
    <>
      <Button
        icon={<HistoryOutlined />}
        title="Lịch sử hồ sơ C/O"
        onClick={handleOpen}
        type="text"
        style={{ color: "#1890ff" }}
      />
      <Modal
        className={styles.modal}
        style={{ top: 110 }}
        width={"80%"}
        bodyStyle={{
          padding: "0px !important",
        }}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_hs_co.histories.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body" style={{ padding: "5px 17px" }}>
          <Form layout="inline">
            <Form.Item label={t("quan_ly_hs_co.histories.employee")}>
              {dataHistory?.fullname}
            </Form.Item>
            <Form.Item label={t("quan_ly_hs_co.histories.date")}>
              {dayjs(dataHistory?.created_date || undefined).format(
                "DD/MM/YYYY",
              )}
            </Form.Item>
            <Form.Item label={t("quan_ly_hs_co.histories.customer")}>
              {dataHistory?.customer_name}
            </Form.Item>
            <Form.Item label={t("quan_ly_hs_co.histories.export_declaration")}>
              {dataHistory &&
                JSON.parse(dataHistory.number_tkx || "[]").map(
                  (item: IExportDeclaration) => (
                    <UpdateExportDeclaration
                      exportDeclaration={{
                        export_declaration_id: item,
                        export_declaration_number: item,
                      }}
                    />
                  ),
                )}
            </Form.Item>
          </Form>

          <Table
            size="small"
            columns={columns}
            dataSource={dataHistory?.co_document_history}
            bordered
            loading={!dataHistory}
          />
        </div>
      </Modal>
    </>
  );
}
