import { Button, Upload, UploadProps, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import styles from "../../style.module.scss";
import { useCreateImportDeclaration } from "../api/createImportDeclaration";

export function CreateImportDeclaration(): JSX.Element {
  const [listFile, setListFile] = useState<any[]>([]);
  const customer = useRecoilValue(customerState);
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const createImportDeclaration = useCreateImportDeclaration({
    config: {
      onSuccess: (data) => {
        data.messages.forEach((item) => {
          if (item.is_successful) {
            notification.success({
              message: t("message.create_success"),
              description: item.message,
            });
          } else {
            notification.error({
              message: t("message.create_failure"),
              description: item.message,
            });
          }
        });
        setListFile([]);
        queryClient.invalidateQueries("import-declarations");
        queryClient.invalidateQueries("export-declarations");
      },
      onError: (err) => {
        setListFile([]);
        notification.error({
          message: t("message.create_failure"),
          description: err.message,
        });
      },
    },
  });

  useEffect(() => {
    if (listFile.length > 10) {
      notification.info({
        message: t("message.over_files"),
      });
      setListFile([]);
      return;
    }
    if (listFile.length > 0) {
      const formData = new FormData();
      listFile.forEach((file) => {
        formData.append("files", file as unknown as Blob);
      });
      formData.append("customer_id", customer?.value);
      formData.append("employee_id", userRecoil.user_id);
      formData.append("tax_code", customer?.tax_code);

      createImportDeclaration.mutate(formData);
    }
  }, [listFile]);

  const uploadProps: UploadProps = {
    beforeUpload: (_, ListFile) => {
      setListFile([...listFile, ...ListFile]);

      return false;
    },
    showUploadList: false,
    maxCount: 5,
    multiple: true,
    disabled: customer.value === "",
    accept: ".xml",
  };

  return (
    <>
      <Upload {...uploadProps}>
        <Button
          className={`${styles.button} ${
            customer.value === ""
              ? "button button_disabled"
              : "button button_import"
          }`}
          disabled={customer.value === ""}
          loading={createImportDeclaration.isLoading}
        >
          Import XML
        </Button>
      </Upload>
    </>
  );
}
