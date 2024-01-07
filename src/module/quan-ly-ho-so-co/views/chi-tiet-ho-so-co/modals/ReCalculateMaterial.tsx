import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { recalculationCoDocument } from "@/module/quan-ly-ho-so-co-v2/api/recalculationCoDocument";

import { sanPhamState } from "../state/bigA";
import { mappingNVLFromMapped } from "../utils";
import styles from "./ChiTietBoTaiLieu.module.scss";

interface Props {
  id: string | undefined;
  handleSave: any;
  isLoadingSave: boolean;
  isSuccess: boolean;
  isDone?: boolean;
}

export function ReCalculateMaterial({
  id,
  handleSave,
  isLoadingSave,
  isSuccess,
  isDone = false,
}: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const setSanPham = useSetRecoilState(sanPhamState);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState<boolean>(false);

  const handleRefresh = () => async () => {
    setIsLoadingRefresh(true);
    const dataRefreshed = await recalculationCoDocument({ id: id || "" });
    if (dataRefreshed) {
      if (dataRefreshed?.message) {
        notification.info({
          message: dataRefreshed.message,
        });
        return;
      }

      const listProducts: any[] = dataRefreshed.co_document_detail?.sps || [];
      const newProducts = listProducts.map((product) => {
        if (product.dinh_muc_id) {
          const nguyen_lieu = product?.nguyen_lieu;
          product.nguyen_lieu = mappingNVLFromMapped(nguyen_lieu);

          // let countNoMapping = 0;
          // console.log(product.nguyen_lieu);
          // product.nguyen_lieu?.forEach((i: any) => {
          //   if (!i.norm_vat_invoice_import_declaration) countNoMapping++;
          // });
          // if (countNoMapping)
          //   notification.warning({
          //     message: `Có ${countNoMapping} nguyên phụ liệu đang không có trong tờ khai và hóa đơn VAT`,
          //   });
        }

        return product;
      });

      setSanPham(newProducts);
      open();
    }
    setIsLoadingRefresh(false);
  };

  const handleCancel = () => {
    close();
  };

  useEffect(() => {
    if (isSuccess) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <>
      <Button
        onClick={handleRefresh()}
        className={styles.button + " " + styles.button_cancel}
        style={{ width: "auto" }}
        loading={isLoadingRefresh}
        disabled={isDone}
      >
        {t("for_all.button_calculate")}
      </Button>
      <Modal
        centered
        open={isOpen}
        width={"50%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        onOk={() => handleSave()}
        onCancel={handleCancel}
        confirmLoading={isLoadingSave}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Tính toán lại
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>

        <div style={{ padding: "10px 17px", textAlign: "justify" }}>
          <Typography.Text
          // level={4}
          >
            Hệ thống đã tính toán lại số lượng còn để làm hồ sơ CO của mỗi sản
            phẩm và tính toán lại để lấy ra các nguyên vật liệu có trong tờ khai
            nhập hoặc trong hóa đơn VAT cho định mức chỉ định.
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
}
