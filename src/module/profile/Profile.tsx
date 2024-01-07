import { Form, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { useDisclosure } from "@/hooks/useDisclosure";
import { getUserSelector } from "@/store/auth/state";

import { RenderUserModal } from "../authorization/modules/user-management/components/UserModal";
import { useUpdateUser } from "../authorization/modules/user-management/services/updateUser";
import { IUserDAO } from "../authorization/modules/user-management/types/user";

export default function Profile(): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { isOpen, open, close } = useDisclosure();
  const userRecoil = useRecoilValue(getUserSelector);
  const [dateOfBirth, setDateOfBirth] = useState<dayjs.Dayjs | null>(dayjs());

  const handleOpen = () => {
    if (userRecoil) {
      setDateOfBirth(dayjs(userRecoil.date_of_birth));
      form.setFieldsValue(userRecoil);
    }
    open();
  };

  const updateUser = useUpdateUser({
    config: {
      onSuccess: (data) => {
        notification.success({
          message: data.message,
        });
        close();
        form.resetFields();
      },
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const [first, ...middle] = values.full_name.split(" ");
        const last = middle.splice(middle.length - 1, 1)?.[0] || "";
        const dataPost: IUserDAO = {
          ...values,
          first_name: first,
          last_name: last,
          middle_name: middle.join(" "),
          date_of_birth: dayjs(dateOfBirth).format("YYYY-MM-DD"),
          created_by_user_id: userRecoil.user_id || userRecoil.user_name,
          lu_user_id: userRecoil.user_id || userRecoil.user_name,
          user_id: userRecoil.user_id,
        };
        updateUser.mutate(dataPost);
      })
      .catch(() => {
        notification.warning({
          message: t("message.validator"),
        });
      });
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <span onClick={handleOpen}>{t("for_all.profile")}</span>
      <RenderUserModal
        isCreate={false}
        isOpen={isOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        t={t}
        form={form}
        dateOfBirth={dateOfBirth}
        setDateOfBirth={setDateOfBirth}
      />
    </>
  );
}
