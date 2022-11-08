import React from 'react'

const renderTextArea = ({
  className,
  labelClass,
  input,
  label,
  type,
  disabled,
  meta: { touched, error }
}) => (
  <div className={`input-field textarea ${className} `}>
    <h4 className={labelClass}>{label}</h4>
    <textarea
      className="form-control materialize-textarea white-text"
      autoComplete="new-password"
      type={type}
      {...input}
      disabled={disabled}
    />
    <div className="text-help">{touched ? error : ''}</div>
  </div>
)

export { renderTextArea }
