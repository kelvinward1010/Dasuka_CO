import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";

import { IconCancelStatus } from "@/assets/svg";
import { useCreateNotify } from "@/components/Notice/services/createNotify";
import { getManagers } from "@/components/Notice/services/getManagers";
import { getNotify } from "@/components/Notice/services/getNotify";
import { dataNoticeState } from "@/components/Notice/storage/atom";
import { getNoticeSelector } from "@/components/Notice/storage/state";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ACCESSES, checkAccess } from "@/lib/access";
import { queryClient } from "@/lib/react-query";
import { UpdateExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/components/UpdateExportDeclaration";
import { IExportDeclaration } from "@/module/quan-ly-to-khai/export-declaration/types";
import { getUserSelector } from "@/store/auth/state";

import { STATUS_DROPDOWN_TEXT_TYPE } from "../api/getDropdownStatus";
import styles from "./ActionCoDocument.module.scss";

interface Props {
  record: Record<string, any>;
}

export function CancelCoDocument({ record }: Props): JSX.Element {
  const { isOpen, close, open } = useDisclosure();
  const [form] = Form.useForm();
  const [state, setState] = useState<{ reason: string }>({ reason: "" });
  const userRecoil = useRecoilValue(getUserSelector);
  const [isNo, setIsNo] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpenAdmin, setIsOpenAdmin] = useState<boolean>(false);
  const notice = useRecoilValue(getNoticeSelector);
  const resetNotice = useResetRecoilState(dataNoticeState);

  useEffect(() => {
    if (checkAccess(ACCESSES.CO_CANCEL) && !isAdmin) setIsAdmin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      notice.target === record?.co_document_id &&
      checkAccess(ACCESSES.CO_CANCEL) &&
      record?.status_id === 3 &&
      !isOpen
    ) {
      open();
      setIsOpenAdmin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice.target]);

  const handleOpen = async () => {
    open();
    const reasons = await getNotify({ id: record?.co_document_id });
    if (reasons?.length > 0) {
      form.setFieldValue("reason", reasons[0]);
      setState({ reason: reasons[0] });
    }
  };

  const handleClose = () => {
    close();
    setState({
      reason: "",
    });
    setIsNo(true);
    setIsOpenAdmin(false);
    resetNotice();
  };

  const handleChangeYes = () => {
    setIsNo(false);
  };

  const handleChangeNo = () => {
    setIsNo(true);
  };

  const sendNotify = useCreateNotify({
    config: {
      onSuccess: () => {
        notification.success({
          message: "Tin nhắn đã được gửi",
        });

        close();
        queryClient.invalidateQueries(["notifies"]);
        queryClient.invalidateQueries(["co-documents"]);
      },
    },
  });

  const handleConfirm = async () => {
    const managers = await getManagers({ user_id: userRecoil.user_name });

    if (managers) {
      sendNotify.mutate([
        ...managers.map((manager) => ({
          type: 2,
          reason: form.getFieldValue("reason"),
          content: `${userRecoil.full_name} đã gửi yêu cầu hủy hồ sơ số ${
            record.co_document_number || record.co_document_id
          }`,
          receiver: manager,
          sender: userRecoil.user_id,
          target: record?.co_document_id,
          request_type: 1, // 1: cho huy,  2: editable
          is_read: false,
          is_received: false,
          active_flag: 1,
          created_date_time: dayjs().format("YYYY-MM-DD"),
          created_by_user_id: userRecoil.user_id,
        })),
      ]);
    } else {
      notification.warning({
        message: "Không tìm thấy người quản lý nào của bạn.",
      });
    }
  };

  // const isDisable = () => {
  //   return (
  //     record?.status_id === 6 ||
  //     (record?.status_id !== 1 && record?.status_id !== 4)
  //   );
  // };

  const handleConfirmAdmin = (isAllow: boolean) => () => {
    sendNotify.mutate([
      {
        type: 2,
        // reason: form.getFieldValue("reason"),
        content: `${userRecoil.full_name} đã ${
          isAllow ? "chấp thuận" : "từ chối"
        } yêu cầu hủy hồ sơ số ${
          record.co_document_number || record.co_document_id
        }`,
        receiver: notice.sender_id,
        sender: userRecoil.user_id,
        target: record?.co_document_id,
        request_type: isAllow ? 3 : 4, // 3: accepted, 4: rejected
        is_read: false,
        is_received: false,
        active_flag: 1,
        created_date_time: dayjs().format("YYYY-MM-DD"),
        created_by_user_id: userRecoil.user_id,
      },
    ]);
  };

  // const getClassAdmin = () => {
  //   return isWaitingEdit() || isDisable() || !record?.editable
  //     ? record?.status_id === 3
  //       ? ""
  //       : ""
  //     : "warning";
  // };

  const getStatusOfButton = (except: number = 1) => {
    switch (record.status_id) {
      case 3:
        return "warning";
      case except:
        return "danger";
      default:
        return "";
    }
  };

  const isDisable = (except: number = 1) => {
    const status = record?.status_id;
    return status !== except && status !== 3;
  };

  // 1: Hoan thanh
  // 2: Dang thuc hien
  // 3: Cho huy
  // 4: Cho duyet
  // 5: Tu choi xet duyet
  // 6: Da huy

  return (
    <>
      {isAdmin ? (
        <Button
          disabled={isDisable(0)}
          icon={<IconCancelStatus />}
          type="text"
          danger
          title="Hủy hồ sơ C/O"
          onClick={handleOpen}
          className={styles[getStatusOfButton(0)]}
        />
      ) : (
        <Button
          disabled={isDisable()}
          icon={<IconCancelStatus />}
          type="text"
          danger
          title="Hủy hồ sơ C/O"
          onClick={handleOpen}
          className={styles[getStatusOfButton()]}
        />
      )}

      <Modal
        title="Hủy hồ sơ C/O"
        className="modal-delete"
        centered
        bodyStyle={{
          padding: "0px !important",
          textAlign: "center",
        }}
        open={!isAdmin && isOpen}
        onCancel={handleClose}
        footer={null}
      >
        <hr />
        {isNo ? (
          <>
            <br />
            <div>
              <Typography.Text strong>
                Bạn có muốn hủy hồ sơ{" "}
                <span className={styles.danger}>
                  “{record.co_document_number}”
                </span>
              </Typography.Text>
            </div>
            <br />

            <Form
              layout="vertical"
              className={styles.form}
              onValuesChange={(values) => setState(values)}
              form={form}
            >
              <Form.Item
                label="Lý do hủy"
                rules={[{ required: true }]}
                name="reason"
              >
                <Input.TextArea rows={5} />
              </Form.Item>
            </Form>
            <Space>
              <Button onClick={handleClose}>Không</Button>
              <Button
                type="primary"
                onClick={handleChangeYes}
                disabled={
                  (record?.status_id !== 1 && record?.status_id !== 4) ||
                  state.reason === ""
                }
              >
                Có
              </Button>
            </Space>
          </>
        ) : (
          <div className={styles.text_left}>
            <Form className={styles.form}>
              <Form.Item label="Nhân viên">{record.employee_name}</Form.Item>
              <Form.Item label="Ngày tạo hồ sơ">
                {record.created_date &&
                  dayjs(record.created_date).format("DD/MM/YYYY")}
              </Form.Item>
              <Form.Item label="Khách hàng">{record.customer_name}</Form.Item>
              <Form.Item label="Số tờ khai xuất - ĐKVC">
                {_.compact(record.number_tkx_with_shipping_terms)?.map(
                  (tkx: any, index) => {
                    const isLastItem =
                      index ===
                      record.number_tkx_with_shipping_terms?.length - 1;

                    return (
                      <span key={tkx?.value}>
                        <UpdateExportDeclaration
                          exportDeclaration={
                            {
                              export_declaration_number: tkx?.label,
                              export_declaration_id: tkx?.value,
                              shipping_terms: tkx?.shipping_terms,
                            } as IExportDeclaration
                          }
                          isShowTerm={true}
                        />{" "}
                        {isLastItem ? "" : ", "}
                      </span>
                    );
                  },
                )}
              </Form.Item>
              <Form.Item label="Trạng thái">
                <div
                  className={
                    styles[
                      STATUS_DROPDOWN_TEXT_TYPE[record.status_id] ?? "disabled"
                    ]
                  }
                >
                  {record.status_name}
                </div>
              </Form.Item>
              <Form.Item label="Lý do sửa">{state.reason}</Form.Item>
            </Form>
            <div className={styles.text_center}>
              <Space>
                <Button onClick={handleChangeNo}>Không</Button>
                <Button type="primary" onClick={handleConfirm}>
                  Đồng ý
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Admin */}
      <Modal
        title="Yêu cầu hủy hồ sơ C/O"
        className="modal-delete"
        centered
        bodyStyle={{
          padding: "0px !important",
          textAlign: "center",
        }}
        open={isAdmin && isOpen}
        onCancel={handleClose}
        footer={null}
      >
        <hr />
        <div className={styles.text_left}>
          <Form className={styles.form}>
            <Form.Item label="Nhân viên">{record.employee_name}</Form.Item>
            <Form.Item label="Ngày tạo hồ sơ">
              {record.created_date &&
                dayjs(record.created_date).format("DD/MM/YYYY")}
            </Form.Item>
            <Form.Item label="Khách hàng">{record.customer_name}</Form.Item>
            <Form.Item label="Số tờ khai xuất - ĐKVC">
              {_.compact(record.number_tkx_with_shipping_terms)?.map(
                (tkx: any, index) => {
                  const isLastItem =
                    index === record.number_tkx_with_shipping_terms?.length - 1;

                  return (
                    <span key={tkx?.value}>
                      <UpdateExportDeclaration
                        exportDeclaration={
                          {
                            export_declaration_number: tkx?.label,
                            export_declaration_id: tkx?.value,
                            shipping_terms: tkx?.shipping_terms,
                          } as IExportDeclaration
                        }
                        isShowTerm={true}
                      />{" "}
                      {isLastItem ? "" : ", "}
                    </span>
                  );
                },
              )}
            </Form.Item>
            <Form.Item label="Trạng thái">
              <div
                className={
                  styles[
                    STATUS_DROPDOWN_TEXT_TYPE[record.status_id] ?? "disabled"
                  ]
                }
              >
                {record.status_name}
              </div>
            </Form.Item>
            <Form.Item label="Lý do sửa">{state.reason}</Form.Item>
          </Form>
          <div className={styles.text_center}>
            <Space>
              <Button onClick={handleClose}>Không</Button>
              <Button
                type="primary"
                danger
                onClick={handleConfirmAdmin(false)}
                disabled={isOpenAdmin ? false : !state.reason}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                onClick={handleConfirmAdmin(true)}
                disabled={isOpenAdmin ? false : !state.reason}
              >
                Đồng ý
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
}
