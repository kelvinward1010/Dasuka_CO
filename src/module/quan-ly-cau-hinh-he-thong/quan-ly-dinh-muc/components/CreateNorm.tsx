import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  notification,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useDropdownProduct } from "../../quan-ly-san-pham/api/getDropdownProduct";
import { RULES_NORM_CREATE, useCreateNorm } from "../api/createNorm";
import styles from "../style.module.scss";
import { INorm, INormDetail } from "../types";
import { ImportNormDetail, ImportNormDetailTable } from "./ImportNormDetail";

export function CreateNorm(): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);
  const [form] = Form.useForm<INorm>();
  const [normDetail, setNormDetail] = useState<INormDetail[]>([]);
  const { t } = useTranslation();

  const dropdownProduct = useDropdownProduct({
    config: {},
  });
  const createNorm = useCreateNorm({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["norms"]);
        close();
        form.resetFields();
        setNormDetail([]);
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    open();
    form.setFieldValue("customer_id", customer.value);
  };

  const handleCancel = () => {
    close();
    form.resetFields();
    createNorm.reset();
    setNormDetail([]);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      createNorm.mutate({
        ...values,
        created_by_user_id: userRecoil.user_id,
        list_json_norm_detail: normDetail,
      });
    });
  };

  return (
    <>
      <Button
        type="primary"
        className={`${styles.button} ${styles.button_create}`}
        onClick={handleOpen}
        disabled={customer.value === ""}
      >
        {t("for_all.button_create")}
      </Button>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"80%"}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("for_all.button_save")}
        okButtonProps={{
          disabled: normDetail.length === 0,
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        confirmLoading={createNorm.isLoading}
        maskClosable={false}
        destroyOnClose
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Thêm mới định mức
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical">
            <Form.Item name="customer_id" hidden></Form.Item>
            <Row gutter={32} justify="space-between" align="bottom">
              <Col span={12}>
                <Form.Item
                  name="product_id"
                  label="Chọn sản phẩm cần thêm định mức"
                  rules={RULES_NORM_CREATE.product_id}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder={"Sản phẩm"}
                    className={styles.select}
                    loading={dropdownProduct.isLoading}
                    options={dropdownProduct.data}
                  />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  label="Tên định mức"
                  name="norm_name"
                  rules={RULES_NORM_CREATE.norm_name}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Tên định mức" value="vvvvvvvvvvv" />
                </Form.Item>
              </Col>
              <Col className={styles.text_right}>
                <ImportNormDetail setNormDetail={setNormDetail} />
              </Col>
            </Row>
          </Form>
          <br />
          <div style={{ padding: 17.5, paddingTop: 0 }}>
            <Typography.Title level={5}>
              Danh sách nguyên liệu, vật tư
            </Typography.Title>
            <Col>
              <ImportNormDetailTable norm_id={0} normDetail={normDetail} />
            </Col>
          </div>
        </div>
      </Modal>
    </>
  );
}
