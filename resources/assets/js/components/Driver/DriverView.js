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

class DriverView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);
    // Iniializing the labels to transform to top of input by adding active class from MaterializeCSS
    let newLabel = document.querySelectorAll("label");
    for (let label of newLabel) {
      label.classList.add("active");
    }

    // Initializes Materialize Drop down select for "customer_state & customer_bill_state" field
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);
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

  // This renders a redux form, where it pulls the data from the redux state of state.drivers.selectedDriver
  render() {
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
        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a className="theme__text--whitetoblack active" href="#test1">
              Profile
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a className="theme__text--whitetoblack" href="#test2">
              Hiring Info
            </a>
          </li>
        </ul>
        <form className="driver-form">
          <div id="test1" className="col s12">
            <section className="form__section">
              <h2 className="driver-form__formTitle">Driver Profile</h2>

              <div className="row form__row form__row--columnPhone">
                <Field
                  label="First Name"
                  name="driver_first_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
                <Field
                  label="Last Name"
                  name="driver_last_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row">
                <Field
                  label="Address"
                  name="driver_address"
                  component={renderField}
                  className="col s12"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="City"
                  name="driver_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="text"
                  disabled={true}
                />

                <Field
                  label="State"
                  name="driver_state"
                  className="col s12 form__field form__field--column form__field--flex2"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
                />

                <Field
                  label="Email"
                  name="driver_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="email"
                  disabled={true}
                />
              </div>
            </section>
          </div>
          <div id="test2" className="col s12">
            <section className="form__section">
              <h2 className="driver-form__formTitle">Hiring Info</h2>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="License Number"
                  name="driver_license_number"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />

                <Field
                  label="License Exp Date"
                  name="driver_license_expiration"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Hire Date"
                  name="driver_hire_date"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />

                <Field
                  label="Pay (cents per mile)"
                  name="driver_pay_amount"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="number"
                  normalize={normalizeDriverPay}
                  disabled={true}
                />
              </div>
            </section>
          </div>

          <div className="modal-footer">
            <section className="details-button">
              <Link
                to="/drivers/edit"
                className="modal-close waves-effect waves-green btn red darken-4 left modal__editButton--width100"
              >
                Edit<i className="material-icons right">edit</i>
              </Link>
            </section>
          </div>
        </form>
      </section>
    );
  }
}

DriverView = reduxForm({
  form: "DriverView",
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
  // destroyOnUnmount: false
})(DriverView);

// You have to connect() to any reducers that you wish to connect to yourself
DriverView = connect(
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
  { updateDriver }
)(DriverView);

export default DriverView;
