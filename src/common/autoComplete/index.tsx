import { Input, SlotsToClasses } from "@nextui-org/react";
import { useMemo, useState } from "react";
import DownChevron from "../../assets/downChevron";

type Option = {_id: string, name: string}

type Props = {
  label?: React.ReactNode;
  placeholder?: string;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement> & ((e: React.FocusEvent<Element, Element>) => void);
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  onSelect?: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
  classNames?: SlotsToClasses<
    | "description"
    | "base"
    | "input"
    | "label"
    | "errorMessage"
    | "mainWrapper"
    | "inputWrapper"
    | "innerWrapper"
    | "clearButton"
    | "helperWrapper"
  >;
  options: string[] | Option[];
};

export default function Autocomplete({
  label,
  placeholder,
  variant,
  name,
  onBlur,
  onChange,
  value = "",
  onSelect,
  isInvalid,
  errorMessage,
  classNames,
  options
}: Props) {
  const cleanOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { _id: option, name: option } : option,
      ),
    [options],
  );

  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Option[]>(cleanOptions);
  const [hover, setHover] = useState<false | number>(false);
  const [selected, setSelected] = useState<false | number>(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBlur = (e: React.FocusEvent<Element, Element>) => {
    setTimeout(() => {
      onBlur && onBlur(e);
      setSuggestions(cleanOptions);
      setHover(false);
      setShowDropdown(false);
    }, 250);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onChange && onChange(e);

    if (value.length > 0) {
      const filteredSuggestions = cleanOptions.filter(suggestion => suggestion.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(cleanOptions);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let keyCode = e.keyCode || e.which;
    let hover1: false | number = false;
    let selected1: false | number = false;

    keyCode !== 39 && keyCode !== 13 && setShowDropdown(true);

    if (suggestions.length) {
      switch (keyCode) {
        case 38: // Up
          if (hover === false || hover - 1 < 0) {
            hover1 = suggestions.length - 1;
          } else {
            hover1 = hover - 1;
          }
          break;

        case 40: // Down
          if (hover === false || hover + 1 >= suggestions.length) {
            hover1 = 0;
          } else {
            hover1 = hover + 1;
          }
          break;

        case 39: // Right
        case 13: // Enter
          if (hover !== false) {
            selected1 = hover;
          }
          break;
      }

      if (selected1 === false) {
        setSelected(false);
        setHover(hover1);
      } else {
        select(selected1);
      }
    }
  };

  const select = (index: number) => {
    setInputValue(suggestions[index].name);
    setSuggestions(cleanOptions);
    setSelected(false);
    setShowDropdown(false);
    onSelect && onSelect(suggestions[index]._id);
  };

  return (
    <div className="relative">
      <Input
        label={label}
        placeholder={placeholder}
        variant={variant}
        type="text"
        name={name}
        onClick={() => setShowDropdown(true)}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        onFocus={() => setShowDropdown(true)}
        isInvalid={isInvalid}
        classNames={classNames}
        value={inputValue}
        endContent={<DownChevron />}
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 rounded-large bg-content1 shadow-medium p-1 overflow-hidden"
          style={{ zIndex: 10000 }}
        >
          <div className="overflow-y-auto max-h-52">
            <ul className="p-1">
              {suggestions.map((suggestion, index) => (
                <li
                  className="flex gap-2 items-center justify-between px-2 py-1.5 rounded-small cursor-pointer data-[hover=true]:transition-colors data-[hover=true]:bg-default data-[hover=true]:text-default-foreground"
                  data-hover={hover === index || (hover === false && selected === index)}
                  key={suggestion._id}
                  onClick={() => select(index)}
                  onMouseOver={() => setHover(index)}
                >
                  <span className="flex-1 text-small font-normal truncate">{suggestion.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isInvalid && errorMessage && <div className="p-1 text-tiny text-danger">{errorMessage}</div>}
    </div>
  );
}
