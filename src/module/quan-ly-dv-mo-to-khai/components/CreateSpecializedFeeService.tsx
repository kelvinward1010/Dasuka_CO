import { PlusCircleOutlined } from "@ant-design/icons";
import { Form, Modal, Spin, Typography, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { getUserSelector } from "@/store/auth/state";

import { useDeclarationReport } from "../api/getDeclarationReport";
import { useUpdateOpenDeclarationReport } from "../api/updateOpenDeclarationReport";
import { OpenDeclarationReport } from "../types";
import { getArrayFees } from "../utils/array";
import { FormSpecializedFeeService } from "./FormSpecializedFeeService";

interface Props {
  openDeclarationReport: OpenDeclarationReport;
}

export function CreateSpecializedFeeService({
  openDeclarationReport,
}: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const userRecoil = useRecoilValue(getUserSelector);

  const { t } = useTranslation();

  const { data } = useDeclarationReport({
    id: openDeclarationReport?.report_id,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  });

  const updateOpenDeclarationReport = useUpdateOpenDeclarationReport({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["open-declaration-reports"]);
        close();
        form.resetFields();
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    setFieldsValue(openDeclarationReport);
    open();
  };

  const setFieldsValue = (data: OpenDeclarationReport) => {
    form.setFieldsValue(data);
  };

  const handleCancel = () => {
    close();
  };

  const handleOk = () => {
    form.validateFields().then(({ fees, ...values }) => {
      fees.forEach((f: any) => {
        f.fee_type = f.fee_type === "PS" ? f.fee_type : "CN";
      });
      updateOpenDeclarationReport.mutate({
        ...values,
        ...data,
        open_declaration_report_id: data?.report_id,
        lu_user_id: userRecoil.user_id,
        fees: JSON.stringify(getArrayFees(data!.fees ?? [], fees ?? [], "CN")),
      });
    });
  };

  return (
    <>
      <Typography.Link onClick={handleOpen}>
        <PlusCircleOutlined style={{ fontSize: "20px", color: "#008816" }} />
      </Typography.Link>

      <Modal
        title={t("quan_ly_dv_mo_tk.detail.title_main")}
        open={isOpen}
        width={"80%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={updateOpenDeclarationReport.isLoading}
        className={"modal_cnt"}
        maskClosable={false}
        okText={t("quan_ly_dv_mo_tk.detail.button_submit")}
        cancelText={t("quan_ly_dv_mo_tk.detail.button_cancel")}
      >
        <Spin spinning={updateOpenDeclarationReport.isLoading}>
          <Form layout="vertical" form={form}>
            <FormSpecializedFeeService
              openDeclarationReport={openDeclarationReport}
              setFieldsValue={setFieldsValue}
            />
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
