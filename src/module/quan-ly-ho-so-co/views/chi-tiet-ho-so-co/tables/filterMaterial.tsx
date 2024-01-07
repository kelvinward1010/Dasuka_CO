import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, InputRef, Space } from "antd";
import { ColumnType } from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import _ from "lodash";
import { Dispatch, RefObject, SetStateAction } from "react";

interface Props {
  dataIndex: any;
  title: string;
  searchInput: RefObject<InputRef>;
  setCurrentData: Dispatch<SetStateAction<any[]>>;
  originData: any[];
}

interface PropsLazy {
  dataOrigin: any[];
  currentData: any[];
  setCurrentData: Dispatch<SetStateAction<any[]>>;
  id?: string;
}

export default function filterMaterial({
  dataIndex,
  title,
  searchInput,
  setCurrentData,
  originData = [],
}: Props) {
  const handleSearch = (confirm: (param?: FilterConfirmProps) => void) => {
    if (!searchInput?.current?.input?.value)
      setCurrentData(_.slice(originData, 0, 10));
    else setCurrentData(originData);
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: any,
    title: string,
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  return getColumnSearchProps(dataIndex, title);
}

export function lazyLoadingTable({
  dataOrigin,
  currentData,
  setCurrentData,
  id,
}: PropsLazy) {
  const node = document.querySelector<HTMLElement>(`#${id} .ant-table-body`);
  if (node) {
    const handleScroll = () => {
      if (dataOrigin?.length > currentData?.length) {
        const perC =
          (node.scrollTop / (node.scrollHeight - node.clientHeight)) * 100;
        if (perC >= 100) {
          setCurrentData((prev) => _.slice(dataOrigin, 0, prev.length + 5));
        }
      }
    };
    node.addEventListener("scroll", handleScroll);

    return () => node.removeEventListener("scroll", handleScroll);
  }
}
