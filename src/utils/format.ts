export const formatNumber = (value: any) =>
  `${value}`.replace(/\B(?<!\.\d)(?=(\d{3})+(?!\d))/g, ",");

export const formatOnlyNumber = (value: string): number =>
  Number(`${value}`.replace(/[^0-9.-]/g, ""));

export const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " năm trước";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " tháng trước";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " ngày trước";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " giờ trước";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " phút trước";
  }

  if (seconds < 10) return "Vừa xong";

  return Math.floor(seconds) + " giây trước";
};
