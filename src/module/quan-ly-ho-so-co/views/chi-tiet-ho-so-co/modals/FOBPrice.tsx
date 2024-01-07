import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  notification,
} from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { tagRender } from "@/constant/antd";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { calculateHouseBill } from "@/module/quan-ly-ho-so-co/api/house-bill/calculateHouseBill";
import {
  RULES_HOUSE_BILL_CREATE,
  useCreateHouseBill,
} from "@/module/quan-ly-ho-so-co/api/house-bill/createHouseBill";
import { useHouseBill } from "@/module/quan-ly-ho-so-co/api/house-bill/getHouseBill";
import { IFormCreateHouseBill } from "@/module/quan-ly-ho-so-co/types";
import { useDropdownExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/api/getDropdownExportDeclaration";
import { DataUserState } from "@/store/auth/atom";
import { chooseFOBState } from "@/store/choose/atom";
import { DataSelectedState } from "@/store/datanvl/atom";
import { formatNumber } from "@/utils/format";

import styles from "./FOBPrice.module.scss";

export function FOBPrice({ isCreate = false, isDone = false }): JSX.Element {
  const { id } = useParams();
  const customer = useRecoilValue(customerState);
  const [form] = Form.useForm<IFormCreateHouseBill>();
  const { close, open, isOpen } = useDisclosure();
  const { t } = useTranslation();
  const selectTKX = useRecoilValue(DataSelectedState);
  const userRecoil = useRecoilValue(DataUserState);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [isDeselected, setIsDeselected] = useState<boolean>(false);
  const setChooseFOB = useSetRecoilState(chooseFOBState);

  const { data: exportDeclaration } = useDropdownExportDeclaration({
    customerId: customer.value,
    isCO: false,
    config: {
      enabled: !!customer.value,
    },
  });

  const FOB = useHouseBill({
    params: {
      list_json_export_declaration_number: selectTKX?.map((tkx) => ({
        export_declaration_id: tkx,
      })),
      isOpen,
      user_id: userRecoil.user_id,
    },
    config: {
      enabled: !!id && selectTKX && selectTKX?.length > 0 && !!form,
      onSuccess: (data) => {
        setIsDeselected(false);
        if (data?.message) {
          setChooseFOB("");
          if (isOpen)
            notification.info({
              message: data.message,
            });
        }
        if (data?.export_declarations) {
          setChooseFOB(data);
          form.setFieldValue(
            "list_json_export_declaration_ids",
            _.uniq([
              ...data.export_declarations.map(
                (tkx: any) => tkx.export_declaration_id,
              ),
              ...selectTKX,
            ]),
          );
          form.setFieldsValue(data);
        } else {
          setChooseFOB("");
          form.setFieldValue("list_json_export_declaration_ids", selectTKX);
        }
      },
      onError: () => {},
    },
  });

  useEffect(() => {
    if (exportDeclaration && selectTKX) {
      if (exportDeclaration) {
        (FOB?.data?.export_declarations || selectTKX)?.forEach(
          (select: any) => {
            const item = exportDeclaration.find(
              (exportD) =>
                (select.export_declaration_id || select) === exportD.value,
            );
            if (item && item.shipping_terms === "FOB") {
              setEnabled(false);
            } else setEnabled(true);
          },
        );
      }
    }
  }, [exportDeclaration, selectTKX, FOB.data]);

  const handleSelect = (value: string[], option: any) => {
    if (value?.[0] && !isDeselected) {
      const diff = _.uniqBy(option, "shipping_terms");
      if (diff.length === 1) {
        form.setFieldValue("list_json_export_declaration_ids", value);
        value?.forEach((select: any) => {
          const item = exportDeclaration?.find(
            (exportD: any) => select === exportD.value,
          );
          if (item && item.shipping_terms === "FOB") {
            setEnabled(false);
            return;
          } else setEnabled(true);
        });
      } else {
        form.setFieldValue(
          "list_json_export_declaration_ids",
          _.dropRight(value),
        );
        notification.warning({
          message: "Không thể chọn tờ khai khác điều kiện vận chuyển.",
        });
      }
    }
  };

  const {
    mutate: createFOB,
    reset,
    isLoading,
  } = useCreateHouseBill({
    config: {
      onSuccess: (data) => {
        if (data.status === 1) {
          notification.success({
            message: t("message.update_success"),
          });
          close();
          form.resetFields();
          queryClient.invalidateQueries(["export-declaration"]);

          calculateHouseBill({ id: id! }).then(() =>
            queryClient.invalidateQueries(["co-documents"]),
          );
        } else {
          notification.error({
            message: t("message.update_failure"),
            // description: data.message,
          });
        }
      },
      onError: () => {},
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
    form.resetFields();
    setEnabled(true);
    reset();
  };

  const handleOK = () => {
    form.validateFields().then((values) => {
      createFOB({
        ...values,
        list_json_export_declaration_ids:
          values.list_json_export_declaration_ids.map((i) => ({
            export_declaration_id: i,
          })),
        house_bill_id: FOB?.data ? FOB?.data.house_bill_id : null,
        created_by_user_id: userRecoil.user_id,
        co_document_id: Number(id),
      });
    });
  };

  return (
    <>
      <Button
        className={
          styles["button-success"] +
          " button " +
          `${isCreate ? "button_disabled" : "button_update"} `
        }
        onClick={handleOpen}
        disabled={isCreate}
      >
        Cập nhật giá FOB
      </Button>
      <Modal
        open={isOpen}
        maskClosable
        closable={false}
        bodyStyle={{ padding: "0px !important" }}
        className={styles.modal}
        okText={"Lưu"}
        width={700}
        onOk={handleOK}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !enabled || isDone,
        }}
        confirmLoading={isLoading}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Cập nhật giá FOB
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Mã lô hàng (House Bill)"
                name="house_bill_number"
                // rules={RULES_HOUSE_BILL_CREATE.house_bill_number}
              >
                <Input disabled={!enabled || isDone} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Chi phí vận chuyển (USD)"
                name="transportation_expense"
                rules={RULES_HOUSE_BILL_CREATE.transportation_expense}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  disabled={!enabled || isDone}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Chi phí bảo hiểm (USD)"
                name="insurance_expense"
                rules={RULES_HOUSE_BILL_CREATE.insurance_expense}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={formatNumber}
                  disabled={!enabled || isDone}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label="Tờ khai xuất khẩu"
                name="list_json_export_declaration_ids"
                rules={RULES_HOUSE_BILL_CREATE.list_json_export_declaration_ids}
              >
                <Select
                  disabled={isDone}
                  mode="multiple"
                  onChange={handleSelect}
                  onSelect={() => setIsDeselected(false)}
                  onDeselect={() => setIsDeselected(true)}
                  tagRender={(props) => tagRender(props)}
                  options={exportDeclaration?.map((option) => ({
                    ...option,
                    label: `${option.label} (${option.shipping_terms})`,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Cách tính trị giá FOB"
                name="house_bill_type"
                rules={[...RULES_FORM.required]}
                initialValue={1}
              >
                <Select
                  disabled={isDone}
                  options={[
                    {
                      label: "Trị giá",
                      value: 1,
                    },
                    {
                      label: "Số lượng",
                      value: 2,
                    },
                  ]}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
