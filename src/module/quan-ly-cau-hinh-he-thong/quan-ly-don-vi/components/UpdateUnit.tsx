import { CloseCircleOutlined } from "@ant-design/icons";
import {
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

import { useUpdateUnit } from "../api/updateUnit";
import { typeUnits } from "../config/data";
import styles from "../style.module.scss";
import { Unit } from "../types";

// const { Text } = Typography;
interface Props {
  unit: Unit;
}

export default function UpdateUnitModal({ unit }: Props) {
  const [form] = Form.useForm();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const updateFee = useUpdateUnit({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["units"]);
        close();
        form.resetFields();
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpenModal = () => {
    form.setFieldsValue(unit);
    open();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        updateFee.mutate({
          ...values,
          lu_user_id: userRecoil.user_id,
        });
        close();
      })
      .catch(() => {
        notification.warning({
          message: t("Bạn cần điền đầy đủ thông tin!"),
        });
      });
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <Typography.Link
        style={{ width: "100%", display: "block" }}
        className={styles.link}
        onClick={handleOpenModal}
      >
        {unit.unit_id}
      </Typography.Link>
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
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        confirmLoading={updateFee.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("manage_unit.detail.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
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
                    disabled
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
