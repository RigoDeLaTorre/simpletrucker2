import React, { Component } from "react";

import _ from "lodash";
import { connect } from "react-redux";
import { fetchProfile } from "../../actions/company/fetchProfile";

import LoadingComponent from "../LoadingComponent";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { renderField, renderTextArea, stateOptions } from "../forms";
import {
  normalizePhone,
  normalizeZip,
  normalizeQuickpay
} from "../forms/validation";
// import {dropDownSelectState, stateOptions} from "../forms";

class ProfileView extends Component {
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    this.props.fetchProfile();

    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.company !== this.props.company) {
    }
  }

  onSubmit(values) {
    // _.mapValues(values, _.method("toLowerCase"));

    // Making all data to lowercase, ignoring id and company_id.
    let newValues = _.mapValues(values, function(val) {
      if (typeof val === "string") {
        return val.toLowerCase();
      }
      if (_.isInteger(val)) {
        return val;
      }
    });

    // Capitalizing the state fields
    newValues.company_state = newValues.company_state.toUpperCase();
    newValues.company_bill_state = newValues.company_bill_state.toUpperCase();

    // Taking out the hypens in the phone/fax before inserting into database
    newValues.company_phone = newValues.company_phone.split("-").join("");
    newValues.company_bill_phone = newValues.company_bill_phone
      .split("-")
      .join("");
    newValues.company_fax = newValues.company_fax.split("-").join("");
    newValues.company_bill_fax = newValues.company_bill_fax.split("-").join("");

    // Dispatches action to update the company in the database, then the callback to goto the search results page
    // this.props.updatecompany(newValues, () => {
    //   this.props.history.push('/company')
    // })
    M.toast({ html: `${newValues.company_name} has been updated !` });
  }

  // This renders a redux form, where it pulls the data from the redux state of state.company
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    if (!this.props.company) {
      return <h1>Testing</h1>;
    }
    return (
      <section id="profile-view" className="app-container">
        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a
              className="active"
              href="#test1"
              onClick={() => this.setState({ tab: "profile" })}
            >
              Profile
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test2" onClick={() => this.setState({ tab: "billing" })}>
              Billing
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test3" onClick={() => this.setState({ tab: "factor" })}>
              Factor Co.
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              href="#test4"
              onClick={() => this.setState({ tab: "factoragent" })}
            >
              Factor Agent
            </a>
          </li>
        </ul>

        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div id="test1" className="col s12">
            <section className="form__section">
              <h1 className="form__title">Your Company Information</h1>
              <h2 className="form__subTitle form__subTitle--marginBottom5rem">
                Company Info
              </h2>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Company Name"
                  name="company_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row">
                <Field
                  label="Address"
                  name="company_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  name="company_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  disabled={true}
                />

                <Field
                  label="State"
                  name="company_state"
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  component={renderField}
                  disabled={true}
                />

                <Field
                  label="ZipCode"
                  name="company_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="company_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  id="phone-id"
                  disabled={true}
                />
                <Field
                  label="Fax"
                  name="company_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  id="fax-id"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="company_email"
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
              <h1 className="form__title">Invoice/Accounting : Remit To</h1>
              <h2 className="form__subTitle form__subTitle--marginBottom5rem">
                This will show up on your Invoices
              </h2>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Company Name"
                  name="company_bill_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Address"
                  name="company_bill_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  name="company_bill_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  disabled={true}
                />

                <Field
                  label="State"
                  name="company_bill_state"
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  component={renderField}
                  disabled={true}
                />

                <Field
                  label="ZipCode"
                  name="company_bill_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="company_bill_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  disabled={true}
                />
                <Field
                  label="Fax"
                  name="company_bill_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="company_bill_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="email"
                  disabled={true}
                />
              </div>
            </section>
          </div>
          <div id="test3" className="col s12">
            <section className="form__section">
              <h1 className="form__title">Factory Company Information</h1>
              <h2 className="form__subTitle form__subTitle--marginBottom5rem">
                Fill out if you have a factory company
              </h2>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Company Name"
                  name="factory_company_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Address"
                  name="factory_company_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  name="factory_company_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  disabled={true}
                />
                <Field
                  label="State"
                  name="factory_company_state"
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  component={renderField}
                  disabled={true}
                />
                <Field
                  label="ZipCode"
                  name="factory_company_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="factory_company_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
                <Field
                  label="Fax"
                  name="factory_company_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="factory_company_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="email"
                  disabled={true}
                />
                <Field
                  label="Charge %"
                  name="factory_company_process_fee"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
                <Field
                  label="Reserve %"
                  name="factory_company_reserve_fee"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Notes"
                  name="factory_company_notes"
                  component={renderTextArea}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="textarea__notes"
                  type="textarea"
                  disabled={true}
                />
              </div>
            </section>
          </div>
          <div id="test4" className="col s12">
            <section className="form__section">
              <h1 className="form__title">Factory Company- Agent Info</h1>
              <h2 className="form__subTitle form__subTitle--marginBottom5rem">
                Fill out your factory company representative info here
              </h2>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Agent Name"
                  name="factory_company_rep_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="factory_company_rep_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
                <Field
                  label="Fax"
                  name="factory_company_rep_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  disabled={true}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="factory_company_rep_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="email"
                  disabled={true}
                />
              </div>
            </section>
          </div>
          <div className="fixed-action-btn">
            <Link to="/profile/edit" className="btn-floating btn-large red">
              <i className="material-icons">edit</i>
            </Link>
          </div>
        </form>
      </section>
    );
  }
}

ProfileView = reduxForm({
  form: "companyView",
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(ProfileView);

// You have to connect() to any reducers that you wish to connect to yourself
ProfileView = connect(
  state => ({
    company: state.company,
    settings: state.settings,
    // initialValues: state.company, // pull initial values from account reducer
    initialValues: {
      ...state.company,
      ...{
        company_bill_fax: normalizePhone(state.company.company_bill_fax),
        company_bill_phone: normalizePhone(state.company.company_bill_phone),
        company_fax: normalizePhone(state.company.company_fax),
        company_phone: normalizePhone(state.company.company_phone),
        factory_company_phone: normalizePhone(
          state.company.factory_company_phone
        ),
        factory_company_fax: normalizePhone(state.company.factory_company_fax),
        factory_company_rep_phone: normalizePhone(
          state.company.factory_company_rep_phone
        ),
        factory_company_rep_fax: normalizePhone(
          state.company.factory_company_rep_fax
        )
      }
    }
  }),
  { fetchProfile: fetchProfile } // bind account loading action creator
)(ProfileView);

export default ProfileView;
