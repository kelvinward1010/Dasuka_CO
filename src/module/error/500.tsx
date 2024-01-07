import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { trangChuUrl } from "@/urls";

export function ServerErrorPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title={t("error.500.title")}
      subTitle={t("error.500.subTitle")}
      extra={
        <Button type="primary" onClick={backHome}>
          {t("error.backHome")}
        </Button>
      }
    />
  );

  function backHome() {
    navigate(trangChuUrl);
  }
}
