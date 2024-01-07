import { Input, Space, Table, TableColumnsType, Typography } from "antd";
import { InputProps } from "antd/lib/input";
import dayjs from "dayjs";
import produce from "immer";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { UpdateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/UpdateVatInvoice";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { IImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/types";
import { handleSaveCoState } from "@/store/action/atom";
import { decimalUSD } from "@/utils/intl";
import { containsOnlyNumbers } from "@/utils/magic-regexp";

import { handleCalculateUnitPrice } from "../../config/sum-formula";
import { AddTknkAndVatModal } from "../modals/AddTknkAndVat";
import { sanPhamSelector, sanPhamState } from "../state/bigA";

// function cif(record: any) {
//   const usdExchangeRate = _.meanBy(
//     record?.norm_vat_invoice_import_declaration,
//     (i: any) => i.usd_exchange_rate,
//   );

//   const endUsdExchangeRate = usdExchangeRate
//     ? _.round(Number(record?.cif) / usdExchangeRate, 6).toFixed(6)
//     : 0;

//   return record?.cif
//     ? _.round(Number(record?.dmkchh) * Number(endUsdExchangeRate), 6).toFixed(6)
//     : 0;
// }

export default function PeTable(): JSX.Element {
  // const { id } = useParams();
  // const coDocument = queryClient.getQueryData<ICoDocument>([
  //   "co-documents",
  //   id,
  // ]);

  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { sanPham, spIndex } = useRecoilValue(sanPhamSelector);
  // const isDone = isDoneCoDocument(coDocument?.status_id);
  const dataNVL = sanPham?.nguyen_lieu ?? [];
  const handleSave = useRecoilValue(handleSaveCoState);
  const [needSave, setNeedSave] = useState<boolean>(false);

  useEffect(() => {
    if (needSave) {
      handleSave();
      setNeedSave(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSave]);

  const handleChangeNumberSupplier =
    (_: any, materialIndex: number): InputProps["onChange"] =>
    (e) => {
      const { name, value } = e.target;

      if (!containsOnlyNumbers(value)) return;

      const newSanPhams = produce(sanPhams, (draft) => {
        draft[spIndex].nguyen_lieu[materialIndex][name] = value;
      });

      setSanPhams(newSanPhams);
    };

  const handleChangeImportDeclaration = (
    importDeclaration: IImportDeclaration,
    importDeclarationId: string,
  ) => {
    const newSanPhams = produce(sanPhams, (draft) => {
      draft.forEach((sanPham) => {
        sanPham.nguyen_lieu.forEach((nl: any) => {
          nl.norm_vat_invoice_import_declaration.forEach((norm: any) => {
            if (norm.import_declaration_id === importDeclarationId) {
              norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
              norm.form = importDeclaration.form;
              norm.prefer_co_date = importDeclaration.prefer_co_date
                ? dayjs(importDeclaration.prefer_co_date).format("DD/MM/YYYY")
                : null;
              norm.prefer_co_document_number =
                importDeclaration.prefer_co_document_number;
            }
          });
        });
      });
    });

    setSanPhams(newSanPhams);
    setNeedSave(true);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Thông tin nguyên liệu, vật tư",
      width: "18%",
      render: (_, record) => {
        const hsCode = record.hs_code
          ? record.hs_code
          : record?.norm_vat_invoice_import_declaration?.find(
              (item: any) => item.material_code?.trim() === record.mmnv?.trim(),
            )?.hs_code;
        return (
          <Typography.Text type={hsCode ? undefined : "danger"}>{`${
            hsCode ? hsCode + " - " : ""
          } ${record?.mmnv} - ${record.name_nvl}`}</Typography.Text>
        );
      },
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
      title: "Đơn giá (CIF)",
      align: "right",
      dataIndex: "cif",
      width: "8%",
      render: (__, record) => {
        const cifPrice = handleCalculateUnitPrice(record, "");

        return (
          <Space direction="vertical">
            <Typography.Text>
              {cifPrice.value_cif ? cifPrice.value_cif : ""}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "Tổng trị giá",
      dataIndex: "value_all",
      width: "5%",
      align: "right",
      render: (_, record) => handleCalculateUnitPrice(record, "").value,
    },
    {
      title: "Thông tin nhà cung cấp/XK",
      dataIndex: ["pe", "info_ncc"],
      render: (_: any, record: any, index) => (
        <Input
          onChange={(e) => handleChangeNumberSupplier(e, index)}
          value={record?.pe?.info_ncc}
          name="info_ncc"
        />
      ),
    },
    {
      title: "Nước xuất xứ",
      align: "center",
      width: "5%",
      dataIndex: "norm_vat_invoice_import_declaration",
      render: (declarations) => {
        return (
          <Space direction="vertical">
            {declarations?.map((itemDeclaration: any, index: number) => (
              <Space key={index}>
                <Typography.Text>
                  {!itemDeclaration?.vat_invoice_id
                    ? itemDeclaration?.origin_country
                    : itemDeclaration?.x_annex_code
                    ? "Việt Nam"
                    : "Mua tại Việt Nam"}
                </Typography.Text>
              </Space>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Thông tin tờ khai nhập/ VAT",
      dataIndex: "norm_vat_invoice_import_declaration",
      width: "8%",
      render: (declarations, __, indexMaterial) => {
        return (
          <Space direction="vertical">
            {declarations?.map((i: any, index: number) =>
              i.import_declaration_id ? (
                <UpdateImportDeclaration
                  key={index}
                  isNeedUpdateExchangeRate={(i?.usd_exchange_rate ?? 0) === 0}
                  importDeclaration={
                    {
                      import_declaration_number: i.import_declaration_number,
                      import_declaration_id: i.import_declaration_id,
                    } as IImportDeclaration
                  }
                  onSuccess={(importDeclaration) =>
                    handleChangeImportDeclaration(
                      importDeclaration,
                      i.import_declaration_id,
                    )
                  }
                  indexMaterial={indexMaterial}
                />
              ) : (
                <UpdateVatInvoice
                  key={index}
                  isNeedUpdateExchangeRate={(i?.usd_exchange_rate ?? 0) === 0}
                  vatInvoiceId={i.vat_invoice_id}
                  serialNumber={i.serial_number}
                  check_import_date={i.check_import_date}
                  onSuccess={(importDeclaration) =>
                    handleChangeImportDeclaration(
                      importDeclaration,
                      i.vat_invoice_id,
                    )
                  }
                  indexMaterial={indexMaterial}
                />
              ),
            )}
          </Space>
        );
      },
    },
    {
      title: "C/O ưu đãi NK/ Bản khai báo của NSX/CC  NL trong nước",
      children: [
        {
          title: "Số",
          align: "center",
          width: 120,
          dataIndex: "norm_vat_invoice_import_declaration",
          render: (declarations) => {
            return (
              <Space direction="vertical">
                {declarations?.map(
                  (itemDeclaration: any, indexOfInvoice: number) => {
                    return (
                      <Space key={indexOfInvoice}>
                        <Typography.Text key={indexOfInvoice}>
                          {itemDeclaration.x_annex_code ||
                            itemDeclaration.prefer_co_document_number}
                        </Typography.Text>
                      </Space>
                    );
                  },
                )}
              </Space>
            );
          },
        },
        {
          title: "Ngày",
          align: "center",
          width: 120,
          dataIndex: "norm_vat_invoice_import_declaration",
          render: (declarations) => {
            return (
              <Space direction="vertical">
                {declarations?.map(
                  (itemDeclaration: any, indexOfInvoice: number) => {
                    return (
                      <Space key={indexOfInvoice}>
                        <Typography.Text key={indexOfInvoice}>
                          {itemDeclaration.prefer_co_date
                            ? dayjs(itemDeclaration.prefer_co_date).format(
                                "DD/MM/YYYY",
                              )
                            : ""}
                        </Typography.Text>
                      </Space>
                    );
                  },
                )}
              </Space>
            );
          },
        },
      ],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "7%",
      render: (_: any, record: any) => (
        <div>
          <AddTknkAndVatModal record={record} status_nvl={record?.status_nvl} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        scroll={{ y: 340 }}
        bordered
        columns={columns}
        pagination={false}
        dataSource={dataNVL}
      />
    </>
  );
}
