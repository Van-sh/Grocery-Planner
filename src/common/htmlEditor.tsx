import { FormikProps } from "formik";
import { memo, useCallback, useEffect, useState } from "react";
import RawEditor, { ContentEditableEvent } from "react-simple-wysiwyg";

const Editor = memo(RawEditor);

type Props<T> = {
  formik: FormikProps<T>;
  name: keyof T & string;
  placeholder?: string;
};

export default function HTMLEditor<T>({ formik, name, placeholder }: Props<T>) {
  const { setFieldValue, setFieldTouched } = formik;
  const formikValue = (formik.values[name] as string) || "";
  const [localValue, setLocalValue] = useState<string>(formikValue);

  useEffect(() => {
    if (localValue === formikValue) return;
    const timer = setTimeout(() => {
      setFieldValue(name, localValue);
    }, 200);

    return () => clearTimeout(timer);
  }, [localValue, name, formikValue, setFieldValue]);

  // Listen to external Formik changes (e.g., async API data loading)
  useEffect(() => {
    if (formikValue !== localValue) {
      setLocalValue(formikValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikValue]);

  const handleChange = useCallback((event: ContentEditableEvent) => {
    setLocalValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, [setFieldTouched, name]);

  return (
    <Editor
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
    />
  );
}
