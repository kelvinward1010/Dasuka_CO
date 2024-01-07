import { DoubleRightOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Input,
  InputNumber,
  InputRef,
  Space,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import dayjs from "dayjs";
import produce from "immer";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { queryClient } from "@/lib/react-query";
import { ICoDocument } from "@/module/quan-ly-ho-so-co-v2/types";
import { formatNumber } from "@/utils/format";
import { decimalUSD } from "@/utils/intl";

import styles from "../../../style.module.scss";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import { isCheckedLackedState } from "../state/tcs";
import { isDoneCoDocument } from "../utils";
import filterMaterial from "./filterMaterial";

// TODO: need change
export function WoNonVat(): JSX.Element {
  const { id } = useParams();
  const coDocument = queryClient.getQueryData<ICoDocument>([
    "co-documents",
    id,
  ]);

  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { sanPham, spIndex } = useRecoilValue(sanPhamSelector);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const isDone = isDoneCoDocument(coDocument?.status_id);
  const isCheckedLacked = useRecoilValue(isCheckedLackedState);
  const dataMaterials = (sanPham?.nguyen_lieu ?? []).map(
    (i: any, index: number) => ({
      ...i,
      key: index,
    }),
  );

  useEffect(() => {
    if (sanPham?.nguyen_lieu && !isCheckedLacked)
      setCurrentData(_.slice(dataMaterials, 0, 10));
    else if (sanPham?.nguyen_lieu && isCheckedLacked)
      setCurrentData(
        dataMaterials.filter(
          (material: any) =>
            material.status_nvl !== t("for_all.enough") ||
            material?.norm_vat_invoice_import_declaration?.find(
              (i: any) => i.check_import_date === 0,
            ),
        ),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanPham?.nguyen_lieu, isCheckedLacked]);

  const searchInput = useRef<InputRef>(null);

  const onChangeDate =
    (__: any, index: number, key: string): DatePickerProps["onChange"] =>
    (_, dateString) => {
      const newSanPhams = produce(sanPhams, (draft) => {
        draft[spIndex].nguyen_lieu[index][key] = dateString
          ? dayjs(dateString).format("YYYY-MM-DD")
          : null;
      });

      setSanPhams(newSanPhams);
    };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    key?: string,
  ) => {
    if (key) {
      const newSanPhams = produce(sanPhams, (draft) => {
        draft[spIndex].nguyen_lieu[index][key] = e;
      });
      setSanPhams(newSanPhams);
      return;
    }
    const { name, value } = e.target;
    const newSanPhams = produce(sanPhams, (draft) => {
      draft[spIndex].nguyen_lieu[index][name] = value;
    });

    setSanPhams(newSanPhams);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Ngày mua",
      key: "wo_date_buy",
      render: (_: any, record: any, index: number) => {
        return (
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày"
            value={record.wo_date_buy && dayjs(record.wo_date_buy)}
            onChange={onChangeDate(record, index, "wo_date_buy")}
            disabled={isDone}
          />
        );
      },
    },
    {
      title: "Tên người bán",
      dataIndex: "wo_name_sale",
      render: (_: any, record: any, index) => (
        <>
          <Input
            value={record?.wo_name_sale}
            onChange={(e) => handleChangeInput(e, index)}
            name="wo_name_sale"
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "wo_address",
      render: (_: any, record: any, index) => (
        <>
          <Input
            value={record?.wo_address}
            onChange={(e) => handleChangeInput(e, index)}
            name="wo_address"
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
    {
      title: "CMT - Ngày cấp",
      dataIndex: "wo_number_cmt",
      children: [
        {
          title: "Số",
          align: "center",
          dataIndex: "wo_number_cmt",
          render: (_: any, record: any, index) => (
            <Input
              value={record?.wo_number_cmt}
              onChange={(e) => handleChangeInput(e, index)}
              name="wo_number_cmt"
              disabled={isDone}
              onClick={(e: any) => e.target?.select?.()}
            />
          ),
        },
        {
          title: "Ngày",
          align: "center",
          dataIndex: "wo_date_cmt",
          render: (_: any, record: any, index: number) => (
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày"
              value={record?.wo_date_cmt && dayjs(record.wo_date_cmt)}
              name="wo_date_cmt"
              onChange={onChangeDate(record, index, "wo_date_cmt")}
              disabled={isDone}
            />
          ),
        },
      ],
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name_nvl",
      width: "13%",
      render: (value) => value,
      ...filterMaterial({
        dataIndex: "name_nvl",
        originData: dataMaterials,
        searchInput,
        setCurrentData,
        title: "tên NVL",
      }),
    },
    {
      title: "Nơi khai thác/đánh bắt/nuôi trồng ",
      dataIndex: "address_exploit",
      render: (_: any, record: any, index) => (
        <>
          <Input
            value={record?.address_exploit}
            onChange={(e) => handleChangeInput(e, index)}
            name="address_exploit"
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
    {
      title: "Số lượng & đơn vị",
      dataIndex: "wo_quantity_unit",
      render: (_: any, record: any) => (
        <Typography.Text>
          {decimalUSD.format(record?.dmkchh) + " " + record?.dvt}
        </Typography.Text>
      ),
    },
    {
      title: "Đơn giá (VNĐ) ",
      dataIndex: "wo_unit_price",
      render: (_: any, record: any, index: number) => (
        <>
          <InputNumber
            value={record?.wo_unit_price}
            style={{ width: "100%" }}
            onChange={(e: any) => handleChangeInput(e, index, "wo_unit_price")}
            name="wo_unit_price"
            formatter={formatNumber}
            min={0}
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
    {
      title: "Tổng trị giá(VNĐ)",
      dataIndex: "wo_total_price",
      align: "right",
      render: (__, record) => (
        <Typography.Text>
          {decimalUSD.format(
            +_.round((record?.dmkchh || 0) * (record?.wo_unit_price || 0), 6),
          )}
        </Typography.Text>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "wo_note",
      render: (_: any, record: any, index: number) => (
        <>
          <Input
            value={record?.wo_note}
            onChange={(e) => handleChangeInput(e, index)}
            name="wo_note"
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        scroll={{ y: 340 }}
        id={"wo-non-vat"}
        bordered
        columns={columns}
        pagination={false}
        dataSource={currentData}
        size="small"
        rowKey={(record) => record?.key}
      />

      <Space
        align="center"
        style={{ justifyContent: "end", width: "100%", padding: 10 }}
      >
        <Button
          type="link"
          style={{ fontWeight: 700 }}
          disabled={
            dataMaterials?.length <= currentData.length || isCheckedLacked
          }
          onClick={() =>
            setCurrentData((prev) =>
              _.slice(dataMaterials, 0, prev.length + 50),
            )
          }
        >
          {t("for_all.button_more")} ({currentData.length}){" "}
          <DoubleRightOutlined
            className={styles.floating}
            style={{ transform: "rotate(90deg)" }}
          />
        </Button>
      </Space>
    </>
  );
}
