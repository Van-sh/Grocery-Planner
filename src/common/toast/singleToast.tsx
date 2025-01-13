import { Button } from "@nextui-org/react";
import { semanticColors } from "@nextui-org/theme";
import ExclamationCircleSolid from "../../assets/exclamationCircleSolid";
import TickCircleSolid from "../../assets/tickCircleSolid";
import XCircleSolid from "../../assets/xCircleSolid";
import XMark from "../../assets/xMark";

type Props = {
  message: string;
  type?: "success" | "error" | "info";
  index?: number; // if there are multiple toasts on screen, then index of this toast
  onClose: () => void;
};

export default function SingleToast({ message, type = "info", index = 0, onClose }: Props) {
  const iconMap = {
    info: <ExclamationCircleSolid fill={semanticColors.light.primary[500]} />,
    error: <XCircleSolid fill={semanticColors.light.danger[500]} />,
    success: <TickCircleSolid fill={semanticColors.light.success[500]} />
  };

  return (
    <div
      className={`bg-white p-6 shadow-md rounded-lg relative opacity-95 hover:opacity-100${index ? " mt-2" : ""} animate-toast-in-left transition-toast`}
      role="alert"
    >
      <div className="flex gap-4 items-start">
        <div className="w-6 h-6">{iconMap[type]}</div>
        <p>{message}</p>
      </div>
      <Button className="absolute top-2 right-2 p-0 h-4 w-4 min-w-4" isIconOnly size="sm" variant="light" onClick={onClose}>
        <span className="h-4 w-4">
          <XMark />
        </span>
      </Button>
    </div>
  );
}
