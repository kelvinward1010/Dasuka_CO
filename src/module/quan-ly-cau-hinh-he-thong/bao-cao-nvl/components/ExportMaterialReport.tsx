import { Button } from "antd";
import { useState } from "react";

import { downloadInOutInventory } from "../api/downloadInOutInventory";
import styles from "../style.module.scss";

interface Props {
  dataPost?: {
    from_date?: string;
    to_date?: string;
    customer_id: string;
    customer_name: string;
    status: string | number;
    search_content?: string;
    type?: string;
  };
}

export function ExportMaterialReport({ dataPost }: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExportExcel = async () => {
    if (dataPost) {
      const { customer_name, ...data } = dataPost;
      setIsLoading(true);

      await downloadInOutInventory(data, customer_name, getType(data.type));

      setIsLoading(false);
    }
  };

  const getType = (type: string = "") => {
    switch (type) {
      case "import":
        return "TKN";
      case "vat":
        return "VAT";
      case "export":
        return "TKX";
      default:
        return "";
    }
  };

  return (
    <>
      <Button
        className={`${styles.button} ${"button button_export"}`}
        onClick={handleExportExcel}
        loading={isLoading}
      >
        Export Excel
      </Button>
    </>
  );
}
