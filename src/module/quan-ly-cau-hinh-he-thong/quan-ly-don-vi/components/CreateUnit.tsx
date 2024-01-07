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
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useCreateUnit } from "../api/createUnit";
import { typeUnits } from "../config/data";
import styles from "../style.module.scss";

export function CreateUnit(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const createUnit = useCreateUnit({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["fees"]);
        close();
        form.resetFields();
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
  };

  const handleCancel = () => {
    close();
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ ...values }) => {
        createUnit.mutate({
          ...values,
          created_by_user_id: userRecoil.user_id,
        });
        close();
      })
      .catch(() => {
        notification.warning({
          message: t("Bạn cần điền đầy đủ thông tin!"),
        });
      });
  };

  return (
    <>
      <Button
        type="primary"
        className={`${styles.button} ${styles.button_create}`}
        onClick={handleOpen}
      >
        {t("for_all.button_create")}
      </Button>
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"55%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        onOk={handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={handleCancel}
        confirmLoading={createUnit.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("manage_unit.create.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical" name="form_in_modal">
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label={t("manage_unit.table.unit_id")}
                  name="unit_id"
                  rules={[...RULES_FORM.required]}
                >
                  <Input
                    type="text"
                    placeholder={t("manage_unit.table.unit_id") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("manage_unit.table.unit_name")}
                  name="unit_name"
                  rules={[...RULES_FORM.required]}
                >
                  <Input
                    type="text"
                    placeholder={t("manage_unit.table.unit_name") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t("manage_unit.table.note")} name="note">
                  <Input
                    type="text"
                    placeholder={t("manage_unit.table.note") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("manage_unit.table.type")}
                  name="type"
                  rules={[...RULES_FORM.required]}
                >
                  <Select
                    placeholder="Chọn một trong các loại đơn vị"
                    dropdownStyle={{ maxHeight: 400 }}
                    showSearch
                    filterOption={(input, option) => {
                      return (option?.value + "" ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    options={typeUnits}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
}
