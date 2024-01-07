import { CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { getUserSelector } from "@/store/auth/state";

import { useRoles } from "../services/roles/getRoles";
import { IRole } from "../types/role";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleModal } from "./RoleModal";

export function DetailRoleModal(): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // Set init params
  const pageIndex = Number(searchParams.get("index_role")) || 1;
  const pageSize = Number(searchParams.get("size_role")) || 10;
  const searchContent = searchParams.get("search_role") || "";
  const userRecoil = useRecoilValue(getUserSelector);

  // Get roles
  const data = useRoles({
    params: {
      pageIndex,
      pageSize,
      search_content: searchContent,
      user_id: userRecoil.user_id,
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleSearch = (value: string) => {
    searchParams.set("search_role", value.trim());
    searchParams.delete("index_role");
    searchParams.delete("size_role");
    setSearchParams(searchParams);
  };

  const columns: TableColumnsType<IRole> = [
    {
      title: t("authorization.roles.table.stt"),
      width: "7%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("authorization.roles.table.role_code"),
      dataIndex: "role_code",
      width: "18%",
      key: "role_code",
      sorter: (a, b) => {
        const nameA = a.role_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.role_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.role_name"),
      dataIndex: "role_name",
      width: "25%",
      sorter: (a, b) => {
        const nameA = a.role_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.role_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.description"),
      dataIndex: "description",
      sorter: (a, b) => {
        const nameA = a.description?.toUpperCase() || ""; // ignore upper and lowercase
        const nameB = b.description?.toUpperCase() || ""; // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.roles.table.action"),
      width: "10%",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Row justify={"space-evenly"}>
            <Col>
              <RoleModal isCreate={false} id={record.role_id} />
            </Col>
            <Col>
              <DeleteRoleModal id={record.role_id} name={record.role_name} />
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_detail_role")}>
        <Button
          size="small"
          type="default"
          onClick={handleOpen}
          style={{ width: 40 }}
        >
          <EyeOutlined style={{ color: "#1587F1" }} />
        </Button>
      </Tooltip>
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"60%"}
        maskClosable={false}
        destroyOnClose
        onCancel={handleCancel}
        // confirmLoading={createFee.isLoading}
        className={styles.modal}
        closable={false}
        footer={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("authorization.roles.title_role")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Row
            gutter={16}
            align={"middle"}
            className={styles.quan_ly_sp_head}
            style={{ padding: "0 15px", paddingBottom: 0 }}
          >
            <div style={{ flex: "1 1 0" }}>
              <Col
                span={7}
                style={{ maxWidth: "400px", marginLeft: "auto" }}
                className={styles.padding_none}
              >
                <Input.Search
                  onSearch={handleSearch}
                  placeholder={
                    t("authorization.roles.search_placeholder") || undefined
                  }
                />
              </Col>
            </div>
            <Col className={styles.padding_l_1}>
              <RoleModal isCreate={true} />
            </Col>
            <Col
              span={24}
              className={styles.padding_l_1}
              style={{ marginTop: 10 }}
            >
              <Table
                size="small"
                bordered
                columns={columns}
                loading={data?.isLoading}
                dataSource={data?.data?.data}
                pagination={{
                  total: data?.data?.totalItems,
                  current: pageIndex,
                  pageSize,
                  onChange: (page, pageSize) => {
                    searchParams.set("index_role", String(page));
                    searchParams.set("size_role", String(pageSize));
                    setSearchParams(searchParams);
                  },
                }}
                rowKey={(record) => record.role_id}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}
