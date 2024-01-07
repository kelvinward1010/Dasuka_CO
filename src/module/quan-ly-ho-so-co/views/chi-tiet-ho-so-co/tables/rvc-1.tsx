import { DoubleRightOutlined } from "@ant-design/icons";
import {
  Button,
  InputRef,
  Space,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { UpdateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/UpdateVatInvoice";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { IImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/types";
import { handleSaveCoState } from "@/store/action/atom";
import { chooseFormCOSelector } from "@/store/choose/state";
import { decimalUSD } from "@/utils/intl";

import styles from "../../../style.module.scss";
import { customTitle } from "../../config/custom-title";
import {
  handleCalculateUnitPrice,
  handleTotalChiPhiNguyenLieu,
} from "../../config/sum-formula";
import { getTitle } from "../../config/title";
import { selectForm } from "../../fakedata/fakedata";
import { AddTknkAndVatModal } from "../modals/AddTknkAndVat";
import { sanPhamSelector, sanPhamState } from "../state/bigA";
import { isCheckedLackedState } from "../state/tcs";
import {
  getMaterialErrorMessage,
  handleChangeImportDeclaration,
} from "../utils";
import FeeTableCO from "./fee-table";
import filterMaterial from "./filterMaterial";

export default function ChiPhiNguyenLieuFromRvcTable(): JSX.Element {
  const { t } = useTranslation();
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);
  const customer = useRecoilValue(customerState);
  // const [, setTotal] = useRecoilState(total1RvcState);
  const handleSave = useRecoilValue(handleSaveCoState);
  const [needSave, setNeedSave] = useState<boolean>(false);
  const isCheckedLacked = useRecoilValue(isCheckedLackedState);
  const dataMaterials = (sanPham?.nguyen_lieu ?? []).map(
    (i: any, index: number) => ({
      ...i,
      key: index,
    }),
  );
  // const dataOtherFees = sanPham?.otherFees ?? [];

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

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      align: "center",
      width: "3%",
      render: (_, __, index) => ++index,
    },
    {
      title: "Thông tin nguyên liệu, vật tư",
      width: "24%",
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
      title: "ĐVT",
      dataIndex: "dvt",
      align: "center",
      width: "4%",
    },
    {
      title: "ĐMKCHH",
      align: "right",
      dataIndex: "dmkchh",
      width: "6%",
      render: (value) => Number(value).toFixed(6),
    },
    {
      title: "Đơn giá (CIF)",
      align: "right",
      dataIndex: "cif",
      width: "5%",
      render: (__, record) => {
        const cifPrice = handleCalculateUnitPrice(record, chooseFormCo);

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
      title: customTitle("TG", getTitle("rvc")?.left),
      align: "right",
      width: "6%",
      dataIndex: "tg_trong_nuoc",
      render: (__, record) => {
        const unitPrice = handleCalculateUnitPrice(record, chooseFormCo);

        return (
          <Space direction="vertical">
            {unitPrice.isInLocal ? unitPrice.value : ""}
          </Space>
        );
      },
    },
    {
      title: customTitle("TG", getTitle("rvc")?.right),
      align: "right",
      width: "6%",
      dataIndex: "tg_ngoai_nuoc",
      render: (__, record) => {
        const unitPrice = handleCalculateUnitPrice(record, chooseFormCo);

        return (
          <Space direction="vertical">
            {unitPrice.isInLocal ? "" : unitPrice.value}
          </Space>
        );
      },
    },
    {
      title: "Nước xuất xứ",
      align: "center",
      width: "7%",
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
      width: 40,
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
                  check_import_date={i.check_import_date}
                  indexMaterial={indexMaterial}
                  onSuccess={(importDeclaration) =>
                    handleChangeImportDeclaration(
                      importDeclaration,
                      i.import_declaration_id,
                      sanPhams,
                      setSanPhams,
                      setNeedSave,
                    )
                  }
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
      title: "Form",
      align: "center",
      dataIndex: "norm_vat_invoice_import_declaration",
      width: 30,
      render: (declarations) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          {declarations?.map((itemDeclaration: any, indexOfInvoice: number) => {
            const form = selectForm.find(
              (form) => form.value === itemDeclaration.form,
            )?.label;
            return (
              <Space key={indexOfInvoice}>
                <Typography.Text key={indexOfInvoice}>{form}</Typography.Text>
              </Space>
            );
          })}
        </Space>
      ),
    },
    {
      title: "C/O ưu đãi NK/ Bản khai báo của NSX/CC  NL trong nước",
      children: [
        {
          title: "Số",
          align: "center",
          width: 30,
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
          width: 30,
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
      align: "center",
      dataIndex: "status_nvl",
      width: "6%",
      render: (_, record) => (
        <div>
          <AddTknkAndVatModal record={record} status_nvl={record?.status_nvl} />
        </div>
      ),
    },
  ];

  // useEffect(() => {
  //   if (dataNVL && dataOtherFees) {
  //     const totalmain = handleTotalChiPhiNguyenLieu(dataNVL, dataOtherFees);
  //     setTotal(Number(totalmain));
  //   }
  // }, []);

  return (
    <>
      <Typography.Text strong>
        1. Chi phí nguyên liệu (
        {decimalUSD.format(
          Number(handleTotalChiPhiNguyenLieu(dataMaterials)) ?? 0,
        )}
        )
      </Typography.Text>
      <Table
        scroll={{ y: 340 }}
        bordered
        id={"rvc"}
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

      {customer?.processing_fee === 1 && (
        <>
          <br />
          <FeeTableCO />
        </>
      )}
    </>
  );
}
