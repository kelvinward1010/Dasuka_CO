/* eslint-disable eqeqeq */
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

import { ListMessagesModal } from "../../components/ListMessagesModal";
import { IMessage } from "../../import-declaration/types";
import styles from "../../style.module.scss";
import { useCreateDeclarationExcel } from "../api/createDeclarationExcel";

interface Props {
  isDone?: boolean;
  needRefetch?: boolean;
}

export function ImportAllDeclarationExcel({
  isDone = false,
  needRefetch = false,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [listFile, setListFile] = useState<any[]>([]);
  const sanPhamByMaHH = useRecoilValue(sanPhamByMaHHState);
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [listMessages, setListMessages] = useState<IMessage[]>();

  const createDeclarationExcel = useCreateDeclarationExcel({
    config: {
      onSuccess: (data) => {
        if (data) {
          setListMessages(data);
          setShowMessage(true);

          if (needRefetch)
            refetchDropdownNorm(
              t,
              sanPhams,
              sanPhamByMaHH,
              setLackedMaterial,
              setSanPhams,
            );
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

      createDeclarationExcel.mutate(formData);
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
      <Upload
        {...uploadProps}
        disabled={
          isDone || customer.value === "" || createDeclarationExcel.isLoading
        }
      >
        <Button
          className={`${styles.button} ${styles.button_create} ${
            isDone || customer.value === ""
              ? "button button_disabled"
              : "button button_import"
          }`}
          disabled={isDone || customer.value === ""}
          loading={createDeclarationExcel.isLoading}
        >
          Import TK (Excel)
        </Button>
      </Upload>
    </>
  );
}
