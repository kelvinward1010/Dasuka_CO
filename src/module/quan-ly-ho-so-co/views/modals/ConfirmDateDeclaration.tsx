import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Typography } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { handleSaveCoState } from "@/store/action/atom";

import styles from "../../style.module.scss";
import { sanPhamSelector, sanPhamState } from "../chi-tiet-ho-so-co/state/bigA";

interface Props {
  declaration_number?: string;
  indexMaterial: number;
  check_import_date: number | undefined;
}

export function ConfirmDateDeclaration({
  declaration_number,
  indexMaterial,
  check_import_date,
}: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const handleSave = useRecoilValue(handleSaveCoState);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { spIndex } = useRecoilValue(sanPhamSelector);
  const [needSave, setNeedSave] = useState<boolean>(false);

  const handleOpenModal = () => {
    open();
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    const newProducts = produce(sanPhams, (draft) => {
      draft?.[spIndex]?.nguyen_lieu?.[
        indexMaterial
      ]?.norm_vat_invoice_import_declaration?.forEach((item: any) => {
        if (item?.import_declaration_number === declaration_number)
          item.check_import_date = 1;
      });
    });

    setSanPhams(newProducts);
    setTimeout(() => {
      setNeedSave(true);
    }, 500);
    close();
  };

  useEffect(() => {
    if (needSave) {
      handleSave();
      setNeedSave(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSave]);

  return (
    <>
      {check_import_date === 0 && (
        <Typography.Link type="danger" onClick={handleOpenModal}>
          {declaration_number}
        </Typography.Link>
      )}
      <Modal
        centered
        open={isOpen}
        width={"35%"}
        okText={t("for_all.button_delete_ok")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_delete_no")}
        onOk={handleOk}
        onCancel={handleCancel}
        className={styles.modal + " modal-delete"}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Sử dụng tờ khai
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>

        <div
          style={{
            textAlign: "center",
            fontWeight: "700",
            margin: "2rem 5rem",
          }}
        >
          <Typography.Text
            // level={4}
            style={{ fontSize: "1.1rem" }}
          >
            {`Tờ khai nhập khẩu `}
            <Typography.Text type="danger" style={{ fontSize: "1.1rem" }}>
              {declaration_number}
            </Typography.Text>
            {" chưa đủ ngày (10 - 15 ngày)"}
          </Typography.Text>
          <br />
          <Typography.Text style={{ fontSize: "1.1rem" }}>
            Bạn có muốn sử dụng không?
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
}
