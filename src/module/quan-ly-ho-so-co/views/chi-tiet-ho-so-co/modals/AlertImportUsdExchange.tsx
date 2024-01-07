import { Space } from "antd";
import dayjs from "dayjs";
import produce from "immer";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { UpdateVatInvoice } from "@/module/quan-ly-hoa-don-vat/danh-sach-hoa-don-vat/components/UpdateVatInvoice";
import { UpdateImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/components/UpdateImportDeclaration";
import { IImportDeclaration } from "@/module/quan-ly-to-khai/import-declaration/types";

import { sanPhamState } from "../state/bigA";

interface Props {
  importDeclarations: any[];
}

export const AlertImportUsdExchange: React.FC<Props> = ({
  importDeclarations: initialImportDeclarations,
}) => {
  const [sanPhams, setSanPhams] = useRecoilState(sanPhamState);
  // TODO: need change name
  const [importDeclarations, setImportDeclarations] = useState<any[]>(
    initialImportDeclarations,
  );

  useEffect(() => {
    setImportDeclarations(initialImportDeclarations);
  }, [initialImportDeclarations]);

  const handleChangeImportDeclaration = (
    importDeclaration: any,
    importDeclarationId: string,
    index: number,
  ) => {
    const newSanPhams = produce(sanPhams, (draft) => {
      draft.forEach((sanPham) => {
        sanPham?.nguyen_lieu?.forEach((nl: any) => {
          nl?.norm_vat_invoice_import_declaration?.forEach((norm: any) => {
            if (norm.import_declaration_id === importDeclarationId) {
              norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
              norm.form = importDeclaration.form;
              norm.prefer_co_date = importDeclaration.prefer_co_date
                ? dayjs(importDeclaration.prefer_co_date).format("YYYY-MM-DD")
                : null;
              norm.prefer_co_document_number =
                importDeclaration.prefer_co_document_number;
              norm.x_annex_code = importDeclaration.x_annex_code;
            } else if (norm.vat_invoice_id === importDeclarationId) {
              norm.usd_exchange_rate = importDeclaration.usd_exchange_rate;
              norm.x_annex_date = importDeclaration.date
                ? dayjs(importDeclaration.date).format("YYYY-MM-DD")
                : null;
              norm.x_annex_code = importDeclaration.x_annex_code;
            }
          });
        });
      });
    });

    setSanPhams(newSanPhams);

    if (importDeclaration?.usd_exchange_rate) {
      const newImportDeclarations = produce(importDeclarations, (draft) => {
        draft.splice(index, 1);
      });

      setImportDeclarations(newImportDeclarations);
    }
  };

  return (
    <Space direction="vertical">
      {importDeclarations.map((id, index) =>
        id?.import_declaration_id ? (
          <UpdateImportDeclaration
            key={id.import_declaration_id + index}
            importDeclaration={
              {
                import_declaration_number: id?.import_declaration_id,
                import_declaration_id: id?.import_declaration_id,
              } as IImportDeclaration
            }
            onSuccess={(importDeclaration) =>
              handleChangeImportDeclaration(
                importDeclaration,
                id.import_declaration_id,
                index,
              )
            }
          />
        ) : (
          <UpdateVatInvoice
            key={id?.vat_invoice_id + index}
            vatInvoiceId={id?.vat_invoice_id}
            serialNumber={id?.serial_number}
            onSuccess={(importDeclaration) =>
              handleChangeImportDeclaration(
                importDeclaration,
                id.vat_invoice_id,
                index,
              )
            }
          />
        ),
      )}
    </Space>
  );
};
