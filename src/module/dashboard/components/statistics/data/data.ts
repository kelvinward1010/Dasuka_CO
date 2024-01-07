import {
  IconDocuments,
  IconPackages,
  IconPapers,
  IconStaff,
  IconUsers,
} from "@/assets/svg";
import {
  danhSachKHUrl,
  danhSachNDUrl,
  danhSachSpUrl,
  materialReportUrl,
  quanLyHoSoCOUrl,
} from "@/urls";

export const dataStatistic = {
  customer: {
    value: 50,
  },
  co: {
    value: 1523,
  },
  product: {
    value: 1200,
  },
  material: {
    value: 5680,
  },
  employee: {
    value: 20,
  },
};

export const colorStatistic = {
  customer: {
    // title: "Khách hàng",
    linkTo: danhSachKHUrl,
    title: "total_customer",
    color: "#1890FF",
    icon: IconUsers,
  },
  co_document: {
    // title: "Hồ sơ CO",
    linkTo: quanLyHoSoCOUrl,
    title: "total_co_document",
    color: "#13AEDF",
    icon: IconDocuments,
  },
  product: {
    // title: "Sản phẩm",
    linkTo: danhSachSpUrl,
    title: "total_product",
    color: "#3AA966",
    icon: IconPackages,
  },
  material: {
    // title: "Nguyên vật liệu",
    linkTo: materialReportUrl,
    title: "total_material",
    color: "#F4AA3A",
    icon: IconPapers,
  },
  employee: {
    // title: "Nhân viên",
    linkTo: danhSachNDUrl,
    title: "total_employee",
    color: "#17CCB6",
    icon: IconStaff,
  },
};
