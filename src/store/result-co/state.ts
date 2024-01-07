import { selector } from "recoil";

import {
  ResultCcAddState, // ResultCcState,
  ResultCthAddState,
  ResultCthState,
  ResultCtshAddState,
  ResultCtshState,
  ResultLvcAddState,
  ResultLvcDetailState,
  ResultPeAddState,
  ResultPeDetailState,
  ResultRvcAddState,
  ResultRvcDetailState,
  ResultWoAKAddState,
  ResultWoAKDetailState,
  ResultWoAddState,
  ResultWoDetailState,
} from "./atom";

export const resultlvcdetail: any = selector({
  key: "resultlvcdetail",
  get: ({ get }) => {
    const resultlvcdetail = get(ResultLvcDetailState);
    return resultlvcdetail;
  },
});

export const resultrvcdetail: any = selector({
  key: "resultrvcdetail",
  get: ({ get }) => {
    const resultrvcdetail = get(ResultRvcDetailState);
    return resultrvcdetail;
  },
});

// export const resultcc: any = selector({
//   key: "resultcc",
//   get: ({ get }) => {
//     const resultcc = get(ResultCcState);
//     return resultcc;
//   },
// });

export const resultcth: any = selector({
  key: "resultcth",
  get: ({ get }) => {
    const resultcth = get(ResultCthState);
    return resultcth;
  },
});

export const resultctsh: any = selector({
  key: "resultctsh",
  get: ({ get }) => {
    const resultctsh = get(ResultCtshState);
    return resultctsh;
  },
});

export const resultwodetail: any = selector({
  key: "resultwodetail",
  get: ({ get }) => {
    const resultwodetail = get(ResultWoDetailState);
    return resultwodetail;
  },
});

export const resultwoakdetail: any = selector({
  key: "resultwoakdetail",
  get: ({ get }) => {
    const resultwoakdetail = get(ResultWoAKDetailState);
    return resultwoakdetail;
  },
});

export const resultpedetail: any = selector({
  key: "resultpedetail",
  get: ({ get }) => {
    const resultpedetail = get(ResultPeDetailState);
    return resultpedetail;
  },
});

// ++++++++++++++++++

export const resultlvcadd: any = selector({
  key: "resultlvcadd",
  get: ({ get }) => {
    const resultlvcadd = get(ResultLvcAddState);
    return resultlvcadd;
  },
});

export const resultrvcadd: any = selector({
  key: "resultrvcadd",
  get: ({ get }) => {
    const resultrvcadd = get(ResultRvcAddState);
    return resultrvcadd;
  },
});

export const resultccadd: any = selector({
  key: "resultccadd",
  get: ({ get }) => {
    const resultccadd = get(ResultCcAddState);
    return resultccadd;
  },
});

export const resultcthadd: any = selector({
  key: "resultcthadd",
  get: ({ get }) => {
    const resultcthadd = get(ResultCthAddState);
    return resultcthadd;
  },
});

export const resultctshadd: any = selector({
  key: "resultctshadd",
  get: ({ get }) => {
    const resultctshadd = get(ResultCtshAddState);
    return resultctshadd;
  },
});

export const resultwoadd: any = selector({
  key: "resultwoadd",
  get: ({ get }) => {
    const resultwoadd = get(ResultWoAddState);
    return resultwoadd;
  },
});

export const resultwoakadd: any = selector({
  key: "resultwoakadd",
  get: ({ get }) => {
    const resultwoakadd = get(ResultWoAKAddState);
    return resultwoakadd;
  },
});

export const resultpeadd: any = selector({
  key: "resultpeadd",
  get: ({ get }) => {
    const resultpeadd = get(ResultPeAddState);
    return resultpeadd;
  },
});
