import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { nanoid } from "@ant-design/pro-components";
import { Col, Form, Input, Row, Table, Typography } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { DataTb3RvcCTState } from "@/store/datanvl/atom";
import { total3RvcState } from "@/store/total/atom";
import { decimalUSD } from "@/utils/intl";

import styles from "../../../style.module.scss";
import { handleTotalChiPhiPhanCongAndPhanBo } from "../../config/sum-formula";

const { Text } = Typography;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: any;
  title: string;
  value: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.select();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} không được để trống.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className={styles.input_add}
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: any;
  title: string;
  value: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

interface dataTable {
  dt: DataType[];
}

export default function ChiPhiPhanBottTable(props: dataTable): JSX.Element {
  const [data, setData] = useState<any[]>(props?.dt || []);
  const [, setTotal] = useRecoilState(total3RvcState);
  const [, setDataX] = useRecoilState<any[]>(DataTb3RvcCTState);

  useEffect(() => {
    setData(props.dt || []);
  }, [props.dt]);

  useEffect(() => {
    setDataX(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleDelete = (key: any) => {
    const newData = data.filter((item: any) => item.key !== key);
    setData(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: any;
  })[] = [
    {
      title: "Tên phí",
      dataIndex: "title",
      width: "55%",
      editable: true,
    },
    {
      title: "Đơn giá (USD)",
      dataIndex: "value",
      align: "right",
      width: "25%",
      editable: true,
    },
    {
      dataIndex: "value",
      width: "5%",
      render: (_: any, record: any) => (
        <div>
          <DeleteOutlined
            onClick={() => handleDelete(record?.key)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: nanoid(),
      title: "Nhập thông tin",
      value: 0,
    };
    setData([...data, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const totalmain = handleTotalChiPhiPhanCongAndPhanBo(data);

  useEffect(() => {
    setTotal(Number(totalmain));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalmain]);

  return (
    <>
      <Text strong>
        3.Chi phí phân bổ trực tiếp ({decimalUSD.format(Number(totalmain) ?? 0)}
        )
      </Text>
      <>
        <Table
          bordered
          columns={columns as ColumnTypes}
          pagination={false}
          rowClassName={() => "editable-row"}
          dataSource={data}
          components={components}
          size="small"
        />
        <Row justify={"space-between"} style={{ marginTop: "10px" }}>
          <Col span={20} />
          <Col span={1}>
            <PlusCircleOutlined
              onClick={handleAdd}
              style={{ color: "#2C678D", fontSize: 20, cursor: "pointer" }}
            />
          </Col>
        </Row>
      </>
    </>
  );
}
