import React, { Component } from "react";

import LoadingComponent from "../LoadingComponent";
import _ from "lodash";
import { connect } from "react-redux";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import { EditingModeTopBar } from "../common";

import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip,
  submitValidationDrivers
} from "../forms/validation";

import {
  renderField,
  renderDateField,
  dropDownSelectState,
  stateOptions
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
import { updateDriver } from "../../actions/driver/updateDriver.js";

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

class DriverEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    // Iniializing the labels to transform to top of input by adding active class from MaterializeCSS
    let newLabel = document.querySelectorAll("label");
    for (let label of newLabel) {
      label.classList.add("active");
    }

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);

    // Initializes Materialize Drop down select for "customer_state & customer_bill_state" field
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);

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

  renderDateField = ({
    dateField,
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field inline ${touched && error ? "has-danger" : ""}`}
    >
      <label>{label}</label>
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

  //Renders the State select field in the form
  selectField = ({
    children,
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <label className={touched ? "active" : ""}>{touched ? label : ""}</label>
      <select className="form-control" {...input}>
        {children}
      </select>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  //Renders the inputs in the redux form
  renderField = ({
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field inline ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <label>{label}</label>
      <input
        className="form-control"
        autoComplete="new-password"
        type={type}
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  onSubmit(values) {
    let newValues = submitValidationDrivers(values);
    this.props.updateDriver(newValues, () => {
      this.props.history.push("/drivers/search");
    });
    M.toast({
      html: `***  ${newValues.driver_first_name.toUpperCase()} ***  updated !`,
      classes: "materialize__toastUpdated"
    });
  }

  // This renders a redux form, where it pulls the data from the redux state of state.drivers.selectedDriver
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    if (_.isEmpty(this.props.selectedDriver)) {
      return (
        <div>
          <h4>
            No Driver was selected, go back to{" "}
            <Link
              to="/drivers/search"
              className="nav-section__link nav-section__link--flex"
            >
              Drivers
            </Link>{" "}
            and try again !
          </h4>
        </div>
      );
    }
    return (
      <section id="driver-edit" className="app-container">
        <LoadingComponent loadingText="Edit Driver" />
        <div className="driver-form-container">
          <form
            className="driver-form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}
          >
            <div className="driver-form__sectionContainer">
              <section className="driver-form__group driver-form__group--left">
                <h2 className="driver-form__formTitle">Driver Profile</h2>

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
                <h2 className="driver-form__formTitle">Hiring Info</h2>
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
                    label="Pay (cents per mile)"
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
              <div className="fixed-action-btn__mainButton">
                <button
                  className="btn-floating btn-large green"
                  type="submit"
                  disabled={submitting}
                >
                  <i className="large material-icons">save</i>
                </button>
              </div>

              <ul className="fixed-action-button__sublinks">
                <li>
                  <Link to="/drivers/search" className="btn-floating red">
                    <i className="material-icons">cancel</i>
                  </Link>
                </li>
              </ul>
              <h4 className="fixed-action-btn__title save">Save Changes</h4>
            </div>
          </form>
        </div>

        {/*  <div className="add-load" onClick={this.handleSubmit}>
          <img src="./img/plus.svg" />
        </div> */}
      </section>
    );
  }
}

DriverEdit = reduxForm({
  form: "DriverEdit"
})(DriverEdit);

// You have to connect() to any reducers that you wish to connect to yourself
DriverEdit = connect(
  state => ({
    settings: state.settings,
    selectedDriver: state.drivers.selectedDriver,
    initialValues: {
      ...state.drivers.selectedDriver,
      driver_phone: normalizePhone(state.drivers.selectedDriver.driver_phone),
      driver_state: stateOptions.find(
        s => s.value === state.drivers.selectedDriver.driver_state
      )
    },
    initialized: true
  }),
  { updateDriver: updateDriver } // bind account loading action creator
)(DriverEdit);

export default DriverEdit;
