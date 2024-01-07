import { Button, Modal } from "antd";
import * as React from "react";

import { useDisclosure } from "@/hooks/useDisclosure";

import styles from "./index.module.scss";

interface Props {
  triggerButton: React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body: React.ReactElement;
  cancelButtonText?: string;
  isDone?: boolean;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  triggerButton,
  confirmButton,
  title,
  body,
  isDone,
  isLoading,
}: Props): JSX.Element {
  const { close, open, isOpen } = useDisclosure();

  React.useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  const trigger = React.cloneElement(triggerButton, {
    onClick: open,
  });

  const confirm = React.cloneElement(confirmButton, {
    key: "confirm",
  });

  return (
    <>
      {trigger}
      <Modal
        title={title}
        open={isOpen}
        onCancel={close}
        footer={[
          confirm,
          <Button key="back" onClick={close}>
            Không
          </Button>,
        ]}
        className={styles.confirmation_dialog}
        confirmLoading={isLoading}
      >
        {body}
      </Modal>
    </>
  );
}
