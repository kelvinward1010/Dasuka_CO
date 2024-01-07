import {
  Button,
  Col,
  Row,
  Typography,
  Upload,
  UploadProps,
  notification,
} from "antd";
import { UploadFile } from "antd/lib/upload";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { downloadFile } from "@/apis/downloadFile";
import { uploadFile } from "@/apis/useUploadFile";
import { UploadIcon } from "@/assets/svg";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useVatInvoice } from "../api/getVatInvoice";
import { useUpdateVatInvoice } from "../api/updateVatInvoice";
import { VatInvoice } from "../types";
import styles from "./UploadVatInvoice.module.scss";

interface Props {
  vatInvoice: VatInvoice;
}

interface propsDelete {
  file_name: string;
  file_path: string;
}

export function UploadVatInvoice({ vatInvoice }: Props): JSX.Element {
  const [fileList, setFileList] = useState<UploadFile<Blob>[]>([]);
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  // const uploadFile = useUploadFile({});

  const { data } = useVatInvoice({
    id: vatInvoice.vat_invoice_id,
    serial_number: vatInvoice.serial_number!,
    config: {},
  });

  const updateVatInvoice = useUpdateVatInvoice({
    config: {
      onSuccess: () => {
        setFileList([]);
        queryClient.invalidateQueries(["vat_invoices"]);
        notification.success({
          message: t("message.update_success"),
        });
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const uploadProps: UploadProps = {
    accept: ".pdf",
    multiple: false,
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onChange: async () => {
      let response: any = {};
      // const fileName = removeVietnameseTones(fileList[0]?.name || "");
      if (fileList.length >= 1) {
        const formData = new FormData();
        formData.append("file", fileList[0] as unknown as Blob);
        // uploadFile.mutate(formData);

        response = await uploadFile(formData);
      }
      updateVatInvoice.mutate({
        ...data,
        file_name: fileList[0]?.name || "",
        file_path: response?.path || "",
        invoice_date: dayjs().format("YYYY-MM-DD"),
        lu_user_id: userRecoil.user_id,
      });
    },
    showUploadList: false,
  };

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadIcon />} type="link" />
      </Upload>
    </>
  );
}

export function FormVATuploaded({
  file_name,
  file_path,
}: propsDelete): JSX.Element {
  // const [isShown, setIsShown] = useState(false);

  return (
    <>
      <Row justify={"center"}>
        <Col className={styles.file_down}>
          <Typography.Link onClick={() => downloadFile(file_path, file_name)}>
            {file_name}
          </Typography.Link>
          {/* {isShown && (
            <CloseOutlined
              className={styles.delete_file_pdf}
              onClick={() => fn(id_vat, id_cus, file_path)}
            />
          )} */}
        </Col>
      </Row>
    </>
  );
}
