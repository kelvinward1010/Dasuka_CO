import { Typography } from "antd";

export function customTitle(title1: string, title2: any): JSX.Element {
  return (
    <>
      <Typography.Text>{title1}</Typography.Text>
      <br />
      <Typography.Text>{title2}</Typography.Text>
    </>
  );
}
