import { Checkbox, Typography } from "antd";
import { useRecoilState } from "recoil";

import { isCheckedLackedState } from "../chi-tiet-ho-so-co/state/tcs";

export default function CheckboxShowLackedMaterial({
  lackedMaterial,
}: {
  lackedMaterial: number | null;
}): JSX.Element {
  const [isCheckedLacked, setIsCheckedLacked] =
    useRecoilState(isCheckedLackedState);

  return (
    <Checkbox
      style={{ marginTop: 5 }}
      disabled={lackedMaterial === 0}
      checked={isCheckedLacked}
      onChange={(e) => setIsCheckedLacked(e.target.checked)}
    >
      <Typography.Text style={{ fontWeight: 600 }}>
        Thừa/thiếu NVL ({lackedMaterial})
      </Typography.Text>
    </Checkbox>
  );
}
