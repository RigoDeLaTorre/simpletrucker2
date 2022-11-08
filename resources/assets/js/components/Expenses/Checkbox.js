import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', name, onChange }) => (
  <p>
  <label className="noMarginBottom">
    <input type={type} name={name} onChange={onChange} />
    <span className="attachment__remove">Remove</span>
  </label>
</p>

);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.number.isRequired,
  // checked: PropTypes.bool,
  // onChange: PropTypes.func.isRequired,
}

export default Checkbox;
