import { Col, Input, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import styles from "@/module/authorization/assets/styles/styles.module.scss";

import ListUsersTable from "../components/ListUsersTable";
import { UserModal } from "../components/UserModal";

export function ListUser(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  return (
    <div className="box-for-all">
      <div className={styles.head_qlsp}></div>
      <Row
        justify={"space-between"}
        className={styles.quan_ly_sp_head}
        gutter={16}
      >
        <Col span={16} className={styles.padding_none}>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {t("authorization.users.title")}
          </Typography.Title>
        </Col>

        <div style={{ flex: "1 1 0" }}>
          <Col
            span={7}
            style={{ maxWidth: "400px", marginLeft: "auto" }}
            className={styles.padding_none}
          >
            <Input.Search
              onSearch={handleSearch}
              placeholder={t("authorization.users.search_placeholder") || ""}
            />
          </Col>
        </div>
        <Col className={styles.padding_l_1}>
          <UserModal isCreate={true} />
        </Col>
      </Row>
      <div className={"content-table"}>
        <ListUsersTable />
      </div>
    </div>
  );
}
