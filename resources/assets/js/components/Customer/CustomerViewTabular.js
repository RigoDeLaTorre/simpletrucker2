import React, { Component } from "react";
import _ from "lodash";
import LoadingComponent from "../LoadingComponent";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Field,
  FieldArray,
  formValues,
  formValueSelector,
  reduxForm,
  registerField
} from "redux-form";
import { updateCustomer } from "../../actions/customer/updateCustomer.js";
import { renderField, renderTextArea, stateOptions } from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  processTypes,
  processTypesNoQuickPay,
  processTypesNoFactor,
  normalizePhone,
  normalizeZip,
  normalizeQuickpay,
  submitValidationCustomer,
  required,
  maxLength,
  maxLength10,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  minLength12,
  minLengthPhone,
  number
} from "../forms/validation";

class CustomerViewTabular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "profile"
    };
  }
  componentDidMount() {
    setTimeout(() => {
      let labels = document.querySelectorAll("label");

      for (let label of labels) {
        label.classList.add("active");
      }
    }, 0);

    window.scrollTo(0, 0);
    // this.registerAllFields()

    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);

    // Initializes Materialize Drop down select for "customer_state & customer_bill_state" field
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);
  }

  onSubmit = values => {
    let formErrors = this.renderErrors();

    if (
      _.isEmpty(this.props.synchronousError) &&
      formErrors.billerror === false &&
      formErrors.quickpayerror === false &&
      formErrors.customererror === false
    ) {
      let newValues = submitValidationCustomer(values);
      // this function is in the folder forms/ validation

      // Dispatches action to update the customer in the database, then the callback to goto the search results page
      this.props.updateCustomer(newValues, () => {
        this.props.history.push("/customers/search");
      });
      M.toast({ html: `${newValues.customer_name} has been updated !` });
    } else {
      alert(formErrors.messageError);
    }
  };

  // This renders a redux form, where it pulls the data from the redux state of state.customers.selectedCustomer
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    if (_.isEmpty(this.props.customers.selectedCustomer)) {
      return (
        <div>
          <h4>
            No Customer was selected, go back to{" "}
            <Link
              to="/customers/search"
              className="nav-section__link nav-section__link--flex"
            >
              Customers
            </Link>{" "}
            and try again !
          </h4>
        </div>
      );
    }
    return (
      <div>
        <div className="modal-content">
          <ul className="tabs tabs__accountingEdit">
            <li className="tab tab__accountingEdit">
              <a
                className="theme__text--whitetoblack active"
                href="#test1"
                onClick={() => this.setState({ tab: "profile" })}
              >
                Profile
              </a>
            </li>
            <li className="tab tab__accountingEdit">
              <a
                className="theme__text--whitetoblack"
                href="#test2"
                onClick={() => this.setState({ tab: "billing" })}
              >
                Billing
              </a>
            </li>
            <li className="tab tab__accountingEdit">
              <a
                className="theme__text--whitetoblack"
                href="#test3"
                onClick={() => this.setState({ tab: "quickpay" })}
              >
                QuickPay
              </a>
            </li>
          </ul>

          <form
            className="form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}
          >
            <div id="test1" className="col s12">
              <section className="form__section">
                <h1 className="form__title">Customer Profile</h1>
                <h2 className="form__subTitle">Office Location </h2>
                <h4 className="form__subTitleRequired">
                  <span className="form__subTitleRequired--asterick">*</span>{" "}
                  Required Fields
                </h4>
                <div className="row">
                  <Field
                    label="Customer Name"
                    requiredStar="*"
                    name="customer_name"
                    component={renderField}
                    className="col s12"
                    type="text"
                    validate={[required, maxLength200]}
                    disabled={true}
                  />
                </div>
                <div className="row">
                  <Field
                    label="Address"
                    name="customer_address"
                    component={renderField}
                    className="col s12"
                    type="text"
                    validate={maxLength100}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--column">
                  <Field
                    label="City"
                    name="customer_city"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="text"
                    validate={maxLength50}
                    disabled={true}
                  />

                  <Field
                    label="State"
                    name="customer_state"
                    className="col s12 form__field form__field--column form__field--flex2"
                    iconDisplayNone="label-group__addItemIcon--displayNone"
                    type="text"
                    component={renderField}
                    placeholder="State"
                    disabled={true}
                  />

                  <Field
                    label="ZipCode"
                    name="customer_zip"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizeZip}
                    validate={[minLength5, maxLength10]}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Phone"
                    requiredStar="*"
                    name="customer_phone"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizePhone}
                    validate={[required, minLengthPhone]}
                    disabled={true}
                  />
                  <Field
                    label="Fax"
                    name="customer_fax"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizePhone}
                    validate={minLengthPhone}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Email"
                    name="customer_email"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex2"
                    type="email"
                    disabled={true}
                  />
                </div>
              </section>
            </div>
            <div id="test2" className="col s12">
              <section className="form__section">
                <h1 className="form__title">Accounting</h1>
                <h2 className="form__subTitle">Billing Information</h2>
                <h4 className="form__subTitleRequired">
                  <span className="form__subTitleRequired--asterick">*</span>{" "}
                  Required Fields
                </h4>

                <div className="row">
                  <Field
                    label="Company Name"
                    requiredStar="*"
                    name="customer_bill_name"
                    component={renderField}
                    className="col s12"
                    labelClass="customer_bill_name"
                    type="text"
                    validate={[required, maxLength200]}
                    disabled={true}
                  />
                </div>
                <div className="row">
                  <Field
                    label="Address"
                    name="customer_bill_address"
                    component={renderField}
                    className="col s12"
                    labelClass="customer_bill_address"
                    type="text"
                    validate={maxLength100}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--column">
                  <Field
                    label="City"
                    name="customer_bill_city"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    labelClass="customer_bill_city"
                    type="text"
                    validate={maxLength50}
                    disabled={true}
                  />

                  <Field
                    label="State"
                    name="customer_bill_state"
                    labelClass="customer_bill_state"
                    className="col s12 form__field form__field--column form__field--flex2"
                    iconDisplayNone="label-group__addItemIcon--displayNone"
                    type="text"
                    component={renderField}
                    placeholder="State"
                    disabled={true}
                  />
                  <Field
                    label="ZipCode"
                    name="customer_bill_zip"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    labelClass="customer_bill_zip"
                    type="text"
                    normalize={normalizeZip}
                    validate={(minLength5, maxLength10)}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Phone"
                    requiredStar="*"
                    name="customer_bill_phone"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    labelClass="customer_bill_phone"
                    type="text"
                    normalize={normalizePhone}
                    disabled={true}
                  />
                  <Field
                    label="Fax"
                    name="customer_bill_fax"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    labelClass="customer_bill_fax"
                    type="text"
                    normalize={normalizePhone}
                    validate={minLengthPhone}
                    disabled={true}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Email"
                    name="customer_bill_email"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex2"
                    labelClass="customer_bill_email"
                    type="email"
                    disabled={true}
                  />
                  <Field
                    label="Process Type"
                    requiredStar="*"
                    name="process_type"
                    className="col s12 form__field form__field--column form__field--flex1"
                    iconDisplayNone="label-group__addItemIcon--displayNone"
                    type="text"
                    component={renderField}
                    disabled={true}
                  />
                </div>
              </section>
            </div>
            <div id="test3" className="col s12">
              <section className="form__section form__section--quickpay">
                <h1 className="form__title">Quickpay</h1>
                <h2 className="form__subTitle">
                  If Customer provides quickpay on loads
                </h2>
                <h4 className="form__subTitleRequired">
                  <span className="form__subTitleRequired--asterick">*</span>{" "}
                  Required Fields
                </h4>
                <div className="row form__row form__row--column">
                  <Field
                    label="Email"
                    requiredStar="*"
                    name="quickpay_email"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="email"
                    disabled={true}
                  />
                  <Field
                    label="Phone"
                    name="quickpay_phone"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex2"
                    type="text"
                    normalize={normalizePhone}
                    validate={minLengthPhone}
                    disabled={true}
                  />
                  <Field
                    label="Fax"
                    name="quickpay_fax"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex2"
                    type="text"
                    normalize={normalizePhone}
                    validate={minLengthPhone}
                    disabled={true}
                  />
                  <Field
                    label="Charge %"
                    requiredStar="*"
                    name="quickpay_charge"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizeQuickpay}
                    disabled={true}
                  />
                </div>
                <div className="row load-textarea">
                  <Field
                    label="QuickPay Notes"
                    name="quickpay_notes"
                    component={renderTextArea}
                    className="col s12"
                    type="textarea"
                    disabled={true}
                  />
                </div>
              </section>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <section className="details-button">
            <Link
              to="/customers/edit"
              className="modal-close waves-effect waves-green btn red darken-4 left modal__editButton--width100"
            >
              Edit<i className="material-icons right">edit</i>
            </Link>
          </section>
        </div>
      </div>
    );
  }
}
const selector = formValueSelector("CustomerView");

CustomerViewTabular = reduxForm({
  form: "CustomerView",
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
  // destroyOnUnmount: false
})(CustomerViewTabular);

// You have to connect() to any reducers that you wish to connect to yourself
CustomerViewTabular = connect(
  state => ({
    company: state.company,
    customers: state.customers,
    settings: state.settings,
    initialValues: {
      ...state.customers.selectedCustomer,
      ...{
        customer_bill_fax: normalizePhone(
          state.customers.selectedCustomer.customer_bill_fax
        ),
        customer_bill_phone: normalizePhone(
          state.customers.selectedCustomer.customer_bill_phone
        ),
        customer_fax: normalizePhone(
          state.customers.selectedCustomer.customer_fax
        ),
        customer_phone: normalizePhone(
          state.customers.selectedCustomer.customer_phone
        ),
        quickpay_phone: normalizePhone(
          state.customers.selectedCustomer.quickpay_phone
        ),
        quickpay_fax: normalizePhone(
          state.customers.selectedCustomer.quickpay_fax
        )
      }
    }
  }),
  { updateCustomer: updateCustomer } // bind account loading action creator
)(CustomerViewTabular);

export default CustomerViewTabular;
