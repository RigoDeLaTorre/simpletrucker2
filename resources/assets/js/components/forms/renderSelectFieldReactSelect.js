import React from 'react'
import Select from 'react-select'
import { customStyles } from '../common'

const renderSelectFieldReactSelect = ({
  children,
  className,
  input,
  label,
  type,
  columnStyle,
  options,
  value,
  placeholder,
  onBlur,
  iconDisplayNone,
  defaultValue,
  iconLink,
  requiredStar,
  disabled,
  meta: { touched, error }
}) => (
  <div
    className={`input-fields ${className} ${
      touched && error ? 'has-danger' : ''
    }`}>
    <div className="label-group">
      <label className="active label-group__label">
        {' '}
        <span style={{ color: '#cc284d', marginRight: '5px' }}>
          {requiredStar}
        </span>
        {label}
      </label>
      <a
        className={`waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon ${iconDisplayNone}`}
        href={iconLink}>
        <i className="material-icons label-group__materializeIcon">add</i>
      </a>
    </div>
    <Select
      {...input}
      options={options}
      placeholder={placeholder}
      className="form-control"
      styles={customStyles}
      theme={theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          //background
          // neutral0:"white",

          //border and divider of arrow - initial
          neutral20: '#2f3c63',

          //arrow down - after its not pristine
          neutral60: '#7f64e3',

          // no options text when user searching
          neutral40: 'orange',
          //chosen field on dropdown from previous
          primary: '#7f64e3',

          //highlight at hover
          primary25: '#e0d8fe',
          //Placeholder
          neutral50: '#8c8bcc',

          //selectd value text color
          neutral80: 'rgba(0,0,0,0.87)',
          //hover over container
          neutral30: '#7f64e3'

          // neutral5:"#dd4c4c",
          // neutral10:"#dd4c4c",
          //
          // primay50:"#dd4c4c",
          // neutral70:"#dd4c4c",
          // neutral90:"#dd4c4c"
        }
      })}
      selected={value}
      defaultValue={defaultValue}
      // onChange={(event)=>console.log("look",input)}

      // onChange={(event)=>handleOnChange(input.name,event)}
      onChange={value => input.onChange(value)}
      onBlur={onBlur}
      isDisabled={disabled}
    />

    <div className="text-help">{touched ? error : ''}</div>
  </div>
)

export { renderSelectFieldReactSelect }
