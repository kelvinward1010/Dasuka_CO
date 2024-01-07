import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Input,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { mergePdfAndDownload } from "@/apis/downloadFile";
import { getVatDocuments } from "@/module/quan-ly-ho-so-co-v2/api/getVatDocuments";
import {
  downloadExportCODocument,
  downloadFormExplanation,
  downloadImportCODocument,
} from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/downloadCODocument";
import { getExternalFileMerged } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/getExternalFileMerged";
import { getUserSelector } from "@/store/auth/state";

import { checkNotConversionFactor } from "../utils";
import { danhsachallgiaytodata } from "./fakedata";

const { Text } = Typography;

const antLoadingIcon = <LoadingOutlined spin />;

export function DanhSachAllGiayToTable({
  dataCheckDocuments,
  getChooseFOB,
  sanPhams,
}: {
  dataCheckDocuments: {
    export_declaration_check: number;
    import_declaration_check: number;
    vat_invoice_check: number;
  };
  getChooseFOB: string;
  sanPhams: any[];
}): JSX.Element {
  const [data, setData] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState("");
  const userRecoil = useRecoilValue(getUserSelector);
  const { id } = useParams();

  const { t } = useTranslation();

  const handleDownload = async (key: any) => {
    setIsDownloading(key);
    if (id) {
      switch (key) {
        case 1:
          const expandedName =
            dataCheckDocuments.export_declaration_check === 1 ? "xlsx" : "zip";
          await downloadExportCODocument({
            co_document_id: id,
            expandedNameFile: expandedName,
            user_id: userRecoil.user_id,
          }).catch((err) =>
            notification.error({
              message: t("message.error"),
              description: err.message,
            }),
          );
          break;
        case 2:
          if (getChooseFOB) {
            if (checkNotConversionFactor(sanPhams)) {
              notification.info({
                message: t("message.not_explanation_unit"),
              });
            } else
              await downloadFormExplanation(id).catch((err) =>
                notification.error({
                  message: t("message.error"),
                  description: err.message,
                }),
              );
          } else {
            notification.info({
              message: t("message.not_explanation_fob"),
            });
          }
          break;
        case 3:
          const expandedNameFile =
            dataCheckDocuments.import_declaration_check < 10 ? "xlsx" : "zip";
          await downloadImportCODocument({
            co_document_id: id,
            expandedNameFile,
            user_id: userRecoil.user_id,
          }).catch((err) =>
            notification.error({
              message: t("message.error"),
              description: err.message,
            }),
          );
          break;
        case 4:
          await handleMergedAndDownloadDocument().catch((err) =>
            notification.error({
              message: t("message.error"),
              description: err.message,
            }),
          );
          break;
        default:
          break;
      }

      setIsDownloading("");
    }
  };

  useEffect(() => {
    if (dataCheckDocuments) {
      if (dataCheckDocuments?.vat_invoice_check === 0)
        danhsachallgiaytodata.splice(3, 1);
      if (dataCheckDocuments?.import_declaration_check === 0)
        danhsachallgiaytodata.splice(2, 1);
      // if (!getChooseFOB || checkNotConversionFactor(sanPhams))
      //   danhsachallgiaytodata.splice(1, 1);

      setData(danhsachallgiaytodata);
    }
  }, [dataCheckDocuments]);

  const handleMergedAndDownloadDocument = async () => {
    let fileVats: any[] = [];
    if (id) {
      fileVats = await getVatDocuments({ id });
    }

    const externalFile = await getExternalFileMerged([
      ...fileVats.map((item) => item.file_path),
    ]);

    if (externalFile?.result) {
      return mergePdfAndDownload({
        files: fileVats?.map((v) => v.file_path),
        external: externalFile?.data?.externalFile,
      });
    } else {
      const listFiles =
        externalFile?.data?.map((path: string) => {
          let file = path?.split("//");
          if (file.length === 1) file = path?.split("/");
          return file?.[file.length - 1];
        }) || [];

      notification.error({
        message: t("message.download_failure"),
        description: t("message.download_not_existed") + listFiles.join(", "),
      });
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      width: "7%",
      key: "stt",
      align: "center",
      render: (_, __, index) => <Typography.Text>{++index}</Typography.Text>,
    },
    {
      title: "Tên file",
      dataIndex: "name_file",
      key: "name_file",
      render: (text: any) => <Text style={{ textAlign: "left" }}>{text}</Text>,
    },
    {
      title: "Ghi chú",
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      width: "35%",
      render: (text: any) => (
        <Input
          disabled
          style={{
            textAlign: "left",
            backgroundColor: "#f1f1f1",
            cursor: "not-allowed",
            color: "#222",
          }}
          value={text}
        />
      ),
    },
    {
      title: "Tải về",
      width: "7%",
      key: "download",
      align: "center",
      render: (_: any, record: any) => (
        <Spin
          spinning={isDownloading === record.key}
          indicator={antLoadingIcon}
        >
          <DownloadOutlined
            onClick={() => handleDownload(record?.key)}
            style={{ color: "#13AEDF", cursor: "pointer" }}
          />
        </Spin>
      ),
    },
  ];

  return (
    <Table
      bordered
      columns={columns}
      size="small"
      dataSource={data}
      pagination={false}
    />
  );
}
