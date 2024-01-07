import { Col, Row, Table, TableColumnsType, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { getUserSelector } from "@/store/auth/state";

import { useUsers } from "../services/getUsers";
import { IListUser } from "../types/user";
import { AddRoleUserModal } from "./AddRoleUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { ResetPasswordUserModal } from "./ResetPasswordUserModal";
import { UserModal } from "./UserModal";

export default function ListUsersTable(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  // Set init params
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const searchContent = searchParams.get("searchContent") || "";
  const userRecoil = useRecoilValue(getUserSelector);

  const data = useUsers({
    params: {
      pageIndex: pageIndex,
      pageSize: pageSize,
      search_content: searchContent,
      user_id: userRecoil.user_id,
    },
  });

  const { t } = useTranslation();

  const columns: TableColumnsType<IListUser> = [
    {
      title: t("authorization.users.table.stt"),
      width: "5%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("authorization.users.table.user_name"),
      dataIndex: "user_name",
      width: "10%",
      key: "user_name",
      sorter: (a, b) => {
        const nameA = a.user_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.user_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.users.table.full_name"),
      dataIndex: "full_name",
      width: "20%",
      sorter: (a, b) => {
        const nameA = a.full_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b.full_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: t("authorization.users.table.description"),
      dataIndex: "description",
    },
    {
      title: t("authorization.users.table.roles"),
      dataIndex: "role_group",
    },
    {
      title: t("authorization.users.table.action"),
      dataIndex: "action",
      width: "10%",
      key: "action",
      render: (_, record) => {
        return (
          <Row justify={"space-evenly"}>
            <Col>
              <AddRoleUserModal id={record.user_id} />
            </Col>
            <Col>
              <UserModal isCreate={false} id={record.user_id} />
            </Col>
            <Col>
              <DeleteUserModal id={record.user_id} name={record.full_name} />
            </Col>
            <Col>
              <ResetPasswordUserModal
                full_name={record.full_name}
                user_id={record?.user_id}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      className={styles.table}
      bordered
      columns={columns}
      loading={data?.isLoading}
      dataSource={data?.data?.data}
      pagination={{
        total: data?.data?.totalItems,
        current: pageIndex,
        pageSize,
        onChange: (page, pageSize) => {
          searchParams.set("pageIndex", String(page));
          searchParams.set("pageSize", String(pageSize));
          setSearchParams(searchParams);
        },
      }}
      rowKey={(record) => record.user_id}
    />
  );
}
