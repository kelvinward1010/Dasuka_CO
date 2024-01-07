import { DoubleRightOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
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
import { UpdateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/UpdateVatInvoice";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { IImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/types";
import { handleSaveCoState } from "@/store/action/atom";

import styles from "../../../style.module.scss";
import { handleCalculateUnitPrice } from "../../config/sum-formula";
import { AddTknkAndVatModal } from "../modals/AddTknkAndVat";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import { isCheckedLackedState } from "../state/tcs";
import {
  getMaterialErrorMessage,
  handleChangeImportDeclaration,
  isDoneCoDocument,
} from "../utils";
import filterMaterial from "./filterMaterial";

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

export default function WoTable(): JSX.Element {
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
  const handleSave = useRecoilValue(handleSaveCoState);
  const [needSave, setNeedSave] = useState<boolean>(false);
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

  useEffect(() => {
    if (needSave) {
      handleSave();
      setNeedSave(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needSave]);

  const searchInput = useRef<InputRef>(null);

  const handleChangeInput = (e: any, index: number) => {
    const { name, value } = e.target;
    const newSanPhams = produce(sanPhams, (draft) => {
      draft[spIndex].nguyen_lieu[index][name] = value;
    });

    setSanPhams(newSanPhams);
  };

  // const handleChangeImportDeclaration = (
  //   importDeclaration: IImportDeclaration,
  //   importDeclarationId: string,
  // ) => {
  //   const newSanPhams = produce(sanPhams, (draft) => {
  //     draft.forEach((sanPham) => {
  //       sanPham.nguyen_lieu.forEach((nl: any) => {
  //         nl.norm_vat_invoice_import_declaration.forEach((norm: any) => {
  //           if (norm.import_declaration_id === importDeclarationId) {
  //             norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
  //             norm.form = importDeclaration.form;
  //             norm.prefer_co_date = importDeclaration.prefer_co_date
  //               ? dayjs(importDeclaration.prefer_co_date).format("DD/MM/YYYY")
  //               : null;
  //             norm.prefer_co_document_number =
  //               importDeclaration.prefer_co_document_number;
  //           }
  //         });
  //       });
  //     });
  //   });

  //   setSanPhams(newSanPhams);
  //   setNeedSave(true);
  // };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      align: "center",
      width: 50,
      render: (_, __, index) => ++index,
    },
    {
      title: "Thông tin nguyên liệu, vật tư",
      width: 300,
      render: (_, record) => {
        const hsCode = record.hs_code
          ? record.hs_code
          : record?.norm_vat_invoice_import_declaration?.find(
              (item: any) => item.material_code?.trim() === record.mmnv?.trim(),
            )?.hs_code;
        return (
          <Typography.Text
            title={getMaterialErrorMessage(record)}
            type={hsCode ? undefined : "danger"}
          >{`${hsCode ? hsCode + " - " : ""} ${record?.mmnv} - ${
            record.name_nvl
          }`}</Typography.Text>
        );
      },
      ...filterMaterial({
        dataIndex: "name_nvl",
        originData: dataMaterials,
        searchInput,
        setCurrentData,
        title: "tên NVL",
      }),
    },
    {
      title: "Nơi khai thác/ đánh bắt/ nuôi trồng ",
      dataIndex: "address_exploit",
      width: 150,
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
      title: "Số lượng",
      dataIndex: "sl",
      width: 80,
      align: "right",
      render: (_, record) => `${record?.dmkchh}`,
    },
    {
      title: "Đơn giá (CIF)",
      align: "right",
      dataIndex: "cif",
      width: 120,
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
      width: 120,
      align: "right",
      render: (_, record) => handleCalculateUnitPrice(record, "").value,
    },
    {
      title: "Thông tin nhà cung cấp",
      dataIndex: ["wo", "wo_info_supplier"],
      width: 200,
      render: (_: any, record: any, index) => (
        <>
          <Input
            name="wo_info_supplier"
            value={record?.wo_info_supplier}
            onChange={(e) => handleChangeInput(e, index)}
            disabled={isDone}
            onClick={(e: any) => e.target?.select?.()}
          />
        </>
      ),
    },
    {
      title: "Thông tin tờ khai nhập/ VAT",
      dataIndex: "norm_vat_invoice_import_declaration",
      width: 120,
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
                      sanPhams,
                      setSanPhams,
                      setNeedSave,
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
                      sanPhams,
                      setSanPhams,
                      setNeedSave,
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
      title: "Phụ lục X",
      children: [
        {
          title: "Số",
          align: "center",
          width: 110,
          dataIndex: "norm_vat_invoice_import_declaration",
          render: (declarations) => {
            return (
              <Space direction="vertical">
                {declarations?.map(
                  (itemDeclaration: any, indexOfInvoice: number) => {
                    return (
                      <Space key={indexOfInvoice}>
                        <Typography.Text key={indexOfInvoice}>
                          {itemDeclaration.x_annex_code}
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
          width: 110,
          dataIndex: "norm_vat_invoice_import_declaration",
          render: (declarations) => {
            return (
              <Space direction="vertical">
                {declarations?.map(
                  (itemDeclaration: any, indexOfInvoice: number) => {
                    return (
                      <Space key={indexOfInvoice}>
                        <Typography.Text key={indexOfInvoice}>
                          {itemDeclaration.x_annex_date
                            ? dayjs(itemDeclaration.x_annex_date).format(
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
      width: 80,
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
        id={"wo"}
        scroll={{ y: 340 }}
        bordered
        columns={columns}
        pagination={false}
        dataSource={currentData}
        rowKey={(record) => record.key}
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
