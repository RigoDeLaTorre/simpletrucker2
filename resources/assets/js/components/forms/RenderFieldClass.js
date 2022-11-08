import React, { Component } from 'react'
import { connect } from 'react-redux'
class RenderFieldClass extends Component {
  render() {
    const {
      className,
      input,
      label,
      type,
      labelClass,
      columnStyle,
      requiredStar,
      disabled,
      themeLight,
      meta: { touched, error }
    } = this.props

    return columnStyle === 'true' ? (
      <div className={`input ${className} `}>
        <div className="input-group">
          <label
            className={
              this.props.alert ? 'active label--themeLight' : 'active'
            }>
            <span style={{ color: '#cc284d', marginRight: '5px' }}>
              {requiredStar}
            </span>
            {label}
          </label>
          <input
            className={
              this.props.alert ? 'form-control themeLight' : 'form-control'
            }
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
        <label
          className={this.props.alert ? 'active label--themeLight' : 'active'}>
          <span style={{ color: '#cc284d', marginRight: '5px' }}>
            {requiredStar}
          </span>
          {label}
        </label>
        <input
          className={
            this.props.alert ? 'form-control themeLight' : 'form-control'
          }
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
  }
}

function mapStatetoProps(state) {
  return {
    alert: state.alert
  }
}
export default connect(
  mapStatetoProps,
  {}
)(RenderFieldClass)
