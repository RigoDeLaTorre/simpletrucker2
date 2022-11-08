import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoadingComponent from "../LoadingComponent";
import {
  renderField,
  renderDateField,
  dropDownSelectState,
  stateOptions
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip,
  submitValidationDrivers
} from "../forms/validation";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
import { createDriver } from "../../actions/driver/createDriver.js";

import {
  required,
  maxLength,
  maxLength10,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  minLength12,
  number
} from "../forms/validation/fieldValidations";

class DriverAddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);

    let driverLicenseExp = document.querySelectorAll(".driverlicenseExp");
    // var instance = M.Datepicker.getInstance(elems);
    let licenseExpInstance = M.Datepicker.init(driverLicenseExp, {
      onSelect: this.handleLicenseExp,
      autoClose: true
    });

    let hiredate = document.querySelectorAll(".hireDatePicker");
    let hireDateInstance = M.Datepicker.init(hiredate, {
      onSelect: this.handleDate,
      autoClose: true
    });
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("driver_hire_date", date);
  };

  handleLicenseExp = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("driver_license_expiration", date);
  };

  onSubmit(values) {
    let newValues = submitValidationDrivers(values);

    let id = this.props.company.id;
    this.props.createDriver(id, newValues, () => {
      this.props.history.push("/drivers/search");
    });
    M.toast({
      html: `New driver ***  ${values.driver_first_name
        .toUpperCase()
        .trim()}  ${values.driver_last_name.toUpperCase().trim()}***  added !`,
      classes: "materialize__toastSuccess"
    });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <section id="driver-add-new" className="app-container">
        <LoadingComponent loadingText="Add New Driver" />
        <div className="driver-form-container">
          <form
            className="driver-form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}
          >
            <div className="driver-form__sectionContainer">
              <section className="driver-form__group driver-form__group--left">
                <h1 className="driver-form__formTitle">Driver Profile</h1>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="First Name"
                    name="driver_first_name"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={[required, maxLength50]}
                  />
                  <Field
                    label="Last Name"
                    name="driver_last_name"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={[required, maxLength50]}
                  />
                </div>
                <div className="row">
                  <Field
                    label="Address"
                    name="driver_address"
                    component={renderField}
                    className="col s12"
                    type="text"
                    validate={[required, maxLength100]}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="City"
                    name="driver_city"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="text"
                    validate={[required, maxLength50]}
                  />

                  <Field
                    label="State"
                    name="driver_state"
                    className="col s12 form__field form__field--column form__field--flex2"
                    iconDisplayNone="label-group__addItemIcon--displayNone"
                    type="select"
                    onBlur={() => input.onBlur(input.value)}
                    component={RenderSelectFieldReactSelectClass}
                    validate={required}
                    placeholder="State"
                    options={stateOptions.map(item => ({
                      value: item.value,
                      label: item.label
                    }))}
                  />

                  <Field
                    label="ZipCode"
                    name="driver_zip"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizeZip}
                    validate={[required, minLength5, maxLength10]}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Phone"
                    name="driver_phone"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizePhone}
                    validate={[required, minLength12]}
                  />

                  <Field
                    label="Email"
                    name="driver_email"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="email"
                  />
                </div>
              </section>
              <section className="driver-form__group">
                <h1 className="driver-form__formTitle">Hiring Info</h1>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="License Number"
                    name="driver_license_number"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={required}
                  />

                  <Field
                    label="License Exp Date"
                    name="driver_license_expiration"
                    component={renderDateField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    dateField="driverlicenseExp"
                    validate={required}
                  />
                </div>

                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Hire Date"
                    name="driver_hire_date"
                    component={renderDateField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    dateField="hireDatePicker"
                    validate={required}
                  />

                  <Field
                    label="Pay (cents p/m)"
                    name="driver_pay_amount"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="number"
                    normalize={normalizeDriverPay}
                    validate={required}
                  />
                </div>
              </section>
            </div>

            <div className="fixed-action-btn">
              <button
                className="btn-floating btn-large green"
                type="submit"
                disabled={submitting}
              >
                <i className="large material-icons">save</i>
              </button>
              <ul>
                <li>
                  <Link to="/drivers/search" className="btn-floating red">
                    <i className="material-icons">cancel</i>
                  </Link>
                </li>
              </ul>
              <h4 className="fixed-action-btn__title save">Save Driver</h4>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    company: state.company,
    settings: state.settings
  };
}

export default reduxForm({
  form: "DriverAddNew"
})(
  connect(
    mapStatetoProps,
    { createDriver, fetchDrivers }
  )(DriverAddNew)
);
