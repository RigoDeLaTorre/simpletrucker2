import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoadingComponent from "../LoadingComponent";
import {
  stateOptions,
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from "../forms/validation/normalizeForm";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { createVendor } from "../../actions/vendor";

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
  minLengthPhone,
  onlyInteger,
  submitValidationVendors
} from "../forms/validation";

class VendorAddNewModal extends Component {
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
    let elemsTruckAddNew = document.querySelectorAll("select");
    let instancesTruckAddNew = M.FormSelect.init(elemsTruckAddNew);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.trucks.expenseRecords !== this.props.trucks.expenseRecords) {
    //   //Instance for MaterializeCSS
    //   console.log("compoentupdated inside Truck Add New !")
    //
    // }
  }

  onSubmit(values) {
    let newValues = submitValidationVendors(values);

    let id = this.props.company.id;
    this.props.createVendor(id, newValues, () => {
      document.getElementById("close-modal-newVendor").click();
      this.props.reset();
    });
    M.toast({
      html: `New Vendor ***  ${values.vendor_name
        .toUpperCase()
        .trim()} ***  added !`,
      classes: "materialize__toastSuccess"
    });
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div
        id="vendorAddNewModal"
        className="modal load-modal load-modal--noPadding overflowAutoVendor"
      >
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
            >
              <div className="form__sectionContainer form__sectionContainer--noMargin form__sectionContainer--modal">
                <section className="form__group">
                  <a
                    id="close-modal-newVendor"
                    href="#!"
                    className="modal-close waves-effect waves-green btn grey darken-4 right"
                  >
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Add Vendor</h1>
                  <div className="row form__row form__row--column">
                    <Field
                      label="* Vendor Name"
                      name="vendor_name"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={[required, maxLength200]}
                      placeholder="testing"
                    />
                    <Field
                      label="Address"
                      name="vendor_address"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength100}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="City"
                      name="vendor_city"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex2"
                      type="text"
                      validate={maxLength50}
                    />

                    <Field
                      label="State"
                      name="vendor_state"
                      className="col s12 form__field form__field--column form__field--flex2"
                      iconDisplayNone="label-group__addItemIcon--displayNone"
                      type="select"
                      onBlur={() => input.onBlur(input.value)}
                      component={RenderSelectFieldReactSelectClass}
                      placeholder="State"
                      options={stateOptions.map(item => ({
                        value: item.value,
                        label: item.label
                      }))}
                    />
                    <Field
                      label="ZipCode"
                      name="vendor_zipcode"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      normalize={normalizeZip}
                      validate={[minLength5, maxLength10]}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Phone"
                      name="vendor_phone"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      normalize={normalizePhone}
                      validate={minLengthPhone}
                    />
                    <Field
                      label="Fax"
                      name="vendor_fax"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      normalize={normalizePhone}
                      validate={minLengthPhone}
                    />
                    <Field
                      label="Email"
                      name="vendor_email"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="email"
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
                        Add Vendor
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

function mapStatetoProps(state) {
  return {
    company: state.company,
    settings: state.settings
  };
}

export default reduxForm({
  form: "VendorAddNewModal"
})(
  connect(
    mapStatetoProps,
    { createVendor }
  )(VendorAddNewModal)
);
