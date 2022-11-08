import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoadingComponent from "../LoadingComponent";
import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState,
  stateOptions
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from "../forms/validation/normalizeForm";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { updateVendor, deleteVendor } from "../../actions/vendor";

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

class VendorEdit extends Component {
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

  onSubmit(values) {
    let newValues = submitValidationVendors(values);

    this.props.updateVendor(newValues, () => {
      // this.props.history.push('/drivers/search')
    });
    M.toast({
      html: ` ${values.vendor_name.toUpperCase().trim()} ***  updated !`,
      classes: "materialize__toastUpdated"
    });
  }

  handleDelete = () => {
    let id = this.props.vendor.selectedVendor.id;

    if (
      confirm(
        "Are You sure you want to delete this Vendor and ALL related Expenses ?"
      ) == true
    ) {
      this.props.deleteVendor(id, message => {
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

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div id="vendorEdit" className="modal load-modal load-modal--noPadding">
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
                  <h1 className="form__formTitle">Edit Vendor</h1>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Vendor Name"
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
                      className="col s12 form__field form__field--column form__field--flex1"
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
                      // defaultValue={stateOptions.find(s=>s.value===this.props.vendors.selectedVendor.vendor_state)}

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
                        <i className="large material-icons">save</i>
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Update
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

VendorEdit = reduxForm({
  form: "VendorEdit"
})(VendorEdit);

VendorEdit = connect(
  state => ({
    settings: state.settings,
    vendor: state.vendors,
    initialValues: {
      ...state.vendors.selectedVendor,
      vendor_phone:
        normalizePhone(state.vendors.selectedVendor.vendor_phone) || "",
      vendor_fax: normalizePhone(state.vendors.selectedVendor.vendor_fax) || "",
      vendor_state:
        state.vendors.selectedVendor &&
        state.vendors.selectedVendor.vendor_state !== undefined
          ? stateOptions.find(
              s => s.value === state.vendors.selectedVendor.vendor_state
            )
          : ""
    },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateVendor,
    deleteVendor
  }
)(VendorEdit);

export default VendorEdit;
