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
import { OptionProps } from "antd/es/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { useRoles } from "@/module/authorization/modules/roles-management/services/roles/getRoles";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUpdatedArray } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/utils/array";
import { getUserSelector } from "@/store/auth/state";

import { RULES_EMPLOYEE_CREATE } from "../api/createQLND";
import { useQLND } from "../api/getQlND";
import { useUpdateQLND } from "../api/updateQLND";
import {
  SELECT_DATA_CHI_NHANH,
  SELECT_DATA_CHUC_VU,
  SELECT_DATA_PHONG_BAN,
} from "../config/data";
import styles from "../style.module.scss";
import { IEmployee } from "../types";
import { FormatTableAdd } from "./FormatTableAdd";

interface UpdateQLNDProps {
  employee: IEmployee;
}

export function UpdateQLND({ employee }: UpdateQLNDProps): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const [roleOptions, setRoleOptions] = useState<OptionProps[]>([]);
  const userRecoil = useRecoilValue(getUserSelector);
  const [roleId, setRoleId] = useState("");
  const { t } = useTranslation();

  const { data } = useQLND({
    id: employee.employee_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
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

  const updateQLND = useUpdateQLND({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries("qlnds");
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

  const handleOpen = () => {
    form.setFieldsValue({
      ...employee,
    });
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
          list_json_employee_customer: getUpdatedArray(
            data!.employee_customer_for_detail,
            employee_customer_for_detail,
            "customer_id",
          )?.map((i: any) => ({
            ...i,
            employee_id: values?.employee_id,
          })),
          first_name: first,
          last_name: last,
          middle_name: middle.join(" "),
          role_id: roleId || values?.role_id,
          lu_user_id: userRecoil?.user_id || userRecoil?.user_name,
        };
        updateQLND.mutate(dataPost);
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
      <Typography.Link onClick={handleOpen}>
        {employee?.employee_id}
      </Typography.Link>
      <Modal
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
        closable={false}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        confirmLoading={updateQLND.isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_nguoi_dung.detail_cpnt.title_main")}
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
                  label={t("quan_ly_nguoi_dung.detail_cpnt.employee_id")}
                  name={"employee_id"}
                >
                  <Input placeholder="Mã người dùng" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={t("quan_ly_nguoi_dung.detail_cpnt.email")}
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
                  label={t("quan_ly_nguoi_dung.detail_cpnt.fullname")}
                  rules={RULES_EMPLOYEE_CREATE.fullname}
                >
                  <Input placeholder="Tên người dùng" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone_number"
                  label={t("quan_ly_nguoi_dung.detail_cpnt.phone_number")}
                  rules={[...RULES_FORM.required, ...RULES_FORM.phone]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Form.Item name="role_id" hidden></Form.Item>
            </Row>
            <Row gutter={32}>
              {/* <Form.Item name="password" hidden></Form.Item> */}
              <Col span={12}>
                <Form.Item
                  name="position_id"
                  label={t("quan_ly_nguoi_dung.detail_cpnt.position_name")}
                  rules={RULES_EMPLOYEE_CREATE?.position_name}
                >
                  <Select
                    options={SELECT_DATA_CHUC_VU}
                    onChange={handleChangePosition}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="department_id"
                  label={t("quan_ly_nguoi_dung.detail_cpnt.department_name")}
                  rules={RULES_EMPLOYEE_CREATE.department_id}
                >
                  <Select options={SELECT_DATA_PHONG_BAN} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="branch_id"
                  label={t("quan_ly_nguoi_dung.detail_cpnt.branch_name")}
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
