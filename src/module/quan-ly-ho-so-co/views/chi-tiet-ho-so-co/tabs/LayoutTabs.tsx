import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { dataLackedMaterialState } from "@/store/action/atom";
import { dataListCriteriaState } from "@/store/choose/atom";
import { chooseFormCOSelector } from "@/store/choose/state";

import styles from "../../../style.module.scss";
import { checkResultForm, customResultForm } from "../../config/result-form";
import { handleTotalChiPhiNguyenLieu } from "../../config/sum-formula";
import { sanPhamSelector } from "../state/bigA";
import { getPercentOfCriterial } from "../utils";
import Cc, { handleCalcEndCC } from "./Cc";
import Cth, { handleCalcEndCth } from "./Cth";
import Ctsh, { handleCalcEndCtsh } from "./Ctsh";
import Lvc from "./Lvc";
import Rvc from "./Rvc";
import Wo from "./Wo";
import WoAk from "./Wo-Ak";

interface tabSet {
  check_tabs: any;
}

export default function LayoutTabs({ check_tabs }: tabSet) {
  const { sanPham } = useRecoilValue(sanPhamSelector);
  const lackedMaterial = useRecoilValue(dataLackedMaterialState);
  const listCriteria = useRecoilValue(dataListCriteriaState);
  const chooseFormCo = useRecoilValue(chooseFormCOSelector);
  const { t } = useTranslation();

  const initialItems = [
    {
      label: customResultForm(
        lackedMaterial === 0 && (sanPham?.tcs?.lvc?.end ?? 1) > -1,
        "LVC - ",
        t,
      ),
      key: "LVC",
      children: <Lvc percent={getPercentOfCriterial("LVC", listCriteria)} />,
    },
    {
      label: customResultForm(
        handleCalcEndCC(
          sanPham?.tcs?.cc,
          handleTotalChiPhiNguyenLieu(sanPham?.nguyen_lieu, sanPham?.otherFees),
        ) === 0 ||
          ((sanPham?.tcs?.cc?.end ?? 1) > -1 &&
            checkResultForm(sanPham, sanPham.nguyen_lieu, 2, chooseFormCo) &&
            lackedMaterial === 0),
        "CC - ",
        t,
      ),
      key: "CC",
      children: <Cc />,
    },
    {
      label: customResultForm(
        handleCalcEndCth(
          sanPham?.tcs?.cth,
          handleTotalChiPhiNguyenLieu(sanPham?.nguyen_lieu, sanPham?.otherFees),
        ) === 0 ||
          ((sanPham?.tcs?.cth?.end ?? 1) > -1 &&
            checkResultForm(sanPham, sanPham.nguyen_lieu, 4, chooseFormCo) &&
            lackedMaterial === 0),
        "CTH - ",
        t,
      ),
      key: "CTH",
      children: <Cth />,
    },
    {
      label: customResultForm(
        handleCalcEndCtsh(
          sanPham?.tcs?.ctsh,
          handleTotalChiPhiNguyenLieu(sanPham?.nguyen_lieu, sanPham?.otherFees),
        ) === 0 ||
          ((sanPham?.tcs?.ctsh?.end ?? 1) > -1 &&
            checkResultForm(sanPham, sanPham.nguyen_lieu, 6, chooseFormCo) &&
            lackedMaterial === 0),
        "CTSH - ",
        t,
      ),
      key: "CTSH",
      children: <Ctsh />,
    },
    {
      label: customResultForm(
        lackedMaterial === 0 && (sanPham?.tcs?.wo?.end ?? 1) > -1,
        "WO - ",
        t,
      ),
      key: "WO",
      children: <Wo />,
    },
    {
      label: customResultForm(
        handleCalcEndCth(
          sanPham?.tcs?.psr,
          handleTotalChiPhiNguyenLieu(sanPham?.nguyen_lieu, sanPham?.otherFees),
        ) === 0 ||
          ((sanPham?.tcs?.psr?.end ?? 1) > -1 &&
            checkResultForm(
              sanPham,
              sanPham.nguyen_lieu,
              sanPham?.tcs?.psr?.type ?? 4,
              chooseFormCo,
            ) &&
            lackedMaterial === 0),
        "PSR - ",
        t,
      ),
      key: "PSR",
      children:
        (sanPham?.tcs?.psr?.type ?? 4) === 4 ? (
          <Cth keyCriterial="psr" />
        ) : (
          <Ctsh keyCriterial="psr" />
        ),
    },
    {
      label: customResultForm(
        lackedMaterial === 0 && (sanPham?.tcs?.["wo-ak"]?.end ?? 1) > -1,
        "WO-AK - ",
        t,
      ),
      key: "WO-AK",
      children: <WoAk />,
    },
    {
      label: customResultForm(
        lackedMaterial === 0 && (sanPham?.tcs?.rvc?.end ?? 1) > -1,
        "RVC - ",
        t,
      ),
      key: "RVC",
      children: <Rvc percent={getPercentOfCriterial("RVC", listCriteria)} />,
    },
  ];

  const take_tabs = initialItems.filter((i) => check_tabs?.includes(i?.key));
  return (
    <Tabs className={styles.tab_chitiet_hs} type="card" items={take_tabs} />
  );
}
