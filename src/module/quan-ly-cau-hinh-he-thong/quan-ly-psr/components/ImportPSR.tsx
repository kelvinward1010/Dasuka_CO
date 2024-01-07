import { Button, Upload, UploadProps, notification } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useImportPSR } from "../api/importPSR";

interface Props {
  setData: Dispatch<SetStateAction<any[]>>;
}

export default function ImportPSR({ setData }: Props): JSX.Element {
  const [file, setFile] = useState<File | null>();

  const importPSR = useImportPSR({
    config: {
      onSuccess(data) {
        if (data.success) {
          setData(data.data);
          setFile(null);
        } else {
          notification.error(data.message);
        }
      },
      onError(error) {
        notification.error({ message: error.response?.data.message });
      },
    },
  });

  useEffect(() => {
    if (file) {
      importPSR.mutate({ file: file });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const uploadProps: UploadProps = {
    showUploadList: false,
    beforeUpload(file) {
      setFile(file);
    },
    accept: ".xlsx",
  };

  return (
    <>
      <Upload {...uploadProps} disabled={importPSR.isLoading}>
        <Button
          loading={importPSR.isLoading}
          className="button button_import"
          style={{ width: "100%" }}
        >
          Import PSR
        </Button>
      </Upload>
    </>
  );
}
