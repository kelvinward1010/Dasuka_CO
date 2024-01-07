import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  notification,
} from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import {
  ImportNormDetail,
  ImportNormDetailTable,
} from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/components/ImportNormDetail";
import { sanPhamSelector } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { getUserSelector } from "@/store/auth/state";

import { RULES_NORM_CREATE, useCreateNorm } from "../../api/createNorm";
import { INorm, INormDetail } from "../../types";
import styles from "./ThemMoiDinhMucSp.module.scss";

interface Props {
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: ({
    norm_id,
    norm_name,
  }: {
    norm_id: number;
    norm_name: string;
  }) => void;
}

export function ThemMoiDinhMucSpModal({ setOpenDropdown, onSuccess }: Props) {
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const { isOpen, close, open } = useDisclosure();
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);
  const [form] = Form.useForm<INorm>();
  const [normDetail, setNormDetail] = useState<INormDetail[]>([]);
  const { t } = useTranslation();

  const createNorm = useCreateNorm({
    config: {
      onSuccess: (data, variables) => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["norm-dropdown"]);
        close();
        form.resetFields();
        setNormDetail([]);
        onSuccess({ ...data, ...variables });
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
    setOpenDropdown(false);
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
        product_id: sanPham.ma_hh,
        customer_id: customer.value,
        created_by_user_id: userRecoil.user_id,
        list_json_norm_detail: normDetail,
      });
    });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleOpen}
        disabled={customer.value === ""}
      >
        Thêm mới
      </Button>

      <Modal
        title="Thêm mới định mức"
        open={isOpen}
        width={"90%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createNorm.isLoading}
        maskClosable={false}
        destroyOnClose
        okButtonProps={{
          disabled: normDetail.length === 0,
        }}
        okText={"Lưu"}
      >
        <Form
          form={form}
          className={styles.form}
          layout="vertical"
          initialValues={{
            product_id: sanPham?.name_hh,
          }}
        >
          <Form.Item name="customer_id" hidden></Form.Item>
          <Row justify="space-between" align="top">
            <Col span={12}>
              <Form.Item
                name="product_id"
                label="Chọn sản phẩm cần thêm định mức"
                rules={RULES_NORM_CREATE.product_id}
              >
                <Input
                  placeholder={"Sản phẩm"}
                  className={styles.select}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label="Tên định mức"
                name="norm_name"
                rules={RULES_NORM_CREATE.norm_name}
              >
                <Input placeholder="Tên định mức" value="vvvvvvvvvvv" />
              </Form.Item>
            </Col>
            <Col span={3} className={styles.text_right}>
              <ImportNormDetail setNormDetail={setNormDetail} />
            </Col>
          </Row>
        </Form>
        <br />
        <Typography.Title level={5}>
          Danh sách nguyên liệu, vật tư
        </Typography.Title>
        <ImportNormDetailTable norm_id={0} normDetail={normDetail} />
      </Modal>
    </>
  );
}
