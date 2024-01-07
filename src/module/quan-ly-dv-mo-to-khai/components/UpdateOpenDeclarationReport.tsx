import { CloseCircleOutlined } from "@ant-design/icons";
import { nanoid } from "@ant-design/pro-components";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useDeclarationReport } from "../api/getDeclarationReport";
import { useUpdateOpenDeclarationReport } from "../api/updateOpenDeclarationReport";
import styles from "../style.module.scss";
import { OpenDeclarationReport } from "../types";
import { getArrayFees } from "../utils/array";
import { FormFee } from "./FormFee";

interface Props {
  declarationService: OpenDeclarationReport;
}

export function UpdateOpenDeclarationReport({
  declarationService,
}: Props): JSX.Element {
  const [checkedPerson, setCheckedPerson] = useState(false);
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const { data } = useDeclarationReport({
    id: declarationService.report_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const [valueCheckPerson, setValueCheckPerson] = useState("");

  useEffect(() => {
    setValueCheckPerson(data?.checker || "");
    if (data?.checker) setCheckedPerson(true);
  }, [data]);

  const updateOpenDeclarationReport = useUpdateOpenDeclarationReport({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["open-declaration-reports"]);
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
    form.setFieldsValue(declarationService);
    open();
  };

  const handleCancel = () => {
    close();
    setCheckedPerson(false);
  };

  const handleOk = () => {
    form.validateFields().then(({ fees, ...values }) => {
      if (fees)
        fees.forEach((f: any) => {
          if (!f.fee_id) f.fee_id = "PHI" + nanoid();
          if (!(f.fee_type === "CN")) f.fee_type = "PS";
          else f.fee_type = "CN";
        });
      updateOpenDeclarationReport.mutate({
        ...values,
        checker: checkedPerson ? values.checker : null,
        open_declaration_report_id: values.report_id,
        employee_id: checkedPerson ? valueCheckPerson : "",
        lu_user_id: userRecoil.user_id,
        fees: JSON.stringify(getArrayFees(data!.fees ?? [], fees ?? [])),
      });
    });
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>
        {declarationService.report_number}
      </Typography.Link>

      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"90%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateOpenDeclarationReport.isLoading}
        className={styles.modal}
        closable={false}
        okText={t("quan_ly_dv_mo_tk.detail.button_submit")}
        cancelText={t("quan_ly_dv_mo_tk.detail.button_cancel")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_dv_mo_tk.detail.title_main")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Spin spinning={updateOpenDeclarationReport.isLoading}>
            <Form layout="vertical" form={form}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.date_of_declaration")}
                    name="date_of_declaration"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.report_id")}
                    name="report_id"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.bill_number")}
                    name="bill_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.invoice_number")}
                    name="invoice_number"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.cd_type")}
                    name="cd_type"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={t("quan_ly_dv_mo_tk.detail.gw")} name="gw">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={t("quan_ly_dv_mo_tk.detail.pk")} name="pk">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.branch")}
                    name="branch"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.customs_stream")}
                    name="customs_stream"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.shipping_terms")}
                    name="shipping_terms"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.import_export")}
                    name="import_export"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.transportation_mode")}
                    name="transportation_mode"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.truck_type")}
                    name="truck_type"
                  >
                    <Input
                      placeholder={
                        t("quan_ly_dv_mo_tk.detail.truck_type") || ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.import_truck_number")}
                    name="import_truck_number"
                  >
                    <Input
                      placeholder={
                        t("quan_ly_dv_mo_tk.detail.import_truck_number") || ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.plant_number")}
                    name="plant_number"
                  >
                    <Input
                      placeholder={
                        t("quan_ly_dv_mo_tk.detail.plant_number") || ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.dsk_person")}
                    name="dsk_person"
                  >
                    <Input
                      placeholder={
                        t("quan_ly_dv_mo_tk.detail.dsk_person") || ""
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.employee_id")}
                    name="checker"
                  >
                    <Input
                      type="text"
                      disabled={!checkedPerson}
                      prefix={
                        <Checkbox
                          checked={checkedPerson}
                          onChange={(e) => setCheckedPerson(e.target.checked)}
                        ></Checkbox>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col style={{ width: "50%" }}>
                  <Form.Item
                    label={t("quan_ly_dv_mo_tk.detail.note")}
                    name="note"
                  >
                    <Input
                      placeholder={t("quan_ly_dv_mo_tk.detail.note") || ""}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <FormFee form={form} />
            </Form>
          </Spin>
        </div>
      </Modal>
    </>
  );
}
