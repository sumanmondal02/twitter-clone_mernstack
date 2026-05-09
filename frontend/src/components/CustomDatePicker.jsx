import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as s from "../styles/common";

function CustomDatePicker({ value, onChange }) {

  return (
    <div className={s.authInputWrap}>

      <label className={s.authInputLabel}>
        Date of Birth
      </label>

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date)}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        onKeyDown={(e) => e.preventDefault()}
        placeholderText=""
        wrapperClassName="w-full"
        className={s.authInputField}
      />

    </div>
  );
}

export default CustomDatePicker;