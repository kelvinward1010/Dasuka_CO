import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { queryClient } from "@/lib/react-query";
import { RULES_FORM } from "@/module/authorization/utils/validator";
import { getUserSelector } from "@/store/auth/state";

import { useCreatePSR } from "../api/createPSR";
import { usePSR } from "../api/getPSR";
import { useUpdatePSR } from "../api/updatePSR";
import styles from "../style.module.scss";
import ImportPSR from "./ImportPSR";

interface Props {
  isCreate: boolean;
  id?: string;
}

export function UpdateModalPSR({ isCreate = true, id }: Props): JSX.Element {
  const [form] = Form.useForm();
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const userRecoil = useRecoilValue(getUserSelector);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [originData, setOriginData] = useState<any[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);

  useEffect(() => {
    if (originData) {
      setCurrentData(
        _.clone(originData).slice(page * pageSize - pageSize, page * pageSize),
      );
    }
  }, [originData, page, pageSize]);

  usePSR({
    params: {
      co_form_id: id,
      user_id: userRecoil.user_id,
    },
    enabled: !!id && !isCreate && isOpen,
    config: {
      onSuccess(data) {
        if (data.success) {
          form.setFieldsValue(data.data);
          setOriginData(data.data.details);
        }
      },
    },
  });

  const createPSR = useCreatePSR({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.create_success"),
        });
        queryClient.invalidateQueries(["PSRs"]);
        handleCancel();
      },
      onError: (err) => {
        notification.error({
          message: t("message.create_failure"),
          description: err.message,
        });
      },
    },
  });

  const updatePSR = useUpdatePSR({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.update_success"),
        });
        queryClient.invalidateQueries(["PSRs"]);
        handleCancel();
      },
      onError: (err) => {
        notification.error({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleOpen = () => {
    open();
  };

  const handleCancel = () => {
    close();
    form.resetFields();
    setOriginData([]);
    setCurrentData([]);
    setPage(1);
    setPageSize(10);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ ...values }) => {
        const dataPost = {
          ...values,
          co_form_id: isCreate
            ? "Form " + values.co_form_id.toUpperCase()
            : values.co_form_id,
          user_id: userRecoil.user_id,
          details: originData,
        };

        isCreate ? createPSR.mutate(dataPost) : updatePSR.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: t("Bạn cần điền đầy đủ thông tin!"),
        });
      });
  };

  const columns: TableColumnsType<{ hs_code: string; criteria: string }> = [
    {
      title: "Mã HS",
      dataIndex: "hs_code",
      key: "hs_code",
      width: "40%",
    },
    {
      title: "Tên tiêu chí được áp dụng",
      dataIndex: "criteria_name",
      key: "criteria_name",
      width: "60%",
    },
  ];

  return (
    <>
      {isCreate ? (
        <Button
          type="primary"
          className={`${styles.button} ${styles.button_create}`}
          onClick={handleOpen}
        >
          {t("for_all.button_create")}
        </Button>
      ) : (
        <Typography.Link
          style={{ width: "100%", display: "block" }}
          className={styles.link}
          onClick={handleOpen}
        >
          {id}
        </Typography.Link>
      )}
      <Modal
        style={{ top: 110 }}
        open={isOpen}
        width={"100%"}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        onOk={handleOk}
        maskClosable={false}
        destroyOnClose
        onCancel={handleCancel}
        confirmLoading={createPSR.isLoading || updatePSR.isLoading}
        className={styles.modal}
        closable={false}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {isCreate
              ? t("manage_psr.create.title")
              : t("manage_psr.detail.title")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>
        <div className="modal-body">
          <Form form={form} layout="vertical" name="form_in_modal">
            <Row gutter={32}>
              <Col span={14}>
                <Row gutter={12} style={{ alignItems: "flex-end" }}>
                  <Col span={7}>
                    <Form.Item
                      label={t("manage_psr.table.name_form")}
                      name="co_form_id"
                      rules={[...RULES_FORM.required]}
                    >
                      <Input
                        addonBefore={isCreate ? "Form" : false}
                        type="text"
                        disabled={!isCreate}
                        placeholder={
                          t("manage_psr.table.name_form") + ": AK" || ""
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      label={t("manage_psr.table.number_document")}
                      name="number_legal_documents"
                      rules={[...RULES_FORM.required]}
                    >
                      <Input
                        type="text"
                        placeholder={
                          t("manage_psr.table.number_document") || ""
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Form.Item>
                      <ImportPSR setData={setOriginData} />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button
                        className="button button_export"
                        style={{ width: "100%" }}
                      >
                        Export PSR
                      </Button>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Typography.Title level={5}>
                      {t("manage_psr.create.sub_title")}
                    </Typography.Title>

                    <Table
                      size="small"
                      bordered
                      columns={columns}
                      pagination={false}
                      dataSource={currentData}
                      rowKey={"order_number"}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                span={10}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Pagination
                  style={{ paddingBottom: 16 }}
                  current={page}
                  pageSize={pageSize}
                  onChange={(page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  }}
                  total={originData.length}
                  size="small"
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
}
