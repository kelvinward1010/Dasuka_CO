import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  List,
  Row,
  Typography,
  notification,
} from "antd";
import { MenuProps } from "antd/lib/menu";
import produce from "immer";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState, useSetRecoilState } from "recoil";

import { ACCESSES, checkAccess } from "@/lib/access";
import { queryClient } from "@/lib/react-query";
import { getChiTietHoSoCOUrl, quanLyHoSoCOUrl } from "@/urls";
import { formatTimeAgo } from "@/utils/format";

import { customerState, staffState } from "../AppFilter/index.atom";
import { useDeleteNotifies } from "./services/deleteNotifies";
// import { useNotifies } from "./services/getNotifies";
import { updateNotify } from "./services/updateNotify";
import { dataNoticeState } from "./storage/atom";

export default function NoticeIcon(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const setNotice = useSetRecoilState(dataNoticeState);
  const resetStaff = useResetRecoilState(staffState);
  const resetCustomer = useResetRecoilState(customerState);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Service method for get notifies
  // useNotifies({
  //   params: {
  //     pageIndex: 1,
  //     pageSize: 10,
  //     user_id: userRecoil.user_id,
  //   },
  //   config: {
  //     onSuccess: (data) => {
  //       if (data?.data) {
  //         setItems(data.data);
  //         setCount(data.data.filter((item) => !item.is_read).length);
  //       }
  //     },
  //   },
  // });

  // Service method for delete notifies
  const deleteNotifies = useDeleteNotifies({
    config: {
      onSuccess: () => {
        notification.success({
          message: t("message.delete_success"),
        });

        queryClient.invalidateQueries(["notifies"]);
      },
    },
  });

  // Connect socket to server
  // useEffect(() => {
  //   const socket = connectionSocket();
  //   socket.emit("verify", userRecoil.user_id);
  //   socket.on("notify", (data) => {
  //     setItems((prevItem) => {
  //       return [data, ...prevItem];
  //     });
  //     setCount((prev) => prev + 1);
  //     queryClient.invalidateQueries(["notifies"]);
  //     queryClient.invalidateQueries(["co-documents"]);
  //   });

  //   // Not work when deploy, so disconnect
  //   // disconnectSocket(socket);

  //   return () => {
  //     disconnectSocket(socket);
  //   };
  // }, [userRecoil.user_id]);

  const handleNotifyClick = (notify_id: string) => {
    if (notify_id) {
      const newItems = produce(items, (draft) => {
        const index = draft?.findIndex(
          (item: any) => item.notify_id === notify_id,
        );
        if (index !== -1) {
          draft[index].is_read = true;
          updateNotify({ notifications: [{ ...draft[index] }] }).then(() => {
            queryClient.invalidateQueries(["notifies"]);
          });
        }
      });

      const selectedNotice = newItems.find(
        (item) => item.notify_id === notify_id,
      );

      setCount((prev) => (prev > 0 ? prev - 1 : 0));
      setItems(newItems);

      setNotice({
        ...selectedNotice,
        type: 2,
      });

      if (selectedNotice?.access_co_detail === 1) {
        navigate(getChiTietHoSoCOUrl(selectedNotice.target));
        return;
      }

      if (checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN)) resetStaff();
      resetCustomer();

      navigate(
        quanLyHoSoCOUrl +
          "?searchContent=" +
          selectedNotice?.target +
          `&exact=true`,
      );
    }
  };

  const handleDeleteNotify = (notice: any) => {
    deleteNotifies.mutate({ notifications: [notice.notify_id] });
  };

  const getDropdown = (notices: any): MenuProps["items"] => {
    return [...Array(2)].map((_, indexGroup) => ({
      type: "group",
      label: (
        <Typography.Title
          type={indexGroup === 0 ? "danger" : undefined}
          level={5}
          style={{ margin: 0, marginTop: 5 }}
        >
          {indexGroup === 0 ? "Chưa đọc" : "Tất cả"}
        </Typography.Title>
      ),
      key: indexGroup,
      children: notices
        ?.filter((item: any) =>
          indexGroup === 0 ? !item.is_read : item.is_read,
        )
        ?.map((notice: any, index: number) => ({
          ...notice,
          key: notice.notify_id,
          is_read: "true",
          label: (
            <Row
              align={"top"}
              justify={"space-between"}
              style={{ flexWrap: "nowrap" }}
            >
              <div onClick={() => handleNotifyClick(notice.notify_id)}>
                <List.Item.Meta
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "nowrap",
                    marginRight: 10,
                  }}
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={<Typography.Text>{notice.content}</Typography.Text>}
                  description={
                    <Typography.Text>
                      {formatTimeAgo(new Date(notice.created_date_time))}
                    </Typography.Text>
                  }
                />
              </div>
              <Button
                type="dashed"
                danger
                style={{ height: "100%" }}
                onClick={() => handleDeleteNotify(notice)}
              >
                <DeleteOutlined />
              </Button>
            </Row>
          ),
          style: {
            backgroundColor: !notice.is_read ? "#e6f4ff" : "",
          },
        })),
    }));
  };

  return (
    <Dropdown
      menu={{
        items: getDropdown(items),
        style: {
          maxHeight: 500,
          maxWidth: 500,
          minWidth: 400,
          overflow: "hidden",
          overflowY: "auto",
        },
        // onClick: handleNotifyClick,
      }}
      trigger={["click"]}
      placement="bottomLeft"
      arrow={{ pointAtCenter: true }}
      open={open}
      onOpenChange={(flag) => setOpen(flag)}
    >
      <Badge count={count} overflowCount={9} size="small" key="bell-outlined">
        <BellOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />
      </Badge>
    </Dropdown>
  );
}
