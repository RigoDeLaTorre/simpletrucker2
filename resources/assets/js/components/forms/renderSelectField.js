import React from "react";

const renderSelectField = ({
  children,
  className,
  input,
  label,
  type,
  columnStyle,
  meta: { touched, error }
}) => (
  columnStyle ==="true" ?   <div
      className={`input ${className} ${touched && error ? 'has-danger' : ''}`}>
      <div className="input-group">
        <label className={touched ? 'active' : ''}>{label}</label>
        <select className="form-control" {...input}>
          {children}
        </select>
      </div>
      <div className="text-help">{touched ? error : ''}</div>
    </div> : <div
    className={`input-field ${className} ${
      touched && error ? "has-danger" : ""
    }`}
  >
    <label className="active">{label}</label>
    <select className="form-control" {...input}>
      {children}
    </select>
    <div className="text-help">{touched ? error : ""}</div>
  </div>
);

export { renderSelectField };
