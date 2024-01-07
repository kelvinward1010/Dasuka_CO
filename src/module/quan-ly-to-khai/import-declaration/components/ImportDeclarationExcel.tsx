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

export function ImportDeclarationExcel(): JSX.Element {
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
        queryClient.invalidateQueries("export-declaration-dropdown");
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
      formData.append("tax_code", customer?.tax_code);
      formData.append("customer_id", customer?.value);
      formData.append(
        "employee_id",
        userRecoil?.user_id || userRecoil?.user_name,
      );
      formData.append(
        "created_by_user_id",
        userRecoil?.user_id || userRecoil?.user_name,
      );

      createImportDeclaration.mutate(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Upload {...uploadProps}>
        <Button
          className={`${styles.button} ${styles.button_success}`}
          type="primary"
          disabled={customer.value === ""}
          loading={createImportDeclaration.isLoading}
        >
          Import TKN (Excel)
        </Button>
      </Upload>
    </>
  );
}
