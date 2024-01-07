import { Button, Upload, UploadProps, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import {
  sanPhamByMaHHState,
  sanPhamState,
} from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { refetchDropdownNorm } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/utils";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";

import styles from "../../style.module.scss";
import { useCreateExportDeclaration } from "../api/createExportDeclaration";

export function ImportDeclaration({
  isDone = false,
  needRefetch = false,
}): JSX.Element {
  const [listFile, setListFile] = useState<any[]>([]);
  const customer = useRecoilValue(customerState);
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const sanPhamByMaHH = useRecoilValue(sanPhamByMaHHState);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);

  const createExportDeclaration = useCreateExportDeclaration({
    config: {
      onSuccess: (data) => {
        data.messages?.forEach((item) => {
          if (item.is_successful) {
            notification.success({
              message: t("message.create_success"),
              description: item.message,
            });
            if (needRefetch)
              refetchDropdownNorm(
                t,
                sanPhams,
                sanPhamByMaHH,
                setLackedMaterial,
                setSanPhams,
              );
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
      formData.append("employee_id", userRecoil.user_id);
      formData.append("tax_code", customer?.tax_code);

      createExportDeclaration.mutate(formData);
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
    accept: ".xml",
  };

  return (
    <>
      <Upload {...uploadProps} disabled={isDone || customer.value === ""}>
        <Button
          className={`${styles.button} ${styles.button_create} ${
            isDone || customer.value === ""
              ? "button button_disabled"
              : "button button_import"
          }`}
          disabled={isDone || customer.value === ""}
          loading={createExportDeclaration.isLoading}
        >
          Import TK (XML)
        </Button>
      </Upload>
    </>
  );
}
