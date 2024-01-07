import {
  Button,
  Col,
  Form,
  FormListFieldData,
  FormListOperation,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { XoaIcon } from "@/assets/svg";
import { tagRender } from "@/constant/antd";
import { getUserSelector } from "@/store/auth/state";
import { formatNumber } from "@/utils/format";

import { RULES_DECLARATION_DETAIL } from "../api/createDeclarationReport";
import { useDeclarationReport } from "../api/getDeclarationReport";
import { useFees } from "../api/getFees";
import { OpenDeclarationReport } from "../types";
import styles from "./FormSpecializedFee.module.scss";

interface Props {
  openDeclarationReport: OpenDeclarationReport;
  setFieldsValue: Function;
}

export function FormSpecializedFeeService({
  openDeclarationReport,
  setFieldsValue,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState(
    () =>
      openDeclarationReport?.fees
        ?.filter((item) => item.fee_type === "CN")
        .map((item) => item.fee_name) || [],
  );
  const userRecoil = useRecoilValue(getUserSelector);

  const listFees = useFees({
    params: {
      pageIndex: 1,
      pageSize: 100,
      user_id: userRecoil.user_id,
    },
  });

  const { data } = useDeclarationReport({
    id: openDeclarationReport?.report_id,
  });

  useEffect(() => {
    if (selectedValues && openDeclarationReport && data) {
      openDeclarationReport.fees = data.fees;
      const newValues =
        listFees?.data?.data.filter((elem: any) => {
          return selectedValues.some((ele) => {
            return ele === elem.fee_name;
          });
        }) || [];

      newValues.forEach((elem: any) => {
        const ele = openDeclarationReport.fees?.find(
          (el) => el.fee_id === elem.fee_id,
        );
        elem.quantity = ele?.quantity || 1;
        elem.unit_price = ele?.unit_price || 0;
      });

      openDeclarationReport.fees = Object.assign(newValues);
      setFieldsValue(openDeclarationReport);
    }
  }, [selectedValues, listFees, openDeclarationReport, data]);

  const columns = ({
    remove,
  }: Pick<
    FormListOperation,
    "remove"
  >): TableColumnsType<FormListFieldData> => [
    {
      title: t("quan_ly_dv_mo_tk.detail.stt"),
      width: "5%",
      align: "center",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.fee_name"),
      width: "25%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          name={[name, "fee_name"]}
          rules={RULES_DECLARATION_DETAIL.fee_name}
        >
          <Input
            disabled
            style={{ backgroundColor: "#ffffff", color: "#222" }}
            placeholder={t("quan_ly_dv_mo_tk.create_specialized.name") || ""}
          />
        </Form.Item>
      ),
    },
    {
      title: t("quan_ly_dv_mo_tk.detail.unit_price"),
      width: "10%",
      render: (_, { name, ...restField }) => (
        <Form.Item
          className={styles.clear_margin}
          {...restField}
          name={[name, "unit_price"]}
          rules={RULES_DECLARATION_DETAIL.unit_price}
        >
          <InputNumber
            placeholder={t("quan_ly_dv_mo_tk.detail.unit_price") || ""}
            style={{ width: "100%" }}
            formatter={formatNumber}
            min={0}
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
        <Popconfirm
          title="Bạn có muốn xóa không?"
          onConfirm={() => {
            const newValues = JSON.parse(JSON.stringify(selectedValues));
            newValues.splice(name, 1);
            setSelectedValues(newValues);
            remove(name);
          }}
        >
          <Button icon={<XoaIcon />} type="text" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Row gutter={16}>
      <div className={styles.select}>
        <Typography.Text>Chọn tên phí</Typography.Text>
        <Form.Item
          className={styles.clear_margin}
          style={{ flex: "auto", marginLeft: ".5rem" }}
          // label={t("quan_ly_dv_mo_tk.create_specialized.title_select")}
        >
          <Select
            showSearch
            placeholder="Chọn phí chuyên ngành"
            optionFilterProp="children"
            mode="multiple"
            value={selectedValues}
            onChange={(values) => setSelectedValues(values)}
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={listFees?.data?.data?.map((item: any) => ({
              label: item.fee_name,
              value: item.fee_name,
            }))}
            tagRender={(props) =>
              tagRender({
                ...props,
                onClose: (event: any) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedValues(props.value);
                },
              })
            }
            maxTagCount="responsive"
          ></Select>
        </Form.Item>
      </div>
      <Col span={24}>
        <Form.List name="fees">
          {(fields, { remove }) => (
            <Table
              size="small"
              bordered
              columns={columns({ remove })}
              dataSource={fields}
            />
          )}
        </Form.List>
      </Col>
    </Row>
  );
}
