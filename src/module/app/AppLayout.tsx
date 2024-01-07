import { ProLayout, ProLayoutProps } from "@ant-design/pro-components";
import { Dropdown, notification } from "antd";
import React, { useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useRecoilState } from "recoil";

import { LogoIcon } from "@/assets/svg";
import NoticeIcon from "@/components/Notice/NoticeIcon";
import { LOCAL_USER } from "@/constant/config";
import { DataUserState } from "@/store/auth/atom";
import { trangChuUrl } from "@/urls";
import storage, { storageService } from "@/utils/storage";

import Logout from "../login/Logout";
import ForgotPasswordModal from "../profile/ChangePasswordModal";
import Profile from "../profile/Profile";
import styles from "./AppLayout.module.scss";
import { appRoute } from "./appRoute";
import "./style.css";

interface Props {
  children?: React.ReactNode;
}

export function AppLayout({ children }: Props): JSX.Element {
  const navigate = useNavigate();
  useEffect(() => {
    if (!storage.getToken()) navigate("/login");
  }, [navigate]);
  const settings: ProLayoutProps = {
    fixSiderbar: true,
    fixedHeader: true,
    layout: "top",
    splitMenus: true,
    className: styles.appLayout,
  };
  const location = useLocation();
  const [userRecoil, setUserRecoil] = useRecoilState(DataUserState);
  const [, contextHolder] = notification.useNotification();

  useEffect(() => {
    const user = storageService.getStorage(LOCAL_USER);
    if (user?.token) setUserRecoil(user);
    else navigate("/login");
  }, [navigate, setUserRecoil]);

  const items = [
    {
      key: "1",
      label: (
        <div>
          <Profile />
        </div>
      ),
    },
    {
      key: "2",
      label: <ForgotPasswordModal />,
    },
    {
      type: "divider",
      key: "0",
    },
    {
      key: "3",
      label: <Logout />,
    },
  ];

  if (location.pathname === "/") {
    return <Navigate to={trangChuUrl} />;
  }

  return (
    <ProLayout
      token={{
        header: {
          colorBgHeader: "#2C678D",
          colorTextMenuSelected: "#8AE929",
          colorTextMenuActive: "#8AE929",
        },
      }}
      route={appRoute(userRecoil?.functions)}
      location={{ pathname: location.pathname }}
      menu={{
        type: "group",
      }}
      avatarProps={{
        src: userRecoil?.avatar
          ? userRecoil.avatar
          : "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        size: "small",
        title: (
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
            arrow={{ pointAtCenter: true }}
          >
            <span style={{ color: "white" }}>
              {userRecoil?.full_name ? userRecoil.full_name : ""}
            </span>
          </Dropdown>
        ),
      }}
      actionsRender={() => {
        // if (props.isMobile) return [];
        return [<NoticeIcon />];
      }}
      menuItemRender={(item, dom) => (
        <div onClick={handleSetPathname(item.path || trangChuUrl)}>{dom}</div>
      )}
      headerTitleRender={(_, __, ___) => (
        <Link to={trangChuUrl} style={{ paddingRight: 10 }}>
          <LogoIcon />
        </Link>
      )}
      {...settings}
    >
      <Outlet />
      {children}
      {contextHolder}
    </ProLayout>
  );

  function handleSetPathname(path: string) {
    return function () {
      navigate(path);
    };
  }
}
