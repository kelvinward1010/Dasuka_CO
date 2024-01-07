import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
  notification,
} from "antd";
import { OptionProps } from "antd/es/select";
import { UploadProps } from "antd/lib/upload";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { removeVietnameseTones, useUploadFile } from "@/apis/useUploadFile";
import { customerState, staffState } from "@/components/AppFilter/index.atom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { useQLNDLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung/api/getQlND";
import {
  sanPhamByMaHHState,
  sanPhamState,
} from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/state/bigA";
import { refetchDropdownNorm } from "@/module/quan-ly-ho-so-co/views/chi-tiet-ho-so-co/utils";
import { dataLackedMaterialState } from "@/store/action/atom";
import { getUserSelector } from "@/store/auth/state";
import { formatNumber } from "@/utils/format";

import { useCreateVatInvoice } from "../api/createVatInvoice";
import { useVatInvoice } from "../api/getVatInvoice";
import { checkVatExists } from "../api/getVatInvoices copy";
import { useImportVATInvoiceV2 } from "../api/importVatInvoiceV2";
import { useImportVatInvoiceXML } from "../api/importVatInvoiceXML";
import { useUpdateVatInvoice } from "../api/updateVatInvoice";
import styles from "../style.module.scss";
import { ListMaterialVatTable } from "./ListMaterialVatTable";

const getNameFile = (path: string) => {
  return path?.split("/")?.[path?.split("/")?.length - 1] || "";
};

const getNameFileXML = (path: string) => {
  return path?.split("/")?.[path?.split("/")?.length - 1] || "";
};

export function CreateVatInvoice({
  title,
  isDone = false,
  needRefetch = false,
}: {
  title?: string;
  isDone?: boolean;
  needRefetch?: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const customer = useRecoilValue(customerState);
  const staff = useRecoilValue(staffState);
  const userRecoil = useRecoilValue(getUserSelector);
  const [listFiles, setListFiles] = useState<Blob[]>([]);
  const [listXMLFiles, setListXMLFiles] = useState<Blob[]>([]);
  const [selectedVat, setSelectedVat] = useState<string | undefined>();
  const [vatOptions, setVatOptions] = useState<OptionProps[]>([]);
  const [dateExport, setDateExport] = useState<Dayjs | null>(dayjs());
  const [dateX, setDateX] = useState<Dayjs | null>();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [seller, setSeller] = useState<any>();
  const usdExchangeRate = Form.useWatch("usd_exchange_rate", form);
  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [isXML, setIsXML] = useState<boolean>(false);
  const sanPhamByMaHH = useRecoilValue(sanPhamByMaHHState);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  const setLackedMaterial = useSetRecoilState(dataLackedMaterialState);
  const [modal, contextHolder] = Modal.useModal();

  const [dataVATs, setDataVATs] = useState<any[]>();

  const { isOpen, close, open } = useDisclosure();

  // Get staff
  const getStaffLazy = useQLNDLazy({});

  // Import files vat invoice
  const importVatInvoice = useImportVATInvoiceV2({
    config: {
      onSuccess: async (data) => {
        if (data?.length > 0) {
          const staffWithCustomers = await getStaffLazy.mutateAsync({
            id: staff.value,
          });

          const listCustomers = staffWithCustomers.employee_customer;
          if (listCustomers) {
            const listSuccess: any[] = [];
            const listFailure: any[] = [];
            const listNameFileFailure: string[] = [];

            // Filter success and failure vat invoices
            data.forEach((item) => {
              const index = listCustomers.findIndex(
                (customer) => customer.tax_code === item.tax_code,
              );
              const isCustomer = item.tax_code === customer.tax_code;
              if (index >= 0 && isCustomer) {
                listSuccess.push(item);
              } else {
                // type = 1: Wrong files
                // type = 2: Wrong customer
                if (isCustomer) {
                  listFailure.push({ ...item, type: 1 });
                  listNameFileFailure.push(getNameFile(item?.file_name || ""));
                } else listFailure.push({ ...item, type: 2 });
              }
            });

            // Remove files that they be failed
            listNameFileFailure.forEach((i) => {
              const index = listFiles.findIndex((item) => item.name === i);
              listFiles.splice(index, 1);
            });

            // Check all vat invoices that they be existed
            if (listSuccess.length > 0) {
              const listCheckVats = await checkVatExists({
                params: {
                  vat_invoice_ids: listSuccess.map((item) => ({
                    vat_invoice_id: item.vat_invoice_id,
                    serial_number: item.serial_number,
                  })),
                },
              });

              // Find all vat invoices be existed
              const listExists: string[] = [];
              listCheckVats.forEach((item) => {
                if (item.is_exists) listExists.push(item.vat_invoice_id);
              });

              if (listExists.length > 0) {
                notification.error({
                  message: `Hóa đơn: ${listExists.join(
                    ", ",
                  )} đã có trong hệ thống!`,
                });
              }

              // Initialized data
              setVatOptions(
                listSuccess.map((vat) => ({
                  label:
                    vat.vat_invoice_id +
                    (listExists.includes(vat.vat_invoice_id) ? " - Đã có" : ""),
                  value: vat.vat_invoice_id,
                  children: [],
                })),
              );
              if (listSuccess?.[0]) {
                setDataVATs(
                  listSuccess.map((item) => ({ ...item, isSaved: false })),
                );

                setSelectedVat(listSuccess[0].vat_invoice_id);
                setSeller({
                  vendor_name: listSuccess[0].vendor_name,
                  vendor_tax_code: listSuccess[0].vendor_tax_code,
                });
                setDateExport(dayjs(listSuccess[0].invoice_date || ""));
                form.setFieldsValue(listSuccess[0]);
                setSelectedFile(getNameFile(listSuccess[0]?.file_name));
                setSeller({
                  vendor_name: listSuccess[0].vendor_name,
                  vendor_tax_code: listSuccess[0].vendor_tax_code,
                });
              }
            }
            if (listFailure.length > 0) {
              const dataMap = [
                ...new Map(
                  listFailure.map((item) => [item["tax_code"], item]),
                ).values(),
              ];
              dataMap.forEach((failure) => {
                if (failure.type === 1)
                  notification.warning({
                    message: "Cảnh báo",
                    description: `Không thể import dữ liệu từ file ${
                      failure.file_name.split("\\")?.[
                        failure.file_name.split("\\")?.length - 1
                      ]
                    } do ${failure.customer_name} chưa được phân quyền cho bạn`,
                  });
                else
                  notification.warning({
                    message: "Cảnh báo",
                    description: `Hãy chọn đúng khách hàng ${
                      failure.customer_name
                    } để làm việc, file: ${
                      failure.file_name.split("\\")?.[
                        failure.file_name.split("\\")?.length - 1
                      ]
                    }`,
                  });
              });
            }
          }
        } else {
          notification.info({
            message:
              "Hóa đơn không có thông tin hoặc thông tin không chính xác",
          });
          resetState();
        }
        if (data["results" as keyof typeof data] !== undefined) {
          notification.error({
            message: String(data["message" as keyof typeof data]),
          });
          resetState();
        }
      },
      onError: (err) => {
        notification.error({
          message: err.message,
        });
        resetState();
      },
    },
  });

  // Import files vat invoice by xml files
  const importVatInvoiceXML = useImportVatInvoiceXML({
    config: {
      onSuccess: async (data) => {
        if (data?.length > 0) {
          const staffWithCustomers = await getStaffLazy.mutateAsync({
            id: staff.value,
          });

          const listCustomers = staffWithCustomers.employee_customer;
          if (listCustomers) {
            const listSuccess: any[] = [];
            const listFailure: any[] = [];
            const listNameFileFailure: string[] = [];

            // Filter success and failure vat invoices
            data.forEach((item) => {
              const index = listCustomers.findIndex(
                (customer) => customer.tax_code === item.tax_code,
              );
              const isCustomer = item.tax_code === customer.tax_code;
              if (index >= 0 && isCustomer) {
                listSuccess.push(item);
              } else {
                // type = 1: Wrong files
                // type = 2: Wrong customer
                if (isCustomer) {
                  listFailure.push({ ...item, type: 1 });
                  listNameFileFailure.push(
                    getNameFileXML(item?.file_name || ""),
                  );
                } else listFailure.push({ ...item, type: 2 });
              }
            });

            // Remove files that they be failed
            listNameFileFailure.forEach((i) => {
              const index = listFiles.findIndex((item) => item.name === i);
              listFiles.splice(index, 1);
            });

            // Check all vat invoices that they be existed
            if (listSuccess.length > 0) {
              const listCheckVats = await checkVatExists({
                params: {
                  vat_invoice_ids: listSuccess.map((item) => ({
                    vat_invoice_id: item.vat_invoice_id,
                    serial_number: item.serial_number,
                  })),
                },
              });

              // Find all vat invoices be existed
              const listExists: string[] = [];
              listCheckVats.forEach((item) => {
                if (item.is_exists) listExists.push(item.vat_invoice_id);
              });

              if (listExists.length > 0) {
                notification.error({
                  message: `Hóa đơn: ${listExists.join(
                    ", ",
                  )} đã có trong hệ thống!`,
                });
              }

              // Initialized data
              setVatOptions(
                listSuccess.map((vat) => ({
                  label:
                    vat.vat_invoice_id +
                    (listExists.includes(vat.vat_invoice_id) ? " - Đã có" : ""),
                  value: vat.vat_invoice_id,
                  children: [],
                })),
              );
              if (listSuccess?.[0]) {
                setDataVATs(
                  listSuccess.map((item) => ({ ...item, isSaved: false })),
                );

                setSelectedVat(listSuccess[0].vat_invoice_id);
                setSeller({
                  vendor_name: listSuccess[0].vendor_name,
                  vendor_tax_code: listSuccess[0].vendor_tax_code,
                });
                setDateExport(dayjs(listSuccess[0].invoice_date || ""));
                form.setFieldsValue(listSuccess[0]);
                setSelectedFile(getNameFileXML(listSuccess[0]?.file_name));
                setSeller({
                  vendor_name: listSuccess[0].vendor_name,
                  vendor_tax_code: listSuccess[0].vendor_tax_code,
                });
              }
            }
            if (listFailure.length > 0) {
              const dataMap = [
                ...new Map(
                  listFailure.map((item) => [item["tax_code"], item]),
                ).values(),
              ];
              dataMap.forEach((failure) => {
                if (failure.type === 1)
                  notification.warning({
                    message: "Cảnh báo",
                    description: `Không thể import dữ liệu từ file ${
                      failure.file_name.split("\\")?.[
                        failure.file_name.split("\\")?.length - 1
                      ]
                    } do ${failure.customer_name} chưa được phân quyền cho bạn`,
                  });
                else
                  notification.warning({
                    message: "Cảnh báo",
                    description: `Hãy chọn đúng khách hàng ${
                      failure.customer_name
                    } để làm việc, file: ${
                      failure.file_name.split("\\")?.[
                        failure.file_name.split("\\")?.length - 1
                      ]
                    }`,
                  });
              });
            }
          }
        } else {
          notification.info({
            message:
              "Hóa đơn không có thông tin hoặc thông tin không chính xác",
          });
          resetState();
        }
        if (data["results" as keyof typeof data] !== undefined) {
          notification.error({
            message: String(data["message" as keyof typeof data]),
          });
          resetState();
        }
      },
      onError: (err) => {
        notification.error({
          message: err.message,
        });
        resetState();
      },
    },
  });

  // Create vat invoice
  const createVatInvoice = useCreateVatInvoice({
    config: {
      onSuccess: (data, variables) => {
        if (data.results) {
          notification.success({
            message: data.message,
          });

          setDataVATs((prev) => {
            if (prev) {
              const index = prev.findIndex(
                (i) => i.vat_invoice_id === variables.vat_invoice_id,
              );

              if (index > -1) prev[index].isSaved = true;
            }

            return prev;
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
            message: data.message,
          });
        }
        queryClient.invalidateQueries(["vat_invoices"]);
      },
      onError: (data) => {
        notification.error({
          message: data.message,
        });
      },
    },
  });

  // Update vat invoice
  const updateVatInvoice = useUpdateVatInvoice({
    config: {
      onSuccess: (data, variables) => {
        if (data.results) {
          notification.success({
            message: data.message,
          });
          setDataVATs((prev) => {
            if (prev) {
              const index = prev.findIndex(
                (i) => i.vat_invoice_id === variables.vat_invoice_id,
              );

              if (index > -1) prev[index].isSaved = true;
            }

            return prev;
          });
          queryClient.invalidateQueries(["vat_invoices"]);
          if (needRefetch)
            refetchDropdownNorm(
              t,
              sanPhams,
              sanPhamByMaHH,
              setLackedMaterial,
              setSanPhams,
            );
        } else
          notification.error({
            message: data.message,
          });
      },
      onError: (err) => {
        notification.error({
          message: err.message,
        });
      },
    },
  });

  // Get vat by vat_invoice_id to check if it's existed
  const { data: dataVat } = useVatInvoice({
    id: selectedVat!,
    serial_number: form.getFieldValue("serial_number")!,
    config: {
      enabled: isOpen,
      onSuccess: (data) => {
        if (!data?.["message" as keyof typeof data]) {
          const currentVat = dataVATs?.find(
            (i) => i.vat_invoice_id === selectedVat,
          );
          form.setFieldsValue({
            ...currentVat,
            ...data,
            serial_number: data.serial_number || currentVat.serial_number,
            usd_exchange_rate: currentVat?.usd_exchange_rate
              ? currentVat.usd_exchange_rate
              : data?.usd_exchange_rate,
          });
          setSelectedVat(data.vat_invoice_id);
          setDateExport(dayjs(data.invoice_date));
          setDateX(
            currentVat?.date ? dayjs(currentVat.date) : dayjs(data.date),
          );
          setIsCreate(false);
        } else setIsCreate(true);
      },
    },
  });

  // Upload file before create VAT
  const uploadFile = useUploadFile({
    config: {
      onSuccess: (data) => {
        if (data.result) {
          // When upload file is successful, create vat invoice
          const dataPost = {
            vat_invoice_id: selectedVat?.trim(),
            serial_number: form.getFieldValue("serial_number"),
            customer_id: customer.value?.trim(),
            tax_code: customer.tax_code?.trim(),
            file_name: (selectedFile?.split(".")?.[0] + ".pdf")?.trim() || "",
            file_path: data?.path?.trim() || "",
            date: dateX?.isValid() ? dayjs(dateX).format("YYYY-MM-DD") : null,
            x_annex_code: form.getFieldValue("x_annex_code"),
            invoice_date: dateExport?.isValid()
              ? dayjs(dateExport).format("YYYY-MM-DD")
              : null,
            vender_tax_code: seller.taxCode?.trim(),
            vender_name: seller.companyName?.trim(),
            usd_exchange_rate: form.getFieldValue("usd_exchange_rate") || null,
            created_by_user_id: userRecoil.user_id,
            vat_license_number: form.getFieldValue("vat_license_number"),
            list_json_vat_invoice_detail: form
              .getFieldValue("vat_invoice_detail")
              .map((item: any, index: number) => ({
                ...item,
                unit_price: item.unit_price || 0,
                material_code: item.material_code?.trim(),
                material_name: item.material_name?.trim(),
                material_id: item.material_id?.trim(),
                sort_order: item.sort_order || index + 1,
              })),
          };

          createVatInvoice.mutate(dataPost);
        } else {
          notification.error({
            message: data.message,
          });
        }
      },
      onError: (err) => {
        notification.error({
          message: err.response?.data?.message,
        });
      },
    },
  });

  // Get name file from path when change vat dropdown
  useEffect(() => {
    if (selectedVat) {
      setSelectedFile(() => {
        const vat = (
          isXML ? importVatInvoiceXML : importVatInvoice
        )?.data?.find((v) => v.vat_invoice_id === selectedVat);

        return isXML
          ? getNameFileXML(vat?.file_name || "")
          : getNameFile(vat?.file_name || "");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVat]);

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    const listNotSaved = dataVATs
      ?.filter((i) => !i.isSaved)
      ?.map((i) => i.vat_invoice_id);

    if (listNotSaved && listNotSaved.length > 0) {
      modal.confirm({
        title: `Bạn còn hóa đơn chưa lưu: ${listNotSaved.join(
          ", ",
        )}. Bạn có muốn thoát không?`,
        onOk() {
          resetState();
          close();
        },
        okText: t("for_all.button_delete_ok"),
        cancelText: t("for_all.button_delete_no"),
      });
    } else {
      resetState();
      close();
    }
  };

  // Reset state when close or has error
  const resetState = () => {
    form.resetFields();
    setSelectedVat(undefined);
    setListFiles([]);
    setListXMLFiles([]);
    setVatOptions([]);
    setSeller(null);
    setDateExport(dayjs());
    setSelectedFile("");
    setDateX(null);
    setDataVATs([]);
  };

  // Handle click "Save" button
  const handleOk = () => {
    // Check validation
    form
      .validateFields()
      .then(async (values) => {
        if (isCreate) {
          const file = listFiles?.find((file) =>
            removeVietnameseTones(selectedFile)
              ?.split(".")?.[0]
              .includes(removeVietnameseTones(file.name)?.split(".")?.[0]),
          );
          if (!file) {
            notification.error({
              message:
                "Không tìm thấy file: " + selectedFile?.split(".")[0] + ".pdf",
            });

            return;
          }
          const formData = new FormData();
          formData.append("file", file, removeVietnameseTones(file.name));
          formData.append("type", "vat");

          // Upload the file before create vat invoice
          uploadFile.mutate(formData);
        } else {
          const dataPost = {
            ...dataVat,
            ...values,
            invoice_date: dateExport?.isValid()
              ? dayjs(dateExport).format("YYYY-MM-DD")
              : null,
            usd_exchange_rate: form.getFieldValue("usd_exchange_rate") || null,
            lu_user_id: userRecoil.user_id,
            date: dateX?.isValid() ? dayjs(dateX).format("YYYY-MM-DD") : null,
            x_annex_code: form.getFieldValue("x_annex_code"),
            vat_license_number: form.getFieldValue("vat_license_number"),
            list_json_vat_invoice_detail: form
              .getFieldValue("vat_invoice_detail")
              .map((item: any, index: number) => ({
                ...item,
                material_code: item.material_code?.trim(),
                material_name: item.material_name?.trim(),
                material_id: "",
                sort_order: item.sort_order || index + 1,
              })),
          };

          updateVatInvoice.mutate(dataPost);
        }
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  // Only upload files when list files changed, avoid upload multiple times
  useEffect(() => {
    if (listFiles.length > 20) {
      notification.info({
        message: "Bạn chỉ có thể upload tối đa 20 files",
      });
      setListFiles([]);
      return;
    }

    if (listFiles.find((file) => file.type === "text/xml")) {
      setListFiles((prev) => prev.filter((file) => file.type !== "text/xml"));
      setListXMLFiles(listFiles.filter((file) => file.type === "text/xml"));
    } else if (isXML && listFiles.length !== listXMLFiles.length) {
      notification.warning({
        message: "Bạn cần import đồng thời cả XML và PDF",
      });
      setListFiles([]);
      setListXMLFiles([]);
      return;
    } else if (listFiles.length > 0) {
      const formData = new FormData();
      (isXML ? listXMLFiles : listFiles).forEach((file) => {
        formData.append(
          "files",
          file as unknown as Blob,
          removeVietnameseTones(file?.name),
        );
      });

      isXML
        ? importVatInvoiceXML.mutate(formData)
        : importVatInvoice.mutate(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFiles]);

  // Properties of upload button
  const uploadProps: UploadProps = {
    beforeUpload: (_, ListFile) => {
      setListFiles([...ListFile]);

      return false;
    },
    showUploadList: false,
    maxCount: 5,
    multiple: true,
  };

  // Handle select vat invoice
  const handleSelectVatInvoice = (value: string) => {
    const prevDataVats = _.clone(dataVATs);
    setDataVATs((prev) => {
      if (prev) {
        const index = prev.findIndex((i) => i.vat_invoice_id === selectedVat);

        if (index > -1)
          prev[index] = {
            ...form.getFieldsValue(),
            usd_exchange_rate: usdExchangeRate,
            vat_invoice_id: selectedVat,
            invoice_date: dateExport?.isValid()
              ? dayjs(dateExport).format("YYYY-MM-DD")
              : null,
            isSaved: prev[index]?.isSaved ?? false,
            date: dateX?.isValid()
              ? dateX.format("YYYY-MM-DD")
              : prev[index].date,
          };
      }

      return prev;
    });

    setSelectedVat(value);
    const importVat = prevDataVats?.find((vat) => vat.vat_invoice_id === value);
    setSeller({
      vendor_name: importVat?.vendor_name,
      vendor_tax_code: importVat?.vendor_tax_code,
    });
    setDateExport(dayjs(importVat?.invoice_date || ""));
    setDateX(importVat.date ? dayjs(importVat.date) : null);
    form.setFieldsValue(importVat);
  };

  const groupButtonImport = () => {
    return (
      <>
        <Upload
          disabled={importVatInvoiceXML.isLoading}
          {...uploadProps}
          accept=".xml, .pdf"
        >
          <Button
            className="button button_import"
            type="primary"
            loading={importVatInvoiceXML.isLoading}
            onClick={() => setIsXML(true)}
          >
            Import XML
          </Button>
        </Upload>
        <Upload
          disabled={importVatInvoice.isLoading}
          {...uploadProps}
          accept=".pdf"
        >
          <Button
            className="button button_import"
            type="primary"
            loading={importVatInvoice.isLoading}
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => setIsXML(false)}
          >
            Import PDF
          </Button>
        </Upload>
      </>
    );
  };

  return (
    <>
      <Button
        className={`${!title && styles.button} ${styles.button_create} button ${
          (!customer.value || isDone || !staff.value) && "button_disabled"
        }`}
        type="primary"
        onClick={handleOpen}
        disabled={customer.value === "" || isDone || !staff.value}
      >
        {title ? title : t("for_all.button_create")}
      </Button>
      <Modal
        style={{
          top: 110,
        }}
        open={isOpen}
        width={"100%"}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={
          uploadFile.isLoading ||
          createVatInvoice.isLoading ||
          updateVatInvoice.isLoading
        }
        closable={false}
        destroyOnClose
        className={styles.modal}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        maskClosable={false}
        cancelText={t("for_all.button_cancel")}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {isCreate
              ? t("quan_ly_vat.create.title")
              : t("quan_ly_vat.update.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical">
            <Row gutter={32} justify={"space-between"} align={"bottom"}>
              <Col span={isCreate ? 4 : 3}>
                <div className="ant-col ant-form-item-label">
                  <Typography.Text className={styles.label_required} strong>
                    {t("quan_ly_vat.create.vat_number")}
                  </Typography.Text>
                </div>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  loading={importVatInvoice.isLoading}
                  options={vatOptions}
                  value={selectedVat}
                  onSelect={handleSelectVatInvoice}
                  placeholder={t("quan_ly_vat.create.vat_number") || ""}
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Col>
              <Col span={isCreate ? 4 : 3}>
                <Form.Item
                  name={"serial_number"}
                  label={"Số ký hiệu"}
                  style={{ marginBottom: 0 }}
                  rules={[...RULES_FORM.required]}
                >
                  <Input placeholder="Số ký hiệu" disabled />
                </Form.Item>
              </Col>
              {!isCreate && (
                <Col span={isCreate ? 4 : 3}>
                  <Form.Item
                    name={"usd_exchange_rate"}
                    label={t("quan_ly_vat.create.exchange_rate")}
                    rules={[...RULES_FORM.required]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder={t("quan_ly_vat.create.exchange_rate") || ""}
                      formatter={formatNumber}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={isCreate ? 4 : 3}>
                <Form.Item
                  // name={"date"}
                  label={t("quan_ly_vat.create.date_export")}
                  rules={[...RULES_FORM.required]}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    allowClear={false}
                    style={{ width: "100%" }}
                    placeholder={t("quan_ly_vat.create.date_export") || ""}
                    format={"DD-MM-YYYY"}
                    defaultValue={dayjs()}
                    value={dateExport}
                    onChange={(value) => setDateExport(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={isCreate ? 4 : 3} style={{ textAlign: "right" }}>
                <Form.Item
                  name={"vat_license_number"}
                  label={"Số HDGC"}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Số HDGC" />
                </Form.Item>
              </Col>
              <Col span={isCreate ? 4 : 3} style={{ textAlign: "right" }}>
                <Form.Item
                  name={"x_annex_code"}
                  label={t("quan_ly_vat.create.x_annex_code")}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder={t("quan_ly_vat.create.x_annex_code") || ""}
                  />
                </Form.Item>
              </Col>
              <Col span={isCreate ? 4 : 3} style={{ textAlign: "right" }}>
                <Form.Item
                  // name={"date"}
                  label={t("quan_ly_vat.create.date_x")}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder={t("quan_ly_vat.create.date_x") || ""}
                    format={"DD-MM-YYYY"}
                    // defaultValue={dayjs()}
                    value={dateX?.isValid() ? dateX : undefined}
                    onChange={(value) => setDateX(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <ListMaterialVatTable
              dataVat={dataVat}
              groupButtonImport={groupButtonImport}
              usdExchangeRate={usdExchangeRate}
              form={form}
              selectedVat={selectedVat}
            />
          </Form>
        </div>
      </Modal>

      {contextHolder}
    </>
  );
}
