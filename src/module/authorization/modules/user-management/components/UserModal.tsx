import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import styles from "@/module/authorization/assets/styles/styles.module.scss";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useCreateUser } from "../services/createUser";
import { useUser } from "../services/getUser";
import { useUpdateUser } from "../services/updateUser";
import { IUserDAO } from "../types/user";

interface Props {
  isCreate: boolean;
  id?: string;
}

export function UserModal({ isCreate, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const [dateOfBirth, setDateOfBirth] = useState<dayjs.Dayjs | null>();

  useUser({
    id: id!,
    config: {
      enabled: !isCreate && isOpen && !!id,
      onSuccess: (data) => {
        form.setFieldsValue(data);
        setDateOfBirth(dayjs(data.date_of_birth || new Date()));
        // form.setFieldValue("date_of_birth", moment(data.date_of_birth || ""));
      },
    },
  });

  const createUser = useCreateUser({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["users"]);
        close();
        form.resetFields();
      },
    },
  });

  const updateUser = useUpdateUser({
    config: {
      onSuccess: (data) => {
        notification.success({
          message: data.message,
        });
        queryClient.invalidateQueries(["users"]);
        close();
        form.resetFields();
      },
    },
  });

  const handleOpen = () => {
    form.resetFields();
    open();
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const [first, ...middle] = values.full_name.split(" ");
        const last = middle.splice(middle.length - 1, 1)?.[0] || "";
        const dataPost: IUserDAO = {
          ...values,
          first_name: first,
          last_name: last,
          middle_name: middle.join(" "),
          date_of_birth: dayjs(dateOfBirth).format("YYYY-MM-DD"),
          created_by_user_id: userRecoil.user_id || userRecoil.user_name,
          lu_user_id: userRecoil.user_id || userRecoil.user_name,
          user_id: id || "",
        };
        if (isCreate) {
          await createUser.mutate(dataPost);
        } else {
          await updateUser.mutate(dataPost);
        }
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  return (
    <>
      {isCreate ? (
        <Button
          type="primary"
          className={`${styles.button} ${styles.button_create}`}
          onClick={handleOpen}
        >
          {t("for_all.button_create")}
        </Button>
      ) : (
        <Tooltip title={t("authorization.tooltip.btn_update")}>
          <Button type="default" size="small" onClick={handleOpen}>
            <EditOutlined
              style={{
                color: "#faad14",
                cursor: "pointer",
              }}
            />
          </Button>
        </Tooltip>
      )}

      <RenderUserModal
        isOpen={isOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isCreate={isCreate}
        t={t}
        form={form}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
      />
    </>
  );
}

export function RenderUserModal({
  isOpen,
  handleOk,
  handleCancel,
  isCreate,
  t,
  form,
  dateOfBirth,
  setDateOfBirth,
}: any) {
  return (
    <Modal
      style={{ top: 110 }}
      open={isOpen}
      width={"40%"}
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
      className={styles.modal}
      closable={false}
    >
      <Row
        gutter={16}
        justify={"space-between"}
        className={styles.modal_header}
      >
        <Typography.Title level={4} className={styles.modal_header_title}>
          {isCreate
            ? t("authorization.users.modal.title_create")
            : t("authorization.users.modal.title_update")}
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
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name={"user_name"}
                label={t("authorization.users.table.user_name")}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  disabled={!isCreate}
                  placeholder={t("authorization.users.table.user_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"full_name"}
                label={t("authorization.users.table.full_name")}
                rules={[...RULES_FORM.required]}
              >
                <Input
                  placeholder={t("authorization.users.table.full_name") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("authorization.users.table.date_of_birth")}
                rules={[...RULES_FORM.required]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                  onChange={(date: dayjs.Dayjs | null) =>
                    date && setDateOfBirth(date)
                  }
                  value={dateOfBirth}
                  format={"DD-MM-YYYY"}
                  // name="date_of_birth"
                  placeholder={
                    t("authorization.users.table.date_of_birth") || ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"gender"}
                label={t("authorization.users.table.gender")}
                rules={[...RULES_FORM.required]}
                initialValue={0}
              >
                <Select
                  options={[
                    {
                      label: "Nam",
                      value: 1,
                    },
                    {
                      label: "Nữ",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"email"}
                label={t("authorization.users.table.email")}
                rules={[...RULES_FORM.required, ...RULES_FORM.email]}
              >
                <Input
                  type="email"
                  required
                  placeholder={t("authorization.users.table.email") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"phone_number"}
                label={t("authorization.users.table.phone")}
                rules={[...RULES_FORM.phone]}
              >
                <Input
                  required
                  placeholder={t("authorization.users.table.phone") || ""}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"description"}
                label={t("authorization.users.table.description")}
              >
                <Input.TextArea
                  placeholder={t("authorization.users.table.description") || ""}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}
