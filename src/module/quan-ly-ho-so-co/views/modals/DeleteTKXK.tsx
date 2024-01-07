import { Form, Modal, Typography } from "antd";
import produce from "immer";
import { Dispatch, SetStateAction, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "../../style.module.scss";
import { sanPhamState } from "../chi-tiet-ho-so-co/state/bigA";

const { Text } = Typography;

interface dataset {
  // id: any,
  value: any;
  status: boolean;
  setModal: any;
  st: any;
  setCheckbox: Dispatch<SetStateAction<string[]>>;
}

export function DeleteTKXKModal(props: dataset) {
  const [form] = Form.useForm();
  const [isModalOpen] = useState(props.status);
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);

  const handleOk = () => {
    const newSanPhams = produce(sanPhams, (draft) => {
      return draft.filter((item) => item.stk !== props.value);
    });
    props.setCheckbox((prev) =>
      prev.filter((item) =>
        newSanPhams.find((prod) => item.indexOf(prod.key) > -1),
      ),
    );
    setSanPhams(newSanPhams);
    props.setModal(false);
    props.st(true);
  };
  const handleCancel = () => {
    props.setModal(false);
  };

  return (
    <>
      <Modal
        title={"Xóa tờ khai xuất khẩu"}
        okText={"Có"}
        cancelText={"Không"}
        okType="primary"
        className="modal-delete"
        centered
        width={"30vw"}
        bodyStyle={{
          padding: "0px !important",
          display: "flex",
          justifyContent: "center",
        }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <div className={styles.delete_tkxk}>
            <Text className={styles.delete_tkxk_center}>
              Xóa tờ khai xuất khẩu <Text type={"danger"}>{props.value}</Text>{" "}
              sẽ xóa tất cả sản phẩm của tờ khai này
            </Text>
            <Text>Bạn có muốn xóa không?</Text>
          </div>
        </Form>
      </Modal>
    </>
  );
}
