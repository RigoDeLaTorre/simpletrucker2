import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoadingComponent from "../LoadingComponent";
import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from "../forms";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from "../forms/validation/normalizeForm";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { updateTruck, deleteTruck } from "../../actions/truck";

import {
  required,
  maxLength,
  maxLength4,
  maxLength10,
  maxLength20,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength4,
  minLength5,
  minLength12,
  onlyInteger
} from "../forms/validation/fieldValidations";

class TruckEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: "",
      date: ""
    };
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);

    let dateAquired = document.querySelectorAll(".dateAquired");
    let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      onSelect: this.handleDate,
      autoClose: true
    });
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("truck_date_aquired", date);
  };

  handleLicenseExp = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("driver_license_expiration", date);
  };

  handleDelete = () => {
    let id = this.props.trucks.selectedTruck.id;

    if (
      confirm(
        "Are You sure you want to delete this Truck and ALL related Expenses ?"
      ) == true
    ) {
      this.props.deleteTruck(id, message => {
        if (message.success) {
          M.toast({
            html: message.success,
            classes: "materialize__toastUpdated"
          });
        } else {
          M.toast({
            html: message.error,
            classes: "materialize__toastError"
          });
        }
      });
    } else {
      return false;
    }
  };

  onSubmit(values) {
    let newValues = _.mapValues(values, function(val) {
      if (typeof val === "string") {
        return val.toLowerCase().trim();
      }
      if (_.isInteger(val)) {
        return val;
      }
    });

    this.props.updateTruck(newValues, () => {
      // this.props.history.push('/drivers/search')
    });
    M.toast({
      html: ` ${values.truck_reference.toUpperCase().trim()} ***  updated !`,
      classes: "materialize__toastUpdated"
    });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div id="truckEdit" className="modal load-modal load-modal--noPadding">
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <div className="permanentlyDeleteModal" onClick={this.handleDelete}>
              delete
            </div>
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
            >
              <div className="form__sectionContainer form__sectionContainer--noMargin form__sectionContainer--modal">
                <section className="form__group">
                  <a
                    href="#!"
                    className="modal-close waves-effect waves-green btn grey darken-4 right"
                  >
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Edit Truck</h1>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Reference"
                      name="truck_reference"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={[required, maxLength50]}
                      placeholder="testing"
                    />

                    <Field
                      label="Date Aquired"
                      name="truck_date_aquired"
                      component={renderDateField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      dateField="dateAquired"
                    />

                    <Field
                      label="Initial Odometer"
                      name="truck_initial_odometer"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={onlyInteger}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Year"
                      name="truck_year"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={[onlyInteger, maxLength4, minLength4]}
                    />
                    <Field
                      label="Manufacturer"
                      name="truck_manufacturer"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength100}
                    />
                    <Field
                      label="Model"
                      name="truck_model"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength50}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="License"
                      name="truck_license"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength10}
                    />
                    <Field
                      label="Vin"
                      name="truck_vin"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength20}
                    />
                  </div>
                  <div className="form__saveContainer">
                    <div className="form__buttonContainer">
                      <button
                        className="btn-floating btn-large green right"
                        type="submit"
                        disabled={submitting}
                      >
                        {" "}
                        <i className="large material-icons">save</i>Save
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Save Truck
                      </h4>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

TruckEdit = reduxForm({
  form: "TruckEdit"
})(TruckEdit);

TruckEdit = connect(
  state => ({
    company: state.company,
    trucks: state.trucks,
    settings: state.settings,
    initialValues: { ...state.trucks.selectedTruck },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateTruck,
    deleteTruck
  }
)(TruckEdit);

export default TruckEdit;
