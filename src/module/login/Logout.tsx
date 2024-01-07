import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  LOCAL_USER,
  SESSION_CUSTOMER,
  SESSION_EMPLOYEE,
} from "@/constant/config";
import storage, { sessionService, storageService } from "@/utils/storage";

export default function Logout(): JSX.Element {
  const { t } = useTranslation();

  const handleClearStorage = () => {
    storage.clearToken();
    storageService.clearStorage(LOCAL_USER);
    sessionService.clearStorage(SESSION_CUSTOMER);
    sessionService.clearStorage(SESSION_EMPLOYEE);
  };

  return (
    <Link to="/login" onClick={handleClearStorage}>
      {t("for_all.logout")}
    </Link>
  );
}
