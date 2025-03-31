import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import { days } from "./constants";
import PlusIcon from "../../../assets/plus";

export default function MobileView() {
  return (
    <Accordion
      isCompact
      selectionMode="multiple"
      variant="splitted"
      className="px-0 pt-10"
      defaultExpandedKeys={days}
    >
      {days.map((day) => (
        <AccordionItem key={day} title={day}>
          <Button
            variant="flat"
            color="primary"
            fullWidth
            startContent={<PlusIcon />}
            onClick={() => console.log(day)}
          >
            Add Meal
          </Button>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
