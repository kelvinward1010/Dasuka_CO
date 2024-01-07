import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  FormListFieldData,
  FormListOperation,
  Input,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { XoaIcon } from "@/assets/svg";

import { useDropdownQLKH } from "../../quan-ly-khach-hang/api/getDropdownQLKH";
import { ICustomerDropdown } from "../../quan-ly-khach-hang/types";
import { RULES_EMPLOYEE_CREATE } from "../api/createQLND";
import styles from "./FormatTableAdd.module.scss";

export function FormatTableAdd({ form }: { form?: any }): JSX.Element {
  const { t } = useTranslation();
  const [currentData, setCurrentData] = useState<ICustomerDropdown>();

  const customerOptions = useDropdownQLKH({
    config: {
      onSuccess: (data) => {
        const { employee_customer_for_detail } = form.getFieldsValue();
        if (employee_customer_for_detail) {
          const resultFind = _.differenceBy(
            data,
            employee_customer_for_detail?.map((item: any) => ({
              ...item,
              value: item.customer_id,
            })),
            "value",
          );
          setCurrentData(resultFind);
        } else setCurrentData(data);
      },
    },
  });

  const handleSelect = (value: string, index: number) => {
    const data = form.getFieldsValue();
    if (data?.employee_customer_for_detail) {
      const item = customerOptions?.data?.find((f) => f.value === value);
      data.employee_customer_for_detail[index] = {
        customer_id: item?.value,
        customer_name: item?.label,
        tax_code: item?.tax_code,
      };
      setCurrentData((prev) => {
        const index = prev?.findIndex((i) => i.value === item?.value);
        if (index && index > -1) prev?.splice(index, 1);

        return prev;
      });
      form.setFieldsValue(data);
    }
  };

  const columns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: t("quan_ly_nguoi_dung.format_table.customer_name"),
      width: "40%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "customer_name"]}
          rules={RULES_EMPLOYEE_CREATE.customer_name}
          style={{ marginBottom: 0 }}
        >
          {/* <Input /> */}
          <Select
            options={currentData}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            dropdownStyle={{
              maxHeight: 400,
            }}
            onSelect={(value) => handleSelect(value, name)}
            autoFocus
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_nguoi_dung.format_table.customer_id"),
      width: "30%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "customer_id"]}
          rules={RULES_EMPLOYEE_CREATE.customer_id}
          style={{ marginBottom: 0 }}
        >
          <Input disabled />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_nguoi_dung.format_table.tax_code"),
      width: "30%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          {...restField}
          name={[name, "tax_code"]}
          rules={RULES_EMPLOYEE_CREATE.tax_code}
          style={{ marginBottom: 0 }}
        >
          <Input disabled />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_nguoi_dung.format_table.action"),
      width: "5%",
      dataIndex: "name",
      align: "center",
      render: (name) => (
        <Button
          icon={<XoaIcon />}
          type="text"
          danger
          onClick={() => remove(name)}
        />
      ),
    },
  ];

  return (
    <>
      <Col span={24}>
        <Form.List name="employee_customer_for_detail">
          {(fields, { remove, add }) => (
            <Table
              size="small"
              columns={columns({ remove })}
              dataSource={fields}
              footer={() => {
                return (
                  <Row justify={"end"}>
                    <Col>
                      <PlusCircleOutlined
                        className={styles.icon_add}
                        onClick={() => add()}
                      />
                    </Col>
                  </Row>
                );
              }}
            />
          )}
        </Form.List>
      </Col>
    </>
  );
}
