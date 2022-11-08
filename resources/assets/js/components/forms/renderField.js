import React from 'react'

const renderField = ({
  className,
  input,
  label,
  type,
  labelClass,
  columnStyle,
  requiredStar,
  disabled,
  meta: { touched, error }
}) =>
  columnStyle === 'true' ? (
    <div className={`input ${className} `}>
      <div className="input-group">
        <label className='active'>
          <span style={{ color: '#cc284d', marginRight: '5px' }}>
            {requiredStar}
          </span>
          {label}
        </label>
        <input
          className="form-control"
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          type={type}
          disabled={disabled}
          {...input}
        />
      </div>
      <div className="text-help">{touched ? error : ''}</div>
    </div>
  ) : (
    <div className={`input-field ${className} `}>
      <label className='active'>
        <span style={{ color: '#cc284d', marginRight: '5px' }}>
          {requiredStar}
        </span>
        {label}
      </label>
      <input
        className="form-control"
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type={type}
        disabled={disabled}
        {...input}
      />
      <div className="text-help">{touched ? error : ''}</div>
    </div>
  )

export { renderField }
