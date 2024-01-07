export const getTitle = (criteria: string = "ctc") => {
  const title = {
    default: {
      left: "Trong nước",
      right: "Nước ngoài",
    },
    ctc: {
      left: "(Có xuất xứ)",
      right: "(Không xuất xứ)",
    },
    lvc: {
      left: "(Có xuất xứ)",
      right: "(Không xuất xứ)",
    },
    rvc: {
      left: "(Có xuất xứ FTA)",
      right: "(Không xuất xứ FTA)",
    },
  };
  if (criteria) {
    switch (criteria) {
      case "ctc":
        return title.ctc;
      case "lvc":
        return title.lvc;
      case "rvc":
        return title.rvc;
      default:
        return title.default;
    }
  }
};
