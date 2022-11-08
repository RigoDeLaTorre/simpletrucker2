import React, { Component } from "react";
import Datetime from "react-datetime";
import { connect } from "react-redux";

class DateTimeField extends Component {
  render() {
    const {
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
      noLabel,
      meta: { touched, error }
    } = this.props;
    return noLabel ? (
      <div
        className={`input-fields ${className} ${
          touched && error ? "has-danger" : ""
        }`}
      >
        <Datetime
          {...input}
          inputProps={{ placeholder }}
          className="form-control"
          onChange={value => input.onChange(value)}
          onBlur={onBlur}
          isDisabled={disabled}
        />

        <div className="text-help">{touched ? error : ""}</div>
      </div>
    ) : (
      <div
        className={`input-fields ${className} ${
          touched && error ? "has-danger" : ""
        }`}
      >
        <div className="label-group">
          <label className="active label-group__label">
            {" "}
            <span style={{ color: "#cc284d", marginRight: "5px" }}>
              {requiredStar}
            </span>
            {label}
          </label>
        </div>
        <Datetime
          {...input}
          options={options}
          placeholder={placeholder}
          className="form-control"
          defaultValue={defaultValue}
          // onChange={(event)=>console.log("look",input)}

          // onChange={(event)=>handleOnChange(input.name,event)}
          onChange={value => input.onChange(value)}
          onBlur={onBlur}
          isDisabled={disabled}
        />

        <div className="text-help">{touched ? error : ""}</div>
      </div>
    );
  }
}

function mapStatetoProps(state) {
  return {
    alert: state.alert,
    settings: state.settings
  };
}
export default connect(
  mapStatetoProps,
  {}
)(DateTimeField);
