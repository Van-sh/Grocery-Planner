import { Button, DateRangePicker, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { useFormik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  range: yup.object({
    start: yup.mixed<CalendarDate>().test({
      name: "is-calendardate",
      message: "Start date is required",
      test: (value) => value instanceof CalendarDate,
    }),
    end: yup
      .mixed<CalendarDate>()
      .test({
        name: "is-calendardate",
        message: "End date is required",
        test: (value) => value instanceof CalendarDate,
      })
      .test({
        name: "is-after-start-date",
        message: "End date must be on or after start date",
        test: (value, ctx) => value!.compare(ctx.parent.start) >= 0,
      }),
  }),
});

type Props = {
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (range: { start: Date; end: Date }) => void;
  planName: string;
};

export default function StartForm({ isLoading, onClose, onSubmit, planName }: Props) {
  const formatter = useDateFormatter({ dateStyle: "long" });

  const formik = useFormik({
    initialValues: {
      range: {
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 2 }),
      },
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit({
        start: values.range.start.toDate(getLocalTimeZone()),
        end: values.range.end.toDate(getLocalTimeZone()),
      });
    },
  });

  const rangeMeta = formik.getFieldMeta("range");

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <ModalHeader>Start Plan</ModalHeader>
      <ModalBody>
        <p className="text-sm text-default-500">
          Start <span className="font-semibold text-foreground">{planName}</span> for{" "}
          {formatter.formatRange(
            formik.values.range.start.toDate(getLocalTimeZone()),
            formik.values.range.end.toDate(getLocalTimeZone()),
          )}
          .
        </p>
        <DateRangePicker
          autoFocus
          label="Duration"
          aria-label="Duration the Plan will be running for"
          variant="bordered"
          name="range"
          minValue={today(getLocalTimeZone())}
          value={rangeMeta.value}
          onChange={(range) => formik.setFieldValue("range", range)}
          onBlur={() => formik.setFieldTouched("range", true)}
          isInvalid={formik.touched.range && !!formik.errors.range}
          errorMessage={
            formik.touched.range
              ? ((formik.errors.range?.start || formik.errors.range?.end) as string | undefined)
              : undefined
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
          Close
        </Button>
        <Button type="submit" color="primary" isLoading={isLoading}>
          Start Plan
        </Button>
      </ModalFooter>
    </form>
  );
}
