import React, { Component } from "react";

class dropDownSelectState extends Component {
  renderSelectOptions = person => (
    <option key={person} value={person}>
      {person}
    </option>
  );

  render() {
    const { input, label } = this.props;
    return (
      <div>
        {/* <label htmlFor={label}>{label}</label> */}
        <select {...input}>
          <option value="">Select</option>
          {this.props.people.map(this.renderSelectOptions)}
        </select>
      </div>
    );
  }
}

export { dropDownSelectState };
