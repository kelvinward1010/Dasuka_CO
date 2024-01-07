import {
  Button,
  Form,
  Input,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import * as XLSX from "xlsx";

import { queryClient } from "@/lib/react-query";
import { UpdateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/UpdateVatInvoice";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { getUserSelector } from "@/store/auth/state";
import { decimalUSD, decimalUSD2Number } from "@/utils/intl";

import { IImportDeclaration } from "../../bao-cao-nvl/types";
import { useUpdateMaterial } from "../api/materials/updateMaterial";
import { INormDetail } from "../types";

// import { NormalizeNormModal } from "../views/modals/NormalizeNormModal";

interface Props {
  setNormDetail: Dispatch<SetStateAction<INormDetail[]>>;
}

export function ImportNormDetail({ setNormDetail }: Props): JSX.Element {
  const [notificationApi] = notification.useNotification();
  const refImport = useRef<HTMLInputElement>(null);

  const handleClickImport = () => {
    refImport.current?.click();
  };

  const handleInputFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target?.result, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<string[]>(ws, {
        header: 1,
        blankrows: false,
      });

      // INFO: dataImportRaw is mutable
      const dataImportRaw = data.slice(9, data.length - 11).map((item) => ({
        norm_material_name: item[1],
        material_code: item[2],
        unit: item[3],
        norm_value: item[4],
        loss_ratio: item[5],
        norm_value_loss: item[6],
        source: item[7],
      }));

      setNormDetail(dataImportRaw as any);
    };
    reader.onerror = () => {
      notificationApi.error({
        message: "File không đúng định dạng",
        duration: 2,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button type="primary" onClick={handleClickImport}>
        Import
      </Button>
      <input
        ref={refImport}
        type="file"
        accept=".xlsx, .xls, .csv"
        hidden
        onChange={handleInputFileChange}
      />
    </>
  );
}

interface IImportNormDetailTableProps {
  norm_id: number;
  normDetail: INormDetail[];
}

export function ImportNormDetailTable({
  // norm_id,
  normDetail,
}: IImportNormDetailTableProps): JSX.Element {
  const { t } = useTranslation();
  const [idMaterial, setIdMaterial] = useState("");
  const userRecoil = useRecoilValue(getUserSelector);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateMaterial = useUpdateMaterial({
    config: {
      onSuccess: (data) => {
        if (data.results)
          notification.success({
            message: data.message,
          });
        queryClient.invalidateQueries(["norm"]);
      },
    },
  });

  const handleUpdateMaterial = (newName: string, material: INormDetail) => {
    setIdMaterial("");
    updateMaterial.mutate({
      material_code: material.material_code,
      norm_material_name: newName,
      lu_user_id: userRecoil.user_id,
    });
  };

  const columns: TableColumnsType<INormDetail> = [
    {
      title: t("quan_ly_dinh_muc.table_add_new.stt"),
      dataIndex: "stt",
      width: "3%",
      render: (_, __, index) => (
        <Typography.Text>
          {pageSize * (pageIndex - 1) + ++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.code_nl_vt"),
      dataIndex: "material_code",
      width: "10%",
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.name"),
      dataIndex: "norm_material_name",
      width: "30%",
      render: (name, record, index) => {
        return idMaterial !== record.material_id ? (
          // <Tooltip title="Nhấn đúp để sửa">
          <Typography.Text
          // style={{ cursor: "default", userSelect: "none" }}
          // onDoubleClick={() => setIdMaterial(record.material_id)}
          >
            {record.norm_material_name}
          </Typography.Text>
        ) : (
          // </Tooltip>
          <Form.Item
            name={[name, "norm_material_name", index]}
            style={{ margin: 0 }}
            initialValue={record.norm_material_name || ""}
          >
            <Input
              autoFocus
              value={record.norm_material_name}
              placeholder="Tên NL, VT"
              onBlur={(e) => handleUpdateMaterial(e.target.value, record)}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dvt"),
      dataIndex: "unit",
      align: "center",
      width: "7%",
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dinh_muc"),
      dataIndex: "norm_value",
      align: "right",
      width: "7%",
      render: (value) => (
        <Typography.Text>{value && decimalUSD.format(+value)}</Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.tlhh"),
      dataIndex: "loss_ratio",
      align: "right",
      width: "7%",
      render: (value) => (
        <Typography.Text>
          {value && decimalUSD2Number.format(+value)}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.dmkchh"),
      dataIndex: "norm_value_loss",
      align: "right",
      width: "7%",
      render: (value) => (
        <Typography.Text>{value && decimalUSD.format(+value)}</Typography.Text>
      ),
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.nguon_cc"),
      dataIndex: "source",
      width: "10%",
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.list_declarations"),
      dataIndex: "import_declaration_id",
      width: "10%",
      render: (value: string) => {
        let text = value || "";

        const lastIndex = text.lastIndexOf(",");

        text = text.substring(lastIndex, 0);

        const digitRegex = /^\d+$/;

        return text?.split(",")?.map((item) =>
          // <div>
          //   <Typography.Text> {item}</Typography.Text>
          // </div>
          digitRegex.test(item) &&
          (item.length === 11 || item.length === 12) &&
          item[0] === "1" ? (
            <UpdateImportDeclaration
              key={item}
              importDeclaration={
                {
                  import_declaration_id: item.substring(0, 11),
                  import_declaration_number: item,
                } as IImportDeclaration
              }
            />
          ) : (
            <UpdateVatInvoice key={item} vatInvoiceId={item} />
          ),
        );
      },
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.serial_list"),
      dataIndex: "sort_order",
      width: "30px",
      render: (value: string) => {
        let text = value || "";

        const lastIndex = text.lastIndexOf(",");

        text = text.substring(lastIndex, 0);

        return text?.split(",")?.map((item) => (
          <div key={item}>
            <Typography.Text> {item}</Typography.Text>
          </div>
        ));
      },
    },
    {
      title: t("quan_ly_dinh_muc.table_add_new.quantity"),
      dataIndex: "quantity",
      width: "30px",
      render: (value: string) => {
        let text = value || "";

        const lastIndex = text.lastIndexOf(",");

        text = text.substring(lastIndex, 0);

        return text?.split(",")?.map((item) => (
          <div key={item}>
            <Typography.Text> {item}</Typography.Text>
          </div>
        ));
      },
    },
    // {
    //   title: "Action",
    //   width: "5%",
    //   align: "center",
    //   render: (_, record) => {
    //     return (
    //       <Tooltip title="Chuẩn hóa tên định mức">
    //         <NormalizeNormModal material={record} norm_id={norm_id} />
    //       </Tooltip>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={normDetail}
        pagination={{
          size: "small",
          style: { margin: "10px 0" },
          position: ["topRight"],
          onChange(page, pageSize) {
            setPageIndex(page);
            setPageSize(pageSize);
          },
        }}
        rowKey={(key) => key.norm_detail_id}
      />
    </>
  );
}
