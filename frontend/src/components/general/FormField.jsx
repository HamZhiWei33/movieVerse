import React, { useState, useId, useRef } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const FormField = ({ type, name, label, value, onChange }) => {
  const id = useId();
  const inputRef = useRef();

  var btnClicked = false;

  const isPassword = type === "password";

  const [visible, setVisible] = useState(false);

  const focusInput = () => {
    if (!btnClicked) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="form-field" onClick={focusInput}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={isPassword && visible ? "text" : type}
        onChange={onChange}
        value={value}
        placeholder=" "
        autoComplete="off"
        required
      />
      <label htmlFor={id}>{label}</label>

      {isPassword && (
        <button
          type="button"
          onClick={() => {
            btnClicked = true;
            setVisible(!visible);
          }}
        >
          {visible ? (
            <VisibilityIcon size={20} />
          ) : (
            <VisibilityOffIcon size={20} />
          )}
        </button>
      )}
    </div>
  );
};

export default FormField;
