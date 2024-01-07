import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { getUserSelector } from "@/store/auth/state";

import { useRoles } from "../../roles-management/services/roles/getRoles";
import { filterNot } from "../../roles-management/utils/array";
import { useAddRoleUser } from "../services/addRoleUser";
import { useRoleByUser } from "../services/getRoleByUser";

interface Props {
  id: string;
}

export function AddRoleUserModal({ id }: Props) {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const userRecoil = useRecoilValue(getUserSelector);

  const role = useRoles({
    params: {
      pageIndex,
      pageSize,
      user_id: userRecoil.user_id,
    },
    config: {
      enabled: isOpen,
    },
  });

  useRoleByUser({
    id: id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        if (data && data?.length)
          setSelectedRowKeys(data?.map((i: any) => i.role_id));
      },
    },
  });

  const addRole = useAddRoleUser({
    config: {
      onSuccess: (data) => {
        notification.success({
          message: data.message || t("message.create_success"),
        });
        close();
        setSelectedRowKeys([]);
        queryClient.invalidateQueries(["users"]);
      },
    },
  });

  const handleOk = async () => {
    const dataPost = {
      user_role_list: [
        ...(selectedRowKeys?.map((i: any) => ({
          user_role_id: "",
          role_id: i,
          user_id: id,
          active_flag: 1,
        })) || []),
        ...filterNot(role.data?.data, selectedRowKeys, "role_id").map((i) => ({
          user_role_id: "",
          role_id: i.role_id,
          user_id: id,
          active_flag: 0,
        })),
      ],
      created_by_user_id: id,
    };
    addRole.mutate(dataPost);
  };

  const handleCancel = () => {
    close();
  };

  const handleOpen = () => {
    open();
  };

  const columns: TableColumnsType<any> = [
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
      title: t("authorization.users.modal.role_code"),
      dataIndex: "role_code",
      width: "20%",
      key: "role_code",
      sorter: (a, b) => {
        const nameA = a?.role_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.role_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.users.modal.role_name"),
      dataIndex: "role_name",
      width: "20%",
      key: "role_name",
      sorter: (a, b) => {
        const nameA = a?.role_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.role_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.users.modal.description"),
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => {
        const nameA = a?.description?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.description?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    columnWidth: "50px",
  };

  return (
    <>
      <Tooltip title={t("authorization.tooltip.btn_add_role")}>
        <Button type="default" size="small" onClick={handleOpen}>
          <PlusCircleOutlined
            style={{
              color: "#52c41a",
              cursor: "pointer",
            }}
          />
        </Button>
      </Tooltip>
      <Modal
        style={{ top: 110 }}
        confirmLoading={addRole.isLoading}
        width={"60vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
            {t("authorization.users.modal.title_add_role")}
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
            <Row
              gutter={16}
              align={"middle"}
              className={styles.quan_ly_sp_head}
              style={{ padding: "0 15px", paddingBottom: 0 }}
            >
              <Col span={24} className={styles.padding_l_1}>
                <Table
                  bordered
                  size="small"
                  rowSelection={rowSelection}
                  columns={columns}
                  loading={role?.isLoading}
                  dataSource={role?.data?.data?.map((role) => ({
                    ...role,
                    key: role.role_code,
                  }))}
                  pagination={{
                    total: role?.data?.totalItems,
                    current: pageIndex,
                    pageSize,
                    onChange: (page, pageSize) => {
                      setPageIndex(page);
                      setPageSize(pageSize);
                    },
                  }}
                  rowKey={(record) => record.key}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </>
  );
}
