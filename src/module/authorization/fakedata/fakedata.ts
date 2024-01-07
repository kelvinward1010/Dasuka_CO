import { DataNode } from "antd/es/tree";

export const data: DataNode[] = [
  {
    key: "1",
    value: "1",
    title: "Dashboard",
    level: 1,
    isLeaf: true,
  },
  {
    key: "2",
    value: "2",
    title: "Quản lý tờ khai",
    children: [
      {
        key: "21",
        value: "21",
        title: "Danh sách tờ khai nhập",
        isLeaf: true,
      },
      {
        key: "22",
        value: "22",
        title: "Danh sách tờ khai xuất",
        isLeaf: true,
      },
    ],
  },
  {
    key: "3",
    value: "3",
    title: "Quản lý tờ khai",
    children: [
      {
        key: "31",
        value: "31",
        title: "Danh sách tờ khai nhập",
        children: [
          {
            key: "311",
            value: "311",
            title: "Danh sách hở?",
            isLeaf: true,
          },
          {
            key: "312",
            value: "312",
            title: "Danh sách hở?",
            isLeaf: true,
          },
          {
            key: "313",
            value: "313",
            title: "Danh sách hở?",
            children: [
              {
                key: "3131",
                value: "3131",
                title: "Danh book ưh",
              },
              {
                key: "3132",
                value: "3132",
                title: "Danh book ưh",
              },
              {
                key: "3133",
                value: "3133",
                title: "Danh book ưh",
              },
              {
                key: "3134",
                value: "3134",
                title: "Danh book ưh",
              },
              {
                key: "3135",
                value: "3135",
                title: "Danh book ưh",
              },
              {
                key: "3136",
                value: "3136",
                title: "Danh book ưh",
              },
              {
                key: "3137",
                value: "3137",
                title: "Danh book ưh",
              },
              {
                key: "3138",
                value: "3138",
                title: "Danh book ưh",
              },
            ],
          },
        ],
      },
      {
        key: "32",
        value: "32",
        title: "Danh sách tờ khai xuất",
        isLeaf: true,
      },
    ],
  },
].sort((a, b) => {
  const nameA = a?.title?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.title?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) return -1;

  if (nameA > nameB) return 1;

  // names must be equal
  return 0;
});

export const dataActions = [
  {
    action_code: "ADD",
    action_name: "Thêm mới",
    function_id: "1",
  },
  {
    action_code: "UPDATE",
    action_name: "Chỉnh sửa",
    function_id: "1",
  },
  {
    action_code: "DELETE",
    action_name: "Xóa",
    function_id: "1",
  },
  {
    action_code: "ADD",
    action_name: "Thêm mới",
    function_id: "2",
  },
];

export const dataUsers = [
  {
    user_id: "1",
    user_name: "1029922",
    full_name: "Hung Van",
    description: "Truong Phong",
    roles: [
      {
        role_id: "1",
        role_name: "Admin",
      },
      {
        role_id: "2",
        role_name: "Truong Phong",
      },
    ],
  },
  {
    user_id: "2",
    user_name: "1029922",
    full_name: "Hung Van",
    description: "Nhan vien",
    roles: [
      {
        role_id: "3",
        role_name: "Nhan Vien",
      },
    ],
  },
  {
    user_id: "3",
    user_name: "1029922",
    full_name: "Hung Van",
    description: "Nhan vien",
    roles: [
      {
        role_id: "3",
        role_name: "Nhan Vien",
      },
    ],
  },
  {
    user_id: "4",
    user_name: "1029922",
    full_name: "Hung Van",
    description: "Nhan vien",
    roles: [
      {
        role_id: "3",
        role_name: "Nhan Vien",
      },
    ],
  },
  {
    user_id: "5",
    user_name: "1029922",
    full_name: "Hung Van",
    description: "Nhan vien",
    roles: [
      {
        role_id: "3",
        role_name: "Nhan Vien",
      },
    ],
  },
];

export const dataRoles = [
  {
    role_id: "1",
    role_code: "Admin",
    role_name: "Administrator",
    description: "",
  },
  {
    role_id: "2",
    role_code: "Truong Phong",
    role_name: "Truong Phong",
    description: "",
  },
  {
    role_id: "3",
    role_code: "Nhan Vien",
    role_name: "Nhan Vien",
    description: "",
  },
];
