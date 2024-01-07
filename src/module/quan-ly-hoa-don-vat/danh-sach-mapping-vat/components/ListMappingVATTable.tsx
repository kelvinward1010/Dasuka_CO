import { PlusCircleOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  FormListOperation,
  Input,
  Row,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { XoaIcon } from "@/assets/svg";

import { dropdownMaterials } from "../../danh-sach-hoa-don-vat/views/tables/fakedata";
import styles from "../style.module.scss";

const dataFake = {
  list: [
    {
      material_code_customer: "NL99",
      material_name_customer: "kh",
      hs_code: "03223",
    },
  ],
};

export function ListMappingVATTable(): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(dataFake);
  }, [form]);

  const handleSelectMaterial = (
    _: string,
    option: { label: string; value: string; id: string },
    index: number,
  ) => {
    const data = { ...dataFake };
    const material = dropdownMaterials.find((item) => item.id === option.id);
    if (material) {
      data.list[index].material_code_customer = material.id;
      data.list[index].material_name_customer = material.material_name;
      data.list[index].hs_code = material.hs_code;
      form.setFieldsValue(data);
    }
  };

  const columns = ({
    remove,
  }: Pick<FormListOperation, "remove">): TableColumnsType<any> => [
    {
      title: t("quan_ly_vat.map.stt"),
      dataIndex: "stt",
      width: "3%",
      align: "center",
      render: (_, __, index) => <Typography.Text>{++index}</Typography.Text>,
    },
    {
      title: t("quan_ly_vat.map.mst_customer"),
      dataIndex: "mst_customer",
      width: "10%",
      align: "center",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "mst_customer"]}
        >
          <Input placeholder={t("quan_ly_vat.map.mst_customer") || ""} />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.mst_seller"),
      dataIndex: "mst_seller",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "mst_seller"]}
        >
          <Input placeholder={t("quan_ly_vat.map.mst_seller") || ""} />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.hs_code"),
      dataIndex: "hs_code",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "hs_code"]}
        >
          <Input placeholder={t("quan_ly_vat.map.hs_code") || ""} />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.material_code_seller"),
      dataIndex: "material_code_seller",
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_code_seller"]}
        >
          <Input
            placeholder={t("quan_ly_vat.map.material_code_seller") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.material_name_seller"),
      dataIndex: "material_name_seller",
      width: "15%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_name_seller"]}
        >
          <Input
            placeholder={t("quan_ly_vat.map.material_name_seller") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.material_code_customer"),
      dataIndex: "material_code_customer",
      align: "left",
      width: "8%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_code_customer"]}
        >
          <AutoComplete
            showSearch
            showArrow
            dropdownStyle={{ maxHeight: 400 }}
            onSelect={(value, option) =>
              handleSelectMaterial(value, option, name)
            }
            placeholder={t("quan_ly_vat.map.material_code_customer") || ""}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={dropdownMaterials}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_vat.map.material_name_customer"),
      dataIndex: "material_name_customer",
      width: "15%",
      align: "left",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "material_name_customer"]}
        >
          <AutoComplete
            showArrow
            onClick={(e: any) => e.target?.select?.()}
            onSelect={(value, option) =>
              handleSelectMaterial(value, option, name)
            }
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400 }}
            options={dropdownMaterials.map((i) => ({
              ...i,
              label: i.material_name,
              value: i.material_name,
            }))}
            placeholder={t("quan_ly_vat.map.material_name_customer") || ""}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Action",
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
      <Form form={form}>
        <Form.List name={"list"}>
          {(fields, { add, remove }) => (
            <Table
              size="small"
              bordered
              columns={columns({ remove })}
              dataSource={fields}
              footer={() => {
                return (
                  <Row justify={"end"}>
                    <Col>
                      <PlusCircleOutlined
                        style={{ fontSize: "20px", color: "#008816" }}
                        onClick={() => add()}
                      />
                    </Col>
                  </Row>
                );
              }}
              rowKey={(key) => key.name}
            />
          )}
        </Form.List>
      </Form>
    </>
  );
}
