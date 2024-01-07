import { Button, Upload, UploadProps, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { ListMessagesModal } from "../../components/ListMessagesModal";
import styles from "../../style.module.scss";
import { useCreateImportDeclarationExcel } from "../api/createImportDeclarationExcel";
import { IMessage } from "../types";

export function CreateImportDeclarationExcel(): JSX.Element {
  const [listFile, setListFile] = useState<any[]>([]);
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [listMessages, setListMessages] = useState<IMessage[]>();

  const createImportDeclaration = useCreateImportDeclarationExcel({
    config: {
      onSuccess: (data) => {
        if (data) {
          setListMessages(data);
          setShowMessage(true);
        }
        setListFile([]);
        queryClient.invalidateQueries("import-declarations");
        queryClient.invalidateQueries("export-declarations");
      },
      onError: () => {
        setListFile([]);
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
      formData.append(
        "employee_id",
        userRecoil?.user_id || userRecoil?.user_name,
      );
      formData.append("tax_code", customer?.tax_code);
      formData.append(
        "created_by_user_id",
        userRecoil?.user_id || userRecoil?.user_name,
      );

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
    accept: ".xlsx, .xls",
  };

  return (
    <>
      <ListMessagesModal
        listItems={listMessages || []}
        setList={setListMessages}
        setShowModal={setShowMessage}
        showModal={showMessage}
      />
      <Upload
        {...uploadProps}
        disabled={customer.value === "" || createImportDeclaration.isLoading}
      >
        <Button
          className={`${styles.button} ${
            customer.value === ""
              ? "button button_disabled"
              : "button button_import"
          }`}
          disabled={customer.value === ""}
          loading={createImportDeclaration.isLoading}
        >
          Import Excel
        </Button>
      </Upload>
    </>
  );
}
