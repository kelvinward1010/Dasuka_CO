import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Typography,
  Upload,
  notification,
} from "antd";
import { UploadProps } from "antd/lib/upload";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { CreateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/CreateVatInvoice";
import { ListMessagesModal } from "@/module/quan-ly-to-khai/components/ListMessagesModal";
import { ImportAllDeclarationExcel } from "@/module/quan-ly-to-khai/export-declaration/components/ImportAllDeclarationExcel";
import { useCreateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/api/createImportDeclaration";
import { useCreateImportDeclarationExcel } from "@/module/quan-ly-to-khai/import-declaration/api/createImportDeclarationExcel";
import { IMessage } from "@/module/quan-ly-to-khai/import-declaration/types";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import { decimalUSD4Number } from "@/utils/intl";

import ChiTietToKhaiNhapModal from "../../modals/ChiTietTkNhapModal";
import {
  sanPhamByMaHHState,
  sanPhamSelector,
  sanPhamState,
} from "../state/bigA";
import { refetchDropdownNorm } from "../utils";
import styles from "./ChiTietBoTaiLieu.module.scss";

const { Text } = Typography;

interface dataset {
  status_nvl: string;
  record: any;
}

export function AddTknkAndVatModal(props: dataset) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listFile, setListFile] = useState<any[]>([]);
  //const { isOpen, close, open } = useDisclosure();
  const [open, setOpen] = useState(false);
  const sanPhamByMaHH = useRecoilValue(sanPhamByMaHHState);
  const customer = useRecoilValue(customerState);
  const userRecoil = useRecoilValue(getUserSelector);
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const [isUploadExcel, setIsUploadExcel] = useState(false);
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [listMessages, setListMessages] = useState<IMessage[]>();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Newest version
  const createImportDeclaration = useCreateImportDeclaration({
    config: {
      onSuccess: (data) => {
        data.messages.forEach((item) => {
          if (item.is_successful) {
            notification.success({
              message: t("message.create_success"),
              description: item.message,
            });

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

  // Excel
  const createImportDeclarationExcel = useCreateImportDeclarationExcel({
    config: {
      onSuccess: (data) => {
        if (data) {
          setListMessages(data);
          setShowMessage(true);
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

      if (isUploadExcel) createImportDeclarationExcel.mutate(formData);
      else createImportDeclaration.mutate(formData);
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

  const calculateLossMaterial = (record: any) => {
    let total = 0;
    if (!record?.norm_vat_invoice_import_declaration) {
      total = sanPham?.sl_done_co * record?.dmkchh;
    } else {
      const sumDone = _.sumBy(
        record?.norm_vat_invoice_import_declaration,
        "co_doned",
      );
      const sumLoss =
        record?.norm_vat_invoice_import_declaration?.[0]?.norm_value_loss;

      total = Math.abs(sumLoss - sumDone);
    }

    return total; // need - actual
  };

  return (
    <>
      <ListMessagesModal
        listItems={listMessages || []}
        setList={setListMessages}
        setShowModal={setShowMessage}
        showModal={showMessage}
      />
      {props?.status_nvl?.toLowerCase() === t("for_all.lack").toLowerCase() ||
      props?.status_nvl?.toLowerCase() === t("for_all.over").toLowerCase() ||
      props?.record?.norm_vat_invoice_import_declaration?.find(
        (i: any) => i.check_import_date === 0,
      ) ? (
        props?.record?.norm_vat_invoice_import_declaration?.find(
          (i: any) => i.check_import_date === 0,
        ) ? (
          <Typography.Link
            strong
            className={styles.style_click}
            onClick={showModal}
            type={"danger"}
          >
            {t("for_all.date_enough")}
          </Typography.Link>
        ) : (
          <Typography.Link
            strong
            className={styles.style_click}
            onClick={showModal}
            type={"danger"}
          >
            {props.status_nvl} (
            {decimalUSD4Number.format(
              calculateLossMaterial(props?.record) || 0,
            )}
            )
          </Typography.Link>
        )
      ) : (
        <Text className={styles.style_click} type={"success"} disabled>
          {props.status_nvl}
        </Text>
      )}
      <Modal
        style={{ top: 110 }}
        okText={"Ok"}
        className={styles.modal}
        closable={false}
        width={"40vw"}
        bodyStyle={{
          padding: "0px !important",
        }}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {props?.status_nvl?.toLowerCase() ===
              t("for_all.lack").toLowerCase() ||
            props?.record?.norm_vat_invoice_import_declaration?.find(
              (i: any) => i.check_import_date === 0,
            )
              ? t("quan_ly_hs_co.detail.lack_materials")
              : t("quan_ly_hs_co.detail.over_materials")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            />
          </Col>
        </Row>
        <div className="modal-body">
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            style={{
              minHeight: 150,
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props?.status_nvl?.toLowerCase() ===
              t("for_all.lack").toLowerCase() ||
            props?.record?.norm_vat_invoice_import_declaration?.find(
              (i: any) => i.check_import_date === 0,
            ) ? (
              <>
                <Text strong>
                  {t("quan_ly_hs_co.detail.lack_materials_content_line1")}
                </Text>
                <Text strong>
                  {t("quan_ly_hs_co.detail.lack_materials_content_line2")}
                </Text>

                <br />
                <Row wrap={false} justify={"center"} gutter={16}>
                  <Col span={7}>
                    <Upload {...uploadProps}>
                      <Button
                        className="button button_import"
                        disabled={customer.value === ""}
                        loading={createImportDeclaration.isLoading}
                        onClick={() => setIsUploadExcel(false)}
                      >
                        Import TK (XML)
                      </Button>
                    </Upload>
                  </Col>
                  <Col span={7}>
                    <ImportAllDeclarationExcel />
                  </Col>
                  <Col>
                    <CreateVatInvoice title="Thêm mới VAT" />
                    {/* <ThemHoaDonVat record={props?.record} setModal={handleCancel} /> */}
                  </Col>
                  <Col>
                    <Button
                      onClick={handleCancel}
                      className="button button_default"
                    >
                      {t("for_all.button_cancel")}
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <Text style={{ fontSize: 16 }} strong>
                {t("quan_ly_hs_co.detail.over_materials_content")}
              </Text>
            )}
          </Form>
        </div>
      </Modal>
      {open === true && (
        <ChiTietToKhaiNhapModal open={open} setOpen={setOpen} />
      )}
    </>
  );
}
