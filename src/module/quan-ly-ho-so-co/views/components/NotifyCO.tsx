import { Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { getLackedCOSelector } from "@/store/action/state";

export default function NotifyCO(): JSX.Element {
  const lackedMaterials = useRecoilValue(getLackedCOSelector);
  const { t } = useTranslation();

  return lackedMaterials ? (
    <Space>
      <Typography.Text type="danger" strong>{`Có ${lackedMaterials} ${t(
        "message.alert_lack_materials",
      )}`}</Typography.Text>
    </Space>
  ) : (
    <div style={{ padding: "5px 0px" }}></div>
  );
}
