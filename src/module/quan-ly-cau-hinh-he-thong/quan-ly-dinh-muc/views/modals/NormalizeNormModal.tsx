import { CloseCircleOutlined, SelectOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Modal,
  Row,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";

import { useMaterials } from "../../api/materials/getMaterials";
import { useNormalizeNorm } from "../../api/nomalizeNorm";
import { suggestName } from "../../config/suggestName";
import styles from "../../style.module.scss";
import { INorm } from "../../types";

interface material {
  material_code: string;
  material_id: string;
  material_name: string;
  import_declaration_id: string;
}

interface Props {
  material: any;
  norm_id: number;
}

export function NormalizeNormModal({ material, norm_id }: Props) {
  const { isOpen, close, open } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState("");
  const [form] = Form.useForm<INorm>();
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState<any[]>();

  const { data } = useMaterials({
    params: {
      material_code: material?.material_code,
    },
    config: {
      onSuccess: (data) => setDataSource(data),
    },
  });

  const normalizeNorm = useNormalizeNorm({
    config: {
      onSuccess: (data) => {
        notification.success({
          message: t("message.update_success"),
          description: data.message,
        });
        close();
        queryClient.invalidateQueries(["norm"]);
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  useEffect(() => {
    if (dataSource && !selectedItem && data) {
      // console.log(sortNamesBySimilarity(material?.material_name, data, "material_name"));
      const name =
        suggestName(
          material?.material_name,
          data.map((item) => item.material_name),
        ) || "";
      if (name) {
        const arr = JSON.parse(JSON.stringify(dataSource));
        const index = arr.findIndex((data: any) => data.material_name === name);
        setSelectedItem(dataSource[index].material_id);
        arr.splice(index, 1);
        setDataSource([dataSource[index], ...arr]);
      }
    }
  }, [dataSource, data]);

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  const handleOk = () => {
    normalizeNorm.mutate({
      norm_id,
      list_json_material_ids: [
        {
          old_material_id: material.material_id,
          new_material_id: selectedItem,
        },
      ],
    });
  };

  const columns: TableColumnsType<material> = [
    {
      title: "STT",
      width: "7%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => <Typography.Text>{++index}</Typography.Text>,
    },
    {
      title: "Tên NL, VT",
      dataIndex: "material_name",
    },
    {
      title: "Số TKN/VAT",
      dataIndex: "import_declaration_id",
      align: "center",
    },
    {
      title: "Chọn",
      width: "50px",
      align: "center",
      render: (_, record) => {
        return (
          <Checkbox
            checked={selectedItem === record?.material_id}
            onChange={() => setSelectedItem(record?.material_id)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Button type="text" onClick={handleOpen}>
        <SelectOutlined type="primary" style={{ color: "#1587F1" }} />
      </Button>

      <Modal
        open={isOpen}
        width={"50%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={false}
        maskClosable={false}
        destroyOnClose
        closable={false}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        className={styles.modal}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Chuẩn hóa định mức
          </Typography.Title>
          <Col className={styles.padding_none}>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <Row
          gutter={16}
          justify={"space-between"}
          style={{ margin: 0, padding: "0 16px 10px" }}
        >
          <Col span={3} className={styles.padding_none}>
            <Typography.Title level={5} className={styles.modal_header_title}>
              {material?.material_code}
            </Typography.Title>
          </Col>
          <Col span={21} className={styles.padding_none}>
            <Typography.Title level={5} className={styles.modal_header_title}>
              {material?.material_name}
            </Typography.Title>
          </Col>
        </Row>
        <Typography.Title style={{ fontSize: "14px", padding: "0 16px" }}>
          Danh sách NL, VT cùng mã
        </Typography.Title>
        <Table
          bordered
          style={{ padding: "0 16px 2px" }}
          size="small"
          columns={columns}
          dataSource={dataSource}
          rowKey={(record) => record?.material_name}
        />
      </Modal>
    </>
  );
}
