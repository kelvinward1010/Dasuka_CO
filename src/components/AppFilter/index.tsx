/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Form, Row, Select } from "antd";
import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { SESSION_CUSTOMER, SESSION_EMPLOYEE } from "@/constant/config";
import { ACCESSES, checkAccess } from "@/lib/access";
import { useDropdownQLKH } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-khach-hang/api/getDropdownQLKH";
import { useQLKHLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-khach-hang/api/getQLKH";
import { useDropdownQLND } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung/api/getDropdownQLND";
import { useQLNDLazy } from "@/module/quan-ly-cau-hinh-he-thong/quan-ly-nguoi-dung/api/getQlND";
import { getUserSelector } from "@/store/auth/state";
import { IBaseDropdown } from "@/types";
import { sessionService } from "@/utils/storage";

import { customerState, staffState } from "./index.atom";
import styles from "./index.module.scss";

interface Props {
  isCustomer?: boolean;
  isStaff?: boolean;
  hasAll?: boolean;
  isDisabled?: boolean;
  exact?: boolean;
  setSearchContent?: Dispatch<SetStateAction<string>>;
}

export function AppFilter({
  isCustomer = false,
  isStaff = false,
  hasAll = true,
  isDisabled = false,
  exact = false,
  setSearchContent,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const [customer, setCustomer] = useRecoilState(customerState);
  const [staff, setStaff] = useRecoilState(staffState);
  const [staffOptions, setStaffOptions] = useState<IBaseDropdown>([]);
  const [customerOptions, setCustomerOptions] = useState<IBaseDropdown>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const userRecoil = useRecoilValue(getUserSelector);

  const dropdownCustomer = useDropdownQLKH({
    config: {
      enabled: isCustomer,
      onSuccess: (data) => {
        if (data && data.length > 0) setCustomerOptions(data);
      },
    },
  });
  const dropdownStaff = useDropdownQLND({
    config: {
      enabled: isStaff || !checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN),
      onSuccess: (data) => {
        if (data && data.length > 0) setStaffOptions(data);
      },
    },
  });
  const getStaffLazy = useQLNDLazy({});
  const getCustomerLazy = useQLKHLazy({});

  const resetSearchParams = () => {
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";

    searchParams.delete("searchContent");
    searchParams.delete("pageIndex");
    searchParams.delete("pageSize");
    searchParams.delete("status");
    searchParams.delete("exact");
    searchParams.set("fromDate", fromDate);
    searchParams.set("toDate", toDate);
    setSearchContent?.("");
    setSearchParams(searchParams);
  };

  const handleChangeCustomer = async (value: string) => {
    resetSearchParams();
    const dataSelected = dropdownCustomer?.data?.find(
      (i) => i.value === value,
    ) ?? {
      label: "",
      value: "",
      tax_code: "",
      processing_fee: -1,
    };
    sessionService.setStorage(SESSION_CUSTOMER, dataSelected);
    setCustomer(dataSelected);

    if (checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN)) {
      if (value) {
        const customerWithStaff = await getCustomerLazy.mutateAsync({
          id: value,
        });
        const checkExistEmployee = customerWithStaff?.employee_ids?.find(
          (e) => e.employee_id === staff.value,
        );

        const dataStaff =
          customerWithStaff.employee_ids?.length === 1
            ? {
                label: checkExistEmployee
                  ? checkExistEmployee.employee_name
                  : "",
                value: checkExistEmployee ? checkExistEmployee.employee_id : "",
              }
            : _.clone(staff);

        sessionService.setStorage(SESSION_EMPLOYEE, staff);

        setStaff(dataStaff);
      } else {
        // setStaff({
        //   label: "",
        //   value: "",
        // });
      }
    }
  };

  const handleChangeStaff = async (value: string) => {
    searchParams.delete("exact");
    setSearchParams(searchParams);
    const dataSelected = dropdownStaff?.data?.find(
      (i) => i.value === value,
    ) ?? {
      label: "",
      value: "",
    };
    setStaff(dataSelected);
    sessionService.setStorage(SESSION_EMPLOYEE, dataSelected);

    if (value) {
      const staffWithCustomer = await getStaffLazy.mutateAsync({
        id: value,
      });
      const customerCurrent = staffWithCustomer.employee_customer?.find(
        (i) => i.customer_id === customer.value,
      );

      const dataCustomer = customerCurrent
        ? {
            label: customerCurrent?.customer_name ?? "",
            value: customerCurrent?.customer_id ?? "",
            tax_code: customerCurrent?.tax_code ?? "",
            processing_fee: customerCurrent?.processing_fee ?? -1,
          }
        : {
            label:
              staffWithCustomer?.employee_customer?.[0]?.customer_name ?? "",
            value: staffWithCustomer?.employee_customer?.[0]?.customer_id ?? "",
            tax_code: staffWithCustomer?.employee_customer?.[0]?.tax_code ?? "",
            processing_fee:
              staffWithCustomer?.employee_customer?.[0]?.processing_fee ?? -1,
          };

      sessionService.setStorage(SESSION_CUSTOMER, dataCustomer);

      setCustomer(dataCustomer);
    } else {
      // setCustomer({
      //   label: "",
      //   value: "",
      // });
    }
  };

  useEffect(() => {
    if (exact && customer.value && staff.value) {
      setCustomer({
        label: t("for_all.all"),
        value: "",
        processing_fee: -1,
        tax_code: "",
      });
      setStaff({ label: t("for_all.all"), value: "" });
    }
  }, [exact, customer, staff]);

  useEffect(() => {
    if (customer.value && isCustomer) {
      (async () => {
        const customers = await getCustomerLazy.mutateAsync({
          id: customer.value,
        });
        setStaffOptions(
          customers.employee_ids?.map((i) => ({
            label: i.employee_name,
            value: i.employee_id,
          })),
        );
      })();
    } else {
      setStaffOptions(dropdownStaff?.data ?? []);
    }
  }, [customer.value, isCustomer]);

  const { id } = useParams(); // Get id of co document

  useEffect(() => {
    if (
      (staff.value && isStaff) ||
      !checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN)
    ) {
      (async () => {
        const currentCustomer = sessionService.getStorage(SESSION_CUSTOMER);

        const staffs = await getStaffLazy.mutateAsync({
          id: staff.value || userRecoil.user_name,
        });
        if (staffs.employee_customer) {
          setCustomerOptions(
            staffs.employee_customer.map((i) => ({
              label: i.customer_name,
              value: i.customer_id,
            })),
          );
          // Set default customer if not choose before or not in co detail page
          if (!id && currentCustomer?.value) {
            setCustomer(currentCustomer);
            return;
          }

          if (!customer.value && !id) {
            setCustomer({
              label: staffs?.employee_customer[0]?.customer_name,
              value: staffs?.employee_customer[0]?.customer_id,
              tax_code: staffs?.employee_customer[0]?.tax_code || "",
              processing_fee: staffs?.employee_customer?.[0]?.processing_fee,
            });
          }
        }
      })();
    } else {
      setCustomerOptions(dropdownCustomer?.data ?? []);
    }
  }, [staff.value, isStaff]);

  useEffect(() => {
    // Set default staff
    const currentStaff = sessionService.getStorage(SESSION_EMPLOYEE);
    if (
      checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN) &&
      !id &&
      currentStaff?.value
    ) {
      setStaff(currentStaff);
      return;
    }
    if (userRecoil) {
      setStaff({
        value: userRecoil.user_name,
        label: userRecoil.full_name,
      });
    }
  }, [userRecoil?.user_name]);

  const optionsDropdownCustomer = customerOptions
    ? hasAll
      ? [{ label: t("for_all.all"), value: "" }, ...[...customerOptions]]
      : customerOptions
    : [];

  const optionsDropdownStaff = staffOptions
    ? hasAll
      ? [{ label: t("for_all.all"), value: "" }, ...[...staffOptions]]
      : staffOptions
    : [];

  return (
    <div className={styles.filter}>
      <Form layout="inline">
        <Row align="middle" className={styles.row}>
          <Col span={10}>
            {isCustomer && (
              <Form.Item label="Khách hàng đang làm việc">
                <Select
                  disabled={isDisabled}
                  showSearch
                  value={customer.value}
                  onChange={handleChangeCustomer}
                  loading={dropdownCustomer?.isLoading}
                  options={optionsDropdownCustomer}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            )}
          </Col>
          {checkAccess(ACCESSES.CO_EMPLOYEE_DROPDOWN) && (
            <Col span={5} push={9}>
              {isStaff && (
                <Form.Item label="Nhân viên">
                  <Select
                    value={staff.value}
                    onChange={handleChangeStaff}
                    loading={dropdownStaff?.isLoading}
                    options={optionsDropdownStaff}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}
            </Col>
          )}
          {!isStaff && !isCustomer && <Form.Item></Form.Item>}
        </Row>
      </Form>
    </div>
  );
}
