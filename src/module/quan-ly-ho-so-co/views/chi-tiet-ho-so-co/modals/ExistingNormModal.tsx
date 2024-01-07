import { CloseCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Modal,
  Row,
  Table,
  TableColumnsType,
  Typography,
  notification,
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import produce from "immer";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

import { removeVietnameseTones } from "@/apis/useUploadFile";
import { customerState } from "@/components/AppFilter/index.atom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useImportNorm } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-dinh-muc/api/importNorm";
import { getUserSelector } from "@/store/auth/state";

import { dataDropdownExportState, sanPhamState } from "../state/bigA";
import styles from "./ChiTietBoTaiLieu.module.scss";

interface item {
  norm_name: string;
  norm_id: string;
  id: string;
  file: File;
  key: React.Key;
  product_code: string;
  product_name: string;
}

interface Props {
  listItems: item[];
  setList: any;
  handleRefreshProduct: any;
}

export function ExistingNormModal({
  listItems,
  setList,
  handleRefreshProduct,
}: Props) {
  const { isOpen, close, open } = useDisclosure();
  const { t } = useTranslation();
  const customer = useRecoilValue(customerState);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [sanPhams] = useRecoilState(sanPhamState);
  const dropdownExports = useRecoilValue(dataDropdownExportState);
  const userRecoil = useRecoilValue(getUserSelector);

  const importNorm = useImportNorm({
    config: {
      onSuccess: (data) => {
        if (data.overwritten_norms.length > 0) {
          data?.overwritten_norms?.forEach((norm) => {
            notification.success({
              message: `Thay thế định mức ${norm.norm_name} thành công!`,
            });
          });

          const indexChanged: number[] = [];
          const newSanPham = produce(sanPhams, (draft) => {
            data?.overwritten_norms?.forEach((norm: any) => {
              const normName = norm?.norm_name?.split("=>")?.[1];
              const index = draft.findIndex(
                (i) => normName.indexOf(i.product_code) > -1,
              );

              if (index === -1) return;
              indexChanged.push(index);
              draft[index].dinh_muc = norm.norm_name;
              draft[index].dinh_muc_id = norm.norm_id;
            });
          });
          handleRefreshProduct(newSanPham, indexChanged);
        }
        if (data.errors.length > 0) {
          data.errors.forEach((error) => {
            notification.error({
              message: error.file,
              description: error.error,
            });
          });
        }
        setList([]);
        close();
      },
      onError: (err) => {
        notification.error({
          message: "Lỗi",
          description: err.response?.data.error,
        });
      },
    },
  });

  const handleOk = async () => {
    if (selectedRowKeys.length > 0) {
      const formData = new FormData();

      let listFiles: { file: Blob; name: string }[] = [];
      selectedRowKeys.forEach((key) => {
        listFiles.push({
          file: listItems[key as keyof object].file as unknown as Blob,
          name: removeVietnameseTones(
            listItems[key as keyof object]?.file?.name,
          ),
        });
      });

      listFiles = _.unionBy(listFiles, "name");

      listFiles.forEach((file) => {
        formData.append("files", file.file, file.name);
      });

      formData.append("customer_id", customer?.value);
      formData.append("tax_code", customer?.tax_code);
      formData.append("created_by_user_id", userRecoil.user_id);
      formData.append("is_overwrite_mode", "1");
      formData.append(
        "list_product",
        JSON.stringify(
          sanPhams.map((product) => ({
            product_code: product.product_code,
            export_licence_number: _.find(dropdownExports, {
              value: product?.stk,
            })?.export_licence_number,
            product_name: product.name_hh,
          })),
        ),
      );

      importNorm.mutate(formData);
    } else close();
  };

  const handleCancel = () => {
    close();
    setList([]);
  };

  useEffect(() => {
    if (listItems?.length > 0) {
      setSelectedRowKeys(listItems.map((item) => item.key));
      open();
    }
  }, [listItems, open]);

  const columns: TableColumnsType<item> = [
    {
      title: "STT",
      width: "10%",
      align: "center",
      dataIndex: "RowNumber",
      render: (_, __, index) => (
        <Typography.Text style={{ textAlign: "center" }}>
          {++index}
        </Typography.Text>
      ),
    },
    {
      title: t("quan_ly_hs_co.table_sp_in_co.dinh_muc"),
      dataIndex: "norm_name",
      key: "norm_name",
      sorter: (a, b) => {
        const nameA = a?.norm_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.norm_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "product_code",
      key: "product_code",
      sorter: (a, b) => {
        const nameA = a?.product_code?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.product_code?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a, b) => {
        const nameA = a?.product_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.product_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    {
      title: "Số tờ khai",
      dataIndex: "product_name",
      key: "product_name",
      sorter: (a, b) => {
        const nameA = a?.product_name?.toUpperCase(); // ignore upper and lowercase
        const nameB = b?.product_name?.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) return -1;

        if (nameA > nameB) return 1;

        // names must be equal
        return 0;
      },
    },
    Table.SELECTION_COLUMN,
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<item> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    columnWidth: "50px",
  };

  return (
    <>
      <Modal
        style={{ top: "5px" }}
        centered
        confirmLoading={importNorm.isLoading}
        width={"60vw"}
        bodyStyle={{ padding: "0px !important" }}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        okText={t("for_all.button_save")}
        okButtonProps={{
          className: `${styles.button} ${styles.button_save}`,
        }}
        cancelButtonProps={{
          className: `${styles.button} ${styles.button_cancel}`,
        }}
        cancelText={t("for_all.button_cancel")}
        className={styles.modal}
      >
        <Row
          gutter={16}
          justify={"space-between"}
          className={styles.modal_header}
        >
          <Typography.Title level={4} className={styles.modal_header_title}>
            {t("quan_ly_hs_co.them_moi_hs.title_existing_norm")}
          </Typography.Title>
          <Col>
            <CloseCircleOutlined
              onClick={handleCancel}
              className={styles.modal_header_close}
            ></CloseCircleOutlined>
          </Col>
        </Row>

        <div className={styles.top_ctbtl}>
          <Table
            size="small"
            bordered
            rowSelection={rowSelection}
            columns={columns}
            dataSource={listItems}
            rowKey={(record) => record.key}
          />
        </div>
      </Modal>
    </>
  );
}
