import { Button, Col, Input, Row, Tree, Typography } from "antd";
import { DirectoryTreeProps } from "antd/es/tree";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";

import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { useFunctions } from "@/module/authorization/services/functions/getFunctions";
import { functionState } from "@/module/authorization/store/atom";
import { getUserSelector } from "@/store/auth/state";

import { CreateFunctionModal } from "./CreateFunctionModal";
import { DeleteFunctionModal } from "./DeleteFunctionModal";
import { UpdateFunctionModal } from "./UpdateFunctionModal";

export default function FunctionTable(): JSX.Element {
  const setFunction = useSetRecoilState(functionState);
  const [contentSearch, setContentSearch] = useState("");
  const userRecoil = useRecoilValue(getUserSelector);

  const { data } = useFunctions({
    params: {
      search_content: contentSearch,
      user_id: userRecoil.user_id,
    },
  });

  useEffect(() => setFunction(""), [setFunction]);

  const { t } = useTranslation();

  const onSelect: DirectoryTreeProps["onSelect"] = (keys) => {
    setFunction(keys[0].toString());
  };

  const handleSearch = (value: string) => {
    setContentSearch(value);
  };

  return (
    <>
      <Row
        className={styles.quan_ly_sp_head}
        style={{ padding: 0, paddingBottom: 12 }}
        justify={"space-between"}
      >
        <Col span={24}>
          <Input.Search
            onSearch={handleSearch}
            placeholder={t("authorization.functions.search_placeholder") || ""}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 12 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {t("authorization.functions.title_function")}
          </Typography.Title>
        </Col>
        <Col span={12} style={{ paddingTop: 12 }}>
          <Button.Group style={{ width: "100%", justifyContent: "flex-end" }}>
            <CreateFunctionModal />
            <UpdateFunctionModal />
            <DeleteFunctionModal />
          </Button.Group>
        </Col>
      </Row>
      <Tree.DirectoryTree
        className={styles.tree}
        height={450}
        onSelect={onSelect}
        treeData={data?.data}
      />
    </>
  );
}
