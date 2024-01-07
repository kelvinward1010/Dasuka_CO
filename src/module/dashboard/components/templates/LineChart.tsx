import { Line, LineConfig } from "@ant-design/plots";
import { useTranslation } from "react-i18next";

import { color } from "../../config/data";

export default function LineChart({
  data,
  isLegend,
  isColor,
  isMulti,
  loading = true,
}: any): JSX.Element {
  const { t } = useTranslation();

  const config: LineConfig = {
    data: [
      ...data?.map((item: any) => ({
        ...item,
        year: item.month + "/" + item.year,
      })),
    ].sort((a, b) => {
      const nameA = new Date("01/" + a.year); // ignore upper and lowercase
      const nameB = new Date("01/" + b.year); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    }),
    xField: "year",
    yField: "quantity",
    seriesField: isMulti ? "category" : "",
    color: isColor
      ? ({ category }: any) => {
          if (category === t("dashboard.document_co.done"))
            return color.listThree[0];
          else if (category === t("dashboard.document_co.edited"))
            return color.listThree[1];
          return color.listThree[2];
        }
      : "#1890FF",
    loading,
    xAxis: {
      tickCount: 10,
      // max: 20,
    },
    yAxis: {
      nice: true,
      // max,
      minTickInterval: 500,
      min: 0,
    },
    slider: {
      start: 0,
      end: 0.5,
    },
    // point: {
    //   size: 4,
    //   shape: "circle",
    // },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    legend: isLegend
      ? {
          marker: {
            symbol: "circle",
            style: {
              r: 4,
            },
            spacing: 4,
          },
          label: {
            style: {
              fontSize: 12,
              fontWeight: 600,
            },
          },
          itemSpacing: 5,
        }
      : false,
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return <Line {...config} />;
}
