import {
  DoubleRightOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Space, notification } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Logo1Icon } from "@/assets/svg";
import { LOCAL_USER } from "@/constant/config";
import storage, { storageService } from "@/utils/storage";

import { RULES_FORM } from "../authorization/utils/validator";
import { useLogin } from "./apis/login";
import styles from "./style.module.scss";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

export function Login(): JSX.Element {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Đăng nhập | CO";
  }, []);

  const login = useLogin({
    config: {
      onSuccess: (data) => {
        if (!data || data?.message) {
          notification.error({
            message:
              data.response?.data?.message ||
              t("authentication.messages.message_failure"),
          });
          return navigate("/login");
        } else {
          storage.setToken(data.token);
          storageService.setStorage(LOCAL_USER, JSON.stringify(data));
          notification.success({
            message: t("authentication.messages.message_success"),
          });
          window.open("/", "_parent");
          // form.resetFields();
        }
      },
      onError: (data) => {
        notification.error({
          message:
            data.response?.data?.message ||
            t("authentication.messages.message_failure"),
        });
      },
    },
  });

  const handleLogin = () => {
    form.validateFields().then((values) => {
      login.mutate(values);
    });
  };

  const onTitleLogin = () => {
    return <h1 style={{ fontSize: "20px" }}>{t("authentication.title")}</h1>;
  };

  return (
    <div className={styles.login}>
      <div className={styles.login_flex}>
        <Logo1Icon />
        <Space direction="vertical" size={16}>
          <Card
            title={onTitleLogin()}
            style={{
              width: "400px",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <Form
              {...formItemLayout}
              layout="vertical"
              name="basic"
              form={form}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 30 }}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item
                name="username"
                label={t("authentication.username")}
                rules={[...RULES_FORM.required]}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder={t("authentication.username") || ""}
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={t("authentication.password")}
                rules={[...RULES_FORM.required]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder={t("authentication.password") || ""}
                />
              </Form.Item>

              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<DoubleRightOutlined />}
                    size="large"
                    className={styles.click_login}
                    loading={login.isLoading}
                    onClick={handleLogin}
                  >
                    {t("authentication.title")}
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </div>
    </div>
  );
}
