import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
  UploadProps,
  notification,
} from "antd";
import { UploadFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  BASE_HTTP_URL_DOWNLOAD,
  downloadArchiveFiles,
} from "@/apis/downloadFile";
import { removeVietnameseTones } from "@/apis/useUploadFile";
import { useUploadFiles } from "@/apis/useUploadFiles";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getVatDocuments } from "@/module/quan-ly-ho-so-co-v2/api/getVatDocuments";
import { useCheckDocuments } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/checkDocuments";
import { useCreateOtherDocument } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/createOtherDocument";
import { useGetOtherDocuments } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/getOtherDocuments";
import { CreateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/CreateVatInvoice";
import { ImportAllDeclarationExcel } from "@/module/quan-ly-to-khai/export-declaration/components/ImportAllDeclarationExcel";
import { ImportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/ImportDeclaration";
import { getUserSelector } from "@/store/auth/state";
import { chooseFOBSelector } from "@/store/choose/state";
import storage from "@/utils/storage";

import { sanPhamState } from "../state/bigA";
import { DanhSachAllGiayToTable } from "../tables/danh-sach-all-giay-to";
import { DanhSachTkHdTable } from "../tables/danh-sach-tk-hd";
import { checkNotConversionFactor } from "../utils";
import styles from "./ChiTietBoTaiLieu.module.scss";
import { FOBPrice } from "./FOBPrice";

const { Text } = Typography;

export function ChiTietBoTaiLieuCOModal({
  isCreate = false,
  isDone = false,
}: {
  isCreate?: boolean;
  isDone?: boolean;
}) {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const [fileList, setFileList] = useState<UploadFile<Blob>[]>([]);
  const { id } = useParams();
  const { t } = useTranslation();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userRecoil = useRecoilValue(getUserSelector);
  const getChooseFOB = useRecoilValue(chooseFOBSelector);
  const [sanPhams] = useRecoilState(sanPhamState);

  const createOtherDocument = useCreateOtherDocument({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["co-document-files"]);
        // close();
        form.resetFields();
        setFileList([]);
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
          description: err.message,
        });
      },
    },
  });

  const { data: dataCheckDocuments } = useCheckDocuments({
    co_document_id: id || "0",
    config: {
      enabled: isOpen,
    },
  });

  const handleOpen = () => {
    open();
  };

  const { data } = useGetOtherDocuments({
    co_document_id: id || "0",
    config: {
      enabled: isOpen,
    },
  });

  // Download archive file (zip)
  const handleOk = async () => {
    setConfirmLoading(true);
    const date = dayjs().format("YYYYMMDD_HHmmss");

    const fileBlobs = [
      {
        path: "export-codocument-exportdeclaration",
        fileName: `TKXK_${date}.${
          dataCheckDocuments?.export_declaration_check === 1 ? "xlsx" : "zip"
        }`,
        blobUrl: `${BASE_HTTP_URL_DOWNLOAD}/export-codocument-exportdeclaration/${userRecoil.user_id}/${id}`,
      },
    ];
    if (dataCheckDocuments?.import_declaration_check > 0) {
      fileBlobs.push({
        path: "export-codocument-importdeclaration",
        fileName: `TKNK_${date}.${
          dataCheckDocuments?.import_declaration_check < 10 ? "xlsx" : "zip"
        }`,
        blobUrl: `${BASE_HTTP_URL_DOWNLOAD}/export-codocument-importdeclaration/${userRecoil.user_id}/${id}`,
      });
    }
    if (getChooseFOB) {
      if (checkNotConversionFactor(sanPhams)) {
        notification.info({
          message: "Không có file giải trình do chưa chuyển đổi đơn vị tính.",
        });
      } else
        fileBlobs.push({
          path: "export-codocument-explanation",
          fileName: `Form_giai_trinh_${date}.xlsx`,
          blobUrl:
            `${BASE_HTTP_URL_DOWNLOAD}/export-codocument-explanation/` + id,
        });
    } else {
      notification.info({
        message: "Không có file giải trình do chưa có giá FOB.",
      });
    }

    let fileVats: any[] = [];
    if (id) {
      fileVats = await getVatDocuments({ id });
    }

    setTimeout(async () => {
      const postData = {
        token: storage.getToken(),
        fileBlobs: fileBlobs,
        fileVats: fileVats?.map((v) => v.file_path),
        filePaths: [...data.map((item: any) => item.file_path)],
      };

      await downloadArchiveFiles(postData).catch((err) =>
        notification.error({
          message: "Có lỗi xảy ra! Vui lòng thử lại!",
          description: err.message,
        }),
      );
      setConfirmLoading(false);
    });
  };

  const handleCancel = () => {
    close();
    setFileList([]);
  };

  const uploadFiles = useUploadFiles({
    config: {
      onSuccess: (data) => {
        if (data?.length > 0) {
          fileList.forEach(async (file: any, index) => {
            await createOtherDocument.mutateAsync({
              co_document_id: id,
              file_name: file?.name ? removeVietnameseTones(file.name) : "",
              file_path: data[index] ?? "",
              created_by_user_id: userRecoil.user_id,
              note: "",
            });
          });

          setTimeout(() => {
            setFileList([]);
          }, 500);
        }
      },
    },
  });

  useEffect(() => {
    if (fileList.length > 10) {
      notification.info({
        message: t("message.over_files"),
      });
      setFileList([]);
      return;
    }
    if (fileList.length > 0) {
      const formData = new FormData();
      fileList.forEach((file: any) => {
        formData.append(
          "files",
          file as unknown as Blob,
          removeVietnameseTones(file.name),
        );
      });
      uploadFiles.mutate(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  const uploadProps: UploadProps = {
    beforeUpload: (_, FileList: any) => {
      setFileList([...FileList]);

      return false;
    },
    showUploadList: false,
    maxCount: 5,
    multiple: true,
  };

  return (
    <>
      <Space>
        <FOBPrice isCreate={isCreate} isDone={isDone} />
        <CreateVatInvoice
          title="Import VAT (PDF)"
          isDone={isDone}
          needRefetch
        />
        <ImportDeclaration isDone={isDone} needRefetch />
        <ImportAllDeclarationExcel isDone={isDone} needRefetch />
        <Button
          disabled={isCreate}
          onClick={handleOpen}
          className={
            "bttn-open-tlco button " +
            `${isCreate ? "button_disabled" : "button_other"}`
          }
        >
          Bộ tài liệu C/O
        </Button>
      </Space>

      <Modal
        style={{ top: 110 }}
        okText={"Tải về"}
        width={"80vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        confirmLoading={confirmLoading}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        className={styles.modal}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            Chi tiết bộ tài liệu C/O
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>

        <div className="modal-body">
          <div className={styles.top_ctbtl}>
            <Text
              className={styles.top_ctbtl_title}
              style={{ paddingBottom: "8px" }}
            >
              Danh sách tờ khai xuất khẩu, nhập khẩu, hóa đơn VAT
            </Text>

            <DanhSachAllGiayToTable
              dataCheckDocuments={dataCheckDocuments}
              getChooseFOB={getChooseFOB}
              sanPhams={sanPhams}
            />
          </div>
          <div className={styles.top_ctbtl} style={{ marginBottom: "24px" }}>
            <Row justify={"space-between"} style={{ paddingBottom: "8px" }}>
              <Col>
                <Text className={styles.top_ctbtl_title}>
                  Danh sách giấy tờ khác
                </Text>
              </Col>
              <Col>
                <Upload
                  {...uploadProps}
                  disabled={
                    uploadFiles.isLoading || createOtherDocument.isLoading
                  }
                >
                  <Button
                    loading={
                      uploadFiles.isLoading || createOtherDocument.isLoading
                    }
                    className={"button button_upload"}
                    style={{ width: "auto" }}
                  >
                    Upload file
                  </Button>
                </Upload>
              </Col>
            </Row>
            <DanhSachTkHdTable id={id} />
          </div>
        </div>
      </Modal>
    </>
  );
}
