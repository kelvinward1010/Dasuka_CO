import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  FormListFieldData,
  FormListOperation,
  Input,
  InputNumber,
  Row,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import produce from "immer";
import { FocusEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { formatNumber, formatOnlyNumber } from "@/utils/format";

import { sanPhamSelector, sanPhamState } from "../state/bigA";

export default function FeeTableCO(): JSX.Element {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { sanPham, spIndex } = useRecoilValue(sanPhamSelector);

  useEffect(() => {
    if (sanPham) {
      form.setFieldsValue(sanPham);
    }
  }, []);

  const handleChangeInput = (
    e: FocusEvent<HTMLInputElement, Element>,
    key: string,
    index: number,
  ) => {
    const newProducts = produce(sanPhams, (draft) => {
      if (!draft[spIndex].otherFees) draft[spIndex].otherFees = [];
      const otherFees = draft[spIndex].otherFees[index];
      const value =
        key === "unit_price"
          ? formatOnlyNumber(e.target.value)
          : e.target.value;
      if (!otherFees) {
        draft[spIndex].otherFees[index] = {};
        draft[spIndex].otherFees[index][key] = value;
      } else {
        draft[spIndex].otherFees[index][key] = value;
      }
    });

    setSanPhams(newProducts);
  };

  const handleRemoveRecord = (index: number, remove: any) => {
    remove(index);
    const newProducts = produce(sanPhams, (draft) => {
      draft[spIndex]?.otherFees.splice(index, 1);
    });

    setSanPhams(newProducts);
  };

  const feeColumns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: t("quan_ly_dv_mo_tk.detail.stt"),
      width: "5px",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.fee_name"),
      render: (_, { name, ...restField }) => (
        <Form.Item
          // className={styles.clear_margin}
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, "fee_name"]}
          rules={[...RULES_FORM.required]}
        >
          <Input
            onBlur={(e) => handleChangeInput(e, "fee_name", name)}
            placeholder={t("quan_ly_dv_mo_tk.detail.fee_name") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.unit_price"),
      width: "200px",
      render: (_, { name, ...restField }) => (
        <Form.Item
          // className={styles.clear_margin}
          {...restField}
          style={{ marginBottom: 0 }}
          name={[name, "unit_price"]}
          rules={[...RULES_FORM.required]}
        >
          <InputNumber
            onBlur={(e) => handleChangeInput(e, "unit_price", name)}
            placeholder={t("quan_ly_dv_mo_tk.detail.unit_price") || ""}
            style={{ width: "100%" }}
            formatter={formatNumber}
          />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      width: "10px",
      dataIndex: "name",
      align: "center",
      render: (name) => (
        <Button
          icon={<XoaIcon />}
          type="text"
          danger
          onClick={() => {
            handleRemoveRecord(name, remove);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Typography.Text strong style={{ marginBottom: 10, display: "block" }}>
        1b. Chi phí khác
      </Typography.Text>
      <Form form={form}>
        <Form.List name={"otherFees"}>
          {(fields, { remove, add }) => (
            <Table
              size="small"
              style={{ width: "50%" }}
              columns={feeColumns({ remove })}
              dataSource={fields}
              bordered
              pagination={false}
              footer={() => {
                return (
                  <Row justify={"end"}>
                    <Col>
                      <PlusCircleOutlined onClick={() => add()} />
                    </Col>
                  </Row>
                );
              }}
            />
          )}
        </Form.List>
      </Form>
    </>
  );
}
