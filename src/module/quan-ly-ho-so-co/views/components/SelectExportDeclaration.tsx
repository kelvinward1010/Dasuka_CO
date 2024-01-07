import { Select, Spin, notification } from "antd";
import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { tagRender } from "@/constant/antd";
import { IExportDeclarationDropdown } from "@/module/quan-ly-to-khai/export-declaration/types";
import { DataSelectedState } from "@/store/datanvl/atom";

interface Props {
  isDone?: boolean;
  styles: CSSModuleClasses;
  select: string[];
  setSelect: Dispatch<SetStateAction<string[]>>;
  loadingDropdownExportDeclaration?: boolean;
  dropdownExportDeclaration: IExportDeclarationDropdown | undefined;
  setValues: any;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setPageExportSize: Dispatch<SetStateAction<number>>;
  setSearchContentExport: Dispatch<SetStateAction<string | null | undefined>>;
}

export default function SelectExportDeclaration({
  isDone = false,
  styles,
  select,
  setSelect,
  loadingDropdownExportDeclaration,
  dropdownExportDeclaration,
  setValues,
  setIsModalOpen,
  setPageExportSize,
  setSearchContentExport,
}: Props) {
  const { t } = useTranslation();
  const [, setSelected] = useRecoilState<string[]>(DataSelectedState);
  const [currentData, setCurrentData] = useState<IExportDeclarationDropdown>(
    [],
  );

  useEffect(() => {
    if (dropdownExportDeclaration) setCurrentData(dropdownExportDeclaration);
  }, [dropdownExportDeclaration]);

  const handleChangeTk = (value: string[], option: any) => {
    if (select?.[0]) {
      const diff = _.uniqBy(option, "shipping_terms");
      if (diff.length === 1) {
        setSearchContentExport("");
        setSelect(value);
        setSelected(value);
      } else {
        notification.warning({
          message: t("message.same_shipping_terms"),
        });
      }
    } else {
      setSearchContentExport("");
      setSelect(value);
      setSelected(value);
    }
  };

  const handleScroll = (event: any) => {
    const target = event.target;
    if (
      !loadingDropdownExportDeclaration &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      target.scrollTo(0, target.scrollHeight);
      setPageExportSize((prev) => prev + 10);
    }
  };

  return (
    <Select
      disabled={isDone}
      showSearch
      placeholder="Select tờ khai xuất khẩu"
      optionFilterProp="children"
      className={styles.select_tkxk}
      mode="multiple"
      value={select}
      onChange={handleChangeTk}
      onPopupScroll={handleScroll}
      onDeselect={() => setSelect([...select])}
      onSearch={(value) => {
        setCurrentData([
          {
            label: <Spin spinning></Spin>,
            value: "loading",
            shipping_terms: "",
          },
        ]);
        setSearchContentExport(value);
      }}
      filterOption={false}
      loading={loadingDropdownExportDeclaration}
      options={currentData?.map((option) => ({
        ...option,
        label:
          typeof option.label === "string"
            ? `${option.label} (${option.shipping_terms})`
            : option.label,
      }))}
      tagRender={(props) =>
        tagRender({
          ...props,
          onClose: (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            setValues(props.value);
            setIsModalOpen(true);
          },
        })
      }
    ></Select>
  );
}
