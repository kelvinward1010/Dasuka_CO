import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Table, TableColumnsType, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { isDoneCoState } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { getChiTietHoSoCOUrl } from "@/urls";
import { decimalUSD, intlUSD } from "@/utils/intl";

import styles from "../../style.module.scss";
import { useQuantityDeclarations } from "../api/getQuantityDeclarations";
import {
  IImportDeclaration,
  IImportDeclarationDetail,
  IQuantityDeclaration,
} from "../types";

interface Props {
  importDeclaration: IImportDeclaration | undefined;
  importDeclarationDetail: IImportDeclarationDetail;
  sort_order?: number;
  value: number | string;
}

export function DetailQuantityModal({
  importDeclaration,
  importDeclarationDetail,
  sort_order,
  value,
}: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const isDone = useRecoilValue(isDoneCoState);

  const dataQuantity = useQuantityDeclarations({
    params: {
      import_declaration_id: importDeclaration?.import_declaration_id,
      sort_order,
    },
    enabled: isOpen && !!importDeclaration?.import_declaration_id,
  });

  const handleOpen = (e: any) => {
    e.preventDefault();
    open();
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>{value}</Typography.Link>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"90%"}
        onCancel={handleCancel}
        okText={""}
        cancelText={"Trở về"}
        onOk={handleCancel}
        className={styles.modal}
        okButtonProps={{
          disabled: isDone,
          hidden: true,
        }}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("import_declaration.detail.title_quantity")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body" style={{ minHeight: 350 }}>
          <ListQuantityTable
            dataQuantity={dataQuantity}
            importDeclarationDetail={importDeclarationDetail}
          />
        </div>
      </Modal>
    </>
  );
}

export function ListQuantityTable({
  dataQuantity,
  importDeclarationDetail,
}: {
  dataQuantity: any;
  importDeclarationDetail: IImportDeclarationDetail;
}) {
  const { t } = useTranslation();

  const columns: TableColumnsType<IQuantityDeclaration> = [
    {
      title: t("import_declaration.fields.serial"),
      width: 50,
      align: "center",
      render: (_, __, index) => <Typography.Text>{index + 1}</Typography.Text>,
    },
    {
      title: t("import_declaration.fields.hs_code"),
      width: 100,
      dataIndex: "hs_code",
      align: "center",
      render: () => (
        <Typography.Text>{importDeclarationDetail.hs_code}</Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.product_code"),
      width: 150,
      dataIndex: "product_code",
      render: () => (
        <Typography.Text>
          {importDeclarationDetail.material_code}
        </Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.product_name"),
      width: 300,
      dataIndex: "product_name",
      render: () => (
        <Typography.Paragraph
          ellipsis
          style={{ margin: 0 }}
          title={importDeclarationDetail.material_name}
        >
          {importDeclarationDetail.material_name}
        </Typography.Paragraph>
      ),
    },
    {
      title: t("import_declaration.fields.co_document"),
      width: 100,
      dataIndex: "co_document_id",
      sorter: (a, b) =>
        Number(a.co_document_id || 0) - Number(b.co_document_id || 0),
      align: "center",
      render: (value) => (
        <Typography.Link
          strong
          href={getChiTietHoSoCOUrl(value)}
          target="_blank"
        >
          {value}
        </Typography.Link>
      ),
    },
    {
      title: t("import_declaration.fields.norm_name"),
      width: 150,
      dataIndex: "norm_name",
      render: (value) => <Typography.Text>{value}</Typography.Text>,
    },
    {
      title: t("import_declaration.fields.serial"),
      width: 50,
      align: "center",
      sorter: (a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0),
      dataIndex: "sort_order",
    },
    {
      title: t("import_declaration.fields.quantity"),
      width: 100,
      align: "center",
      dataIndex: "quantity",
      render: (value) => (
        <Typography.Text>{intlUSD.format(value)}</Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.co_used"),
      width: 100,
      align: "center",
      dataIndex: "co_doned",
      sorter: (a, b) =>
        Number(a.status_id === 1 ? a.co_doned || 0 : 0) -
        Number(b.status_id === 1 ? b.co_doned || 0 : 0),
      render: (value, record) => (
        <Typography.Text type="success" strong>
          {record.status_id === 1 ? decimalUSD.format(value) : ""}
        </Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.co_using"),
      width: 100,
      align: "center",
      dataIndex: "co_doned",
      sorter: (a, b) =>
        Number(a.status_id === 4 ? a.co_doned || 0 : 0) -
        Number(b.status_id === 4 ? b.co_doned || 0 : 0),
      render: (value, record) => (
        <Typography.Text type="warning" strong>
          {record.status_id === 4 ? decimalUSD.format(value) : ""}
        </Typography.Text>
      ),
    },
    {
      title: t("import_declaration.fields.co_availability"),
      width: 100,
      align: "center",
      dataIndex: "availability",
      sorter: (a, b) =>
        Number(a.availability || 0) - Number(b.availability || 0),
      render: (value) => (
        <Typography.Text type="warning" strong>
          {decimalUSD.format(value)}
        </Typography.Text>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 10, padding: 15 }}>
      <Table
        size="small"
        scroll={{ y: 500 }}
        loading={dataQuantity.isLoading}
        dataSource={dataQuantity.data}
        columns={columns}
        bordered
        pagination={{
          size: "small",
          style: { margin: "10px 0" },
          total: dataQuantity.data?.length,
        }}
      />
    </div>
  );
}
