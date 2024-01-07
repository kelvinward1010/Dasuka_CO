import { Col, Input, Row, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { AppFilter } from "@/components/AppFilter";
import { getTotalPageSelector } from "@/store/total/state";

import { CreateQLND } from "../components/CreateQLND";
import { ListQLND } from "../components/ListQLND";
import styles from "../style.module.scss";

export function QuanLyNguoiDungV2(): JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPage = useRecoilValue(getTotalPageSelector);

  const handleSearch = (value: string) => {
    searchParams.set("searchContent", value.trim());
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className="box-for-all">
        <AppFilter />
        <Row
          justify={"space-between"}
          className={styles.quan_ly_sp_head}
          gutter={16}
        >
          <Col span={16} className={styles.padding_none}>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {t("quan_ly_nguoi_dung.title_main")} (
              {totalPage.loading ? <Spin spinning></Spin> : totalPage.total}){" "}
            </Typography.Title>
          </Col>
          <div style={{ flex: "1 1 0" }}>
            <Col
              span={7}
              style={{ maxWidth: "400px", marginLeft: "auto" }}
              className={styles.padding_none}
            >
              <Input.Search
                placeholder="Mã người dùng, tên người dùng, số điện thoại..."
                onSearch={handleSearch}
                defaultValue={searchParams.get("searchContent") || undefined}
              />
            </Col>
          </div>
          <Col className={styles.padding_l_1}>
            <CreateQLND />
          </Col>
        </Row>

        <div className={"content-table"}>
          <ListQLND />
        </div>
      </div>
    </>
  );
}
