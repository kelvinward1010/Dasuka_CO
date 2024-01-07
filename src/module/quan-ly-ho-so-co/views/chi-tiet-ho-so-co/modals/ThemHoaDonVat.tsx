import { nanoid } from "@ant-design/pro-components";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
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

import { uploadFile } from "@/apis/useUploadFile";
import { customerState } from "@/components/AppFilter/index.atom";
import { queryClient } from "@/lib/react-query";
import { useCreateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/api/createVatInvoice";
import { VatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/types";
import { getUserSelector } from "@/store/auth/state";

import styles from "../../../style.module.scss";
import { DanhSachHangHoavatTable } from "../tables/danh-sach-hang-hoa-vat";

interface dataset {
  setModal: any;
  record: any[];
}
export default function ThemHoaDonVat(props: dataset) {
  const [form] = Form.useForm<VatInvoice>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customer = useRecoilValue(customerState);
  const [fileList, setFileList] = useState<UploadFile<Blob>[]>([]);
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);

  const createVatInvoice = useCreateVatInvoice({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["vat_invoices"]);
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

  //const uploadFile = useUploadFile({});

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    createVatInvoice.reset();
    //uploadFile.reset();
    setFileList([]);
  };

  const handleOk = () => {
    form.validateFields().then(async ({ vat_invoice_detail, ...values }) => {
      let response: any = {};
      if (fileList.length >= 1) {
        const formData = new FormData();
        formData.append("file", fileList[0] as unknown as Blob);
        //uploadFile.mutate(formData);
        response = await uploadFile(formData);
      }
      createVatInvoice.mutate({
        ...values,
        file_name: fileList[0]?.name ?? "",
        file_path: response?.path || "",
        status: "Mới",
        invoice_date: dayjs().format("YYYY-MM-DD"),
        customer_id: customer.value,
        created_by_user_id: userRecoil.user_id,
        list_json_vat_invoice_detail: vat_invoice_detail,
      });
      setIsModalOpen(false);
    });
  };

  const uploadProps: UploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    showUploadList: false,
    maxCount: 1,
  };

  const take: any[] = [];
  take.push(props.record);
  const values = {
    key: nanoid(),
    hs_code: "",
    material_id: take[0]?.code_nvl,
    material_name: take[0]?.name_nvl,
    quantity: null,
    unit: take[0]?.dvt,
    unit_price: null,
    tt_usd: null,
  };
  const t2: any[] = [];
  t2.push(values);

  const showModal = () => {
    form.setFieldValue("vat_invoice_detail", t2);
    setIsModalOpen(true);
    props.setModal(false);
  };

  return (
    <>
      <Button onClick={showModal} className={styles.add_btn_vat_modal}>
        Thêm mới VAT
      </Button>
      <Modal
        title="Thêm mới hóa đơn VAT"
        okText={"Lưu"}
        className={"modal_cnt"}
        width={"80vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createVatInvoice.isLoading}
        maskClosable={false}
        destroyOnClose
      >
        <Spin spinning={createVatInvoice.isLoading}>
          <Form form={form} layout="vertical">
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              <Col span={6}>
                <Form.Item
                  label="Số hóa đơn VAT"
                  name="vat_invoice_id"
                  rules={[
                    {
                      required: true,
                      message: "Số hóa đơn VAT không được để trống",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Tên đơn vị mua hàng">
                  <Input disabled value={customer?.value} />
                </Form.Item>
              </Col>
              <Col span={8} />
              <Col span={2}>
                {fileList.length > 0 ? (
                  <Col span={6}>
                    <Form.Item label="File PDF">
                      <Typography.Link>{fileList[0].name}</Typography.Link>
                    </Form.Item>
                  </Col>
                ) : (
                  <Col span={6}>
                    <Upload {...uploadProps}>
                      <Button style={{ background: "#008816", color: "white" }}>
                        Upload PDF
                      </Button>
                    </Upload>
                  </Col>
                )}
              </Col>
            </Row>
            <DanhSachHangHoavatTable />
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
