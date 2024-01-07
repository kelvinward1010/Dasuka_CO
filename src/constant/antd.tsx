import { Tag } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const rangePresets: {
  label: string;
  value: [Dayjs, Dayjs];
}[] = [
  {
    label: "Hôm nay",
    value: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    label: "Tuần này",
    value: [dayjs().startOf("week"), dayjs().endOf("week")],
  },
  {
    label: "Tháng này",
    value: [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    label: "Năm nay",
    value: [dayjs().startOf("year"), dayjs().endOf("year")],
  },
];

// TODO: move to utils and improve type and custom color
export const tagRender = (props: any) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={"#13AEDF"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
