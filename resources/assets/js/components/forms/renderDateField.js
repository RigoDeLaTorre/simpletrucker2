import React from "react";

const renderDateField = ({
  dateField,
  className,
  input,
  label,
  type,
  noLabel,
  requiredStar,
  meta: { touched, error }
}) =>
  noLabel ? (
    <div
      className={`input-field ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <input
        className={`form-control ${dateField}`}
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type={type}
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  ) : (
    <div
      className={`input-field inline ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <label className="active">
        <span style={{ color: "#cc284d", marginRight: "5px" }}>
          {requiredStar}
        </span>
        {label}
      </label>
      <input
        className={`form-control ${dateField}`}
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type={type}
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

export { renderDateField };
