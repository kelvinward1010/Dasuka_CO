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
import { OptionProps } from "antd/es/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { useRoles } from "@/module/authorization/modules/roles-management/services/roles/getRoles";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { RULES_EMPLOYEE_CREATE, useCreateQLND } from "../api/createQLND";
import {
  SELECT_DATA_CHI_NHANH,
  SELECT_DATA_CHUC_VU,
  SELECT_DATA_PHONG_BAN,
} from "../config/data";
import styles from "../style.module.scss";
import { FormatTableAdd } from "./FormatTableAdd";

export function CreateQLND(): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const [roleOptions, setRoleOptions] = useState<OptionProps[]>([]);
  const userRecoil = useRecoilValue(getUserSelector);
  const [roleId, setRoleId] = useState("employee");

  const createQLND = useCreateQLND({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["qlnds"]);
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

  useRoles({
    params: {
      user_id: userRecoil.user_id,
    },
    config: {
      onSuccess: (data) => {
        if (data.data) {
          setRoleOptions(
            data.data.map((role) => ({
              label: role.role_name,
              value: role.role_id,
              children: [],
            })),
          );
        }
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
      .then(({ employee_customer_for_detail, ...values }) => {
        const [first, ...middle] = values.fullname.split(" ");
        const last = middle.splice(middle.length - 1, 1)?.[0] || "";
        const dataPost = {
          ...values,
          list_json_employee_customer: employee_customer_for_detail?.map(
            (i: any) => ({
              ...i,
              employee_id: values?.employee_id,
            }),
          ),
          first_name: first,
          last_name: last,
          middle_name: middle.join(" "),
          role_id: roleId,
          created_by_user_id: userRecoil?.user_id || userRecoil?.user_name,
        };
        createQLND.mutate(dataPost);
      });
  };

  const handleChangePosition = (_: string | number, option: any) => {
    const role =
      roleOptions.find((opt) => opt.label === option.label) ||
      roleOptions.find((opt) => opt.label === "Nhân viên");
    setRoleId(role?.value);
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
        open={isOpen}
        style={{ top: 110 }}
        width={"60%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        className={styles.modal}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        confirmLoading={createQLND.isLoading}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_nguoi_dung.create_cpnt.title_main")}
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
                  label={t("quan_ly_nguoi_dung.create_cpnt.employee_id")}
                  name={"employee_id"}
                  rules={[...RULES_FORM.required, ...RULES_FORM.username]}
                >
                  <Input placeholder="Mã người dùng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={t("quan_ly_nguoi_dung.create_cpnt.email")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.email]}
                >
                  <Input type="email" placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="fullname"
                  label={t("quan_ly_nguoi_dung.create_cpnt.fullname")}
                  rules={RULES_EMPLOYEE_CREATE.fullname}
                >
                  <Input placeholder="Tên người dùng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone_number"
                  label={t("quan_ly_nguoi_dung.create_cpnt.phone_number")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.phone]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={t("quan_ly_nguoi_dung.create_cpnt.password")}
                  rules={RULES_EMPLOYEE_CREATE.password}
                  initialValue={"123456"}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position_id"
                  label={t("quan_ly_nguoi_dung.create_cpnt.position_name")}
                  rules={RULES_EMPLOYEE_CREATE?.position_id}
                >
                  <Select
                    options={SELECT_DATA_CHUC_VU}
                    onChange={handleChangePosition}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="department_id"
                  label={t("quan_ly_nguoi_dung.create_cpnt.department_name")}
                  rules={RULES_EMPLOYEE_CREATE.department_id}
                >
                  <Select options={SELECT_DATA_PHONG_BAN} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="branch_id"
                  label={t("quan_ly_nguoi_dung.create_cpnt.branch_name")}
                  rules={RULES_EMPLOYEE_CREATE.branch_id}
                >
                  <Select options={SELECT_DATA_CHI_NHANH} />
                </Form.Item>
              </Col>
            </Row>
            <FormatTableAdd form={form} />
          </Form>
        </div>
      </Modal>
    </>
  );
}
