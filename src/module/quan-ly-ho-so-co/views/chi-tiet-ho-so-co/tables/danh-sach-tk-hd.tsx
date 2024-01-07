import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  Popconfirm,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { deleteFile, downloadFile } from "@/apis/downloadFile";
import { queryClient } from "@/lib/react-query";
import { useDeleteOtherDocument } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/deleteOtherDocument";
import { useGetOtherDocuments } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/getOtherDocuments";
import { useUpdateOtherDocument } from "@/module/quan-ly-ho-so-co/api/bo-tai-lieu/updateOtherDocument";
import { getUserSelector } from "@/store/auth/state";

const antLoadingIcon = <LoadingOutlined spin />;

export function DanhSachTkHdTable({ id }: any): JSX.Element {
  const [form] = Form.useForm();
  const [isDownloading, setIsDownloading] = useState("");
  const userRecoil = useRecoilValue(getUserSelector);
  const { t } = useTranslation();

  const { data } = useGetOtherDocuments({
    co_document_id: id || "0",
    config: {},
  });

  const deleteOtherDocument = useDeleteOtherDocument({
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries(["co-document-files"]);
      },
      onError: (err) => {
        notification.error({
          message: t("message.delete_failure"),
          description: err.message,
        });
      },
    },
  });

  const updateOtherDocument = useUpdateOtherDocument({
    config: {
      onSuccess: () => {
        // queryClient.invalidateQueries(["co-document-files"]);
      },
      onError: (err) => {
        notification.success({
          message: t("message.update_failure"),
          description: err.message,
        });
      },
    },
  });

  const handleDelete = (id: any, file_path: any) => {
    deleteOtherDocument.mutate({
      list_json: [{ co_document_file_id: id }],
      updated_by_id: userRecoil.user_id,
    });
    deleteFile(file_path);
  };

  const handleUpdate = (
    event: any,
    co_document_file_id: any,
    note: string | null,
  ) => {
    if (event?.target?.value !== note) {
      updateOtherDocument.mutate({
        co_document_file_id,
        note: event?.target.value,
        lu_user_id: userRecoil.user_id,
      });
    } else if (!event?.target?.value && event.target.value !== note) {
      queryClient.invalidateQueries(["co-document-files"]);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      width: "7%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => <Typography.Text>{++index}</Typography.Text>,
    },
    {
      title: "Tên file",
      dataIndex: "file_name",
      key: "file_name",
      render: (text: any) => (
        <Typography.Text style={{ textAlign: "left" }}>{text}</Typography.Text>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: "35%",
      render: (name, record, index) => (
        <Form.Item
          name={[name, "note", index]}
          style={{ margin: 0 }}
          initialValue={name}
        >
          <Input
            placeholder="Ghi chú"
            value={name}
            onBlur={(e) =>
              handleUpdate(e, record?.co_document_file_id, record?.note)
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Tải về",
      width: "7%",
      key: "download",
      align: "center",
      render: (_: any, record: any) => (
        <Spin
          spinning={isDownloading === record.co_document_file_id}
          indicator={antLoadingIcon}
        >
          <DownloadOutlined
            onClick={async () => {
              setIsDownloading(record.co_document_file_id);
              await downloadFile(record?.file_path, record?.file_name);
              setIsDownloading("");
            }}
            style={{ color: "#13AEDF", cursor: "pointer" }}
          />
        </Spin>
      ),
    },
    {
      title: "Xóa",
      width: "7%",
      key: "download",
      align: "center",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa không"
          onConfirm={() =>
            handleDelete(record?.co_document_file_id, record?.file_path)
          }
        >
          <DeleteOutlined style={{ color: "#FF0000", cursor: "pointer" }} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Form form={form}>
        <Table
          bordered
          columns={columns}
          size="small"
          dataSource={data}
          pagination={false}
          rowKey={(record) => record.co_document_file_id}
        />
      </Form>
    </>
  );
}
