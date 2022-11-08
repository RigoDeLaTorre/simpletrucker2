import React, { Component } from 'react'
import LoadingComponent from '../LoadingComponent'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
  Field,
  FieldArray,
  formValueSelector,
  formValues,
  reduxForm,
  getFormSyncErrors
} from 'redux-form'
import { Link } from 'react-router-dom'

import {
  normalizePhone,
  normalizeZip,
  normalizeQuickpay,
  submitValidationProfile,
  errorReduxFactoryCompany,
  errorReduxFactoryCompanyAgent,
  errorsReduxProfile,
  errorReduxBilling
} from '../forms/validation'
import {
  renderField,
  renderTextArea,
  dropDownSelectState,
  stateOptions
} from '../forms'
import RenderSelectFieldReactSelectClass from '../forms/RenderSelectFieldReactSelectClass'

import { createProfile } from '../../actions/company/createProfile.js'
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
  minLengthPhone,
  number,
  onlyInteger
} from '../forms/validation/fieldValidations'

class ProfileAddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'profile'
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    // Iniializing the labels to transform to top of input by adding active class from MaterializeCSS
    let newLabel = document.querySelectorAll('label')
    for (let label of newLabel) {
      label.classList.add('active')
    }
    let elemTabs = document.querySelectorAll('.tabs')
    var elemTabsInstance = M.Tabs.init(elemTabs)

    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)
    // Initializes Materialize Drop down select for "company_state & company_bill_state" field
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
  }

  //Renders the State select field in the form
  selectField = ({
    children,
    className,
    labelClass,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field ${className} ${
        touched && error ? 'has-danger' : ''
      }`}>
      <label className={`${labelClass} active`}>{label}</label>
      <select className="form-control" {...input}>
        {children}
      </select>
      <div className="text-help">{touched ? error : ''}</div>
    </div>
  )

  factorValues = () => {
    const valuesArray = _.map(this.props.factorValues, function(value, key) {
      return value
    })

    let notEmpty = arr => {
      return arr !== null && arr !== undefined && arr != ''
    }
    return valuesArray.some(notEmpty)
  }

  renderErrors = () => {
    const errors = this.props.synchronousError
    let profileerror = false
    let billingerror = false
    let factorycompanyerror = false
    let factoragenterror = false
    let messageError
    // const companyBillingValues = this.props.companyBillingValues

    if (this.state.tab === 'profile') {
      //billing validation
      const companyBillingValues = this.props.companyBillingValues

      let errorBilling = errorReduxBilling(errors)
      let result =
        companyBillingValues.hasOwnProperty('company_bill_name') &&
        companyBillingValues.hasOwnProperty('company_bill_address') &&
        companyBillingValues.hasOwnProperty('company_bill_city') &&
        companyBillingValues.hasOwnProperty('company_bill_state') &&
        companyBillingValues.hasOwnProperty('company_bill_zip') &&
        companyBillingValues.hasOwnProperty('company_bill_phone')

      if (!result || errorBilling) {
        billingerror = true
      }
      //factory company validation
      let errorFactoryCompany = errorReduxFactoryCompany(errors)
      if (errorFactoryCompany) {
        factorycompanyerror = true
      }

      // factory-AGENT validation
      let errorFactoryCompanyAgent = errorReduxFactoryCompanyAgent(errors)
      if (errorFactoryCompanyAgent) {
        factoragenterror = true
      }
    } else if (this.state.tab === 'billing') {
      //profile
      let errorProfile = errorsReduxProfile(errors)
      if (errorProfile) {
        profileerror = true
      }
      //facotry company
      let errorFactoryCompany = errorReduxFactoryCompany(errors)
      if (errorFactoryCompany) {
        factorycompanyerror = true
      }
      // factory-AGENT validation
      let errorFactoryCompanyAgent = errorReduxFactoryCompanyAgent(errors)
      if (errorFactoryCompanyAgent) {
        factoragenterror = true
      }
    } else if (this.state.tab === 'factorycompany') {
      const companyBillingValues = this.props.companyBillingValues
      //profile
      let errorProfile = errorsReduxProfile(errors)
      if (errorProfile) {
        profileerror = true
      }
      ///billing

      let errorBilling = errorReduxBilling(errors)
      let result = Object.values(companyBillingValues).some(x => x == null)
      if (result || errorBilling) {
        billingerror = true
      }
      // factory-AGENT validation
      let errorFactoryCompanyAgent = errorReduxFactoryCompanyAgent(errors)
      if (errorFactoryCompanyAgent) {
        factoragenterror = true
      }
    } else if (this.state.tab === 'factoragent') {
      const companyBillingValues = this.props.companyBillingValues
      //profile
      let errorProfile = errorsReduxProfile(errors)
      if (errorProfile) {
        profileerror = true
      }
      ///billing

      let errorBilling = errorReduxBilling(errors)
      let result = Object.values(companyBillingValues).some(x => x == null)
      if (result || errorBilling) {
        billingerror = true
      }
      //facotry company
      let errorFactoryCompany = errorReduxFactoryCompany(errors)
      if (errorFactoryCompany) {
        factorycompanyerror = true
      }
    }

    if (profileerror && billingerror && factorycompanyerror) {
      messageError =
        ' Please fill required fields in Profile, Billing, & Factory Company Tab'
    } else if (profileerror && billingerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Profile, Billing, & Factory Agent Tab'
    } else if (profileerror && factorycompanyerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Profile, Factory Company, & Factory Agent Tab'
    } else if (billingerror && factorycompanyerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Billing, Factory Company, & Factor Agent Tab'
    } else if (profileerror && billingerror) {
      messageError = ' Please fill required fields in Profile & Billing Tab'
    } else if (profileerror && factorycompanyerror) {
      messageError =
        ' Please fill required fields in Profile & Factory Company Tab'
    } else if (profileerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Profile & Factory Agent Tab'
    } else if (billingerror && factorycompanyerror) {
      messageError =
        ' Please fill required fields in Billing & Factory Company Tab'
    } else if (billingerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Billing & Factory Agent Tab'
    } else if (factorycompanyerror && factoragenterror) {
      messageError =
        ' Please fill required fields in Factory Company & Factory Agent Tab'
    } else if (profileerror) {
      messageError = ' Please fill required fields in Profile Tab'
    } else if (billingerror) {
      messageError = ' Please fill required fields in Billing Tab'
    } else if (factorycompanyerror) {
      messageError = ' Please fill required fields in Factory Company Tab'
    } else if (factoragenterror) {
      messageError = ' Please fill required fields in Factory Agent Tab'
    }
    return {
      profileerror,
      billingerror,
      factorycompanyerror,
      factoragenterror,
      messageError
    }
  }
  onSubmit(values) {
    let formErrors = this.renderErrors()
    if (
      _.isEmpty(this.props.synchronousError) &&
      formErrors.profileerror === false &&
      formErrors.billingerror === false &&
      formErrors.factorycompanyerror === false &&
      formErrors.factoragenterror === false
    ) {
      let newValues = submitValidationProfile(values)
      // Dispatches action to update the company in the database, then the callback to goto the search results page
      this.props.createProfile(newValues, () => {
        this.props.history.push('/home')
      })
      M.toast({
        html: `${newValues.company_bill_name.toUpperCase()} has been added !`,
        classes: 'materialize__toastSuccess'
      })
    } else {
      alert(formErrors.messageError)
    }
  }

  copyFields = () => {
    const {
      company_name,
      company_address,
      company_city,
      company_state,
      company_zip,
      company_phone,
      company_fax,
      company_email
    } = this.props.companyProfileValues

    let companyBillNames = [
      'company_bill_name',
      'company_bill_address',
      'company_bill_city',
      'company_bill_state',
      'company_bill_zip',
      'company_bill_phone',
      'company_bill_fax',
      'company_bill_email'
    ]
    let companyNames = [
      company_name,
      company_address,
      company_city,
      company_state,
      company_zip,
      company_phone,
      company_fax,
      company_email
    ]
    for (let i in companyNames) {
      if (companyNames[i] != undefined && typeof companyNames[i] == 'object') {
        this.props.change(companyBillNames[i], companyNames[i])
      } else if (companyNames[i] != undefined) {
        this.props.change(companyBillNames[i], companyNames[i])
        // let newLabel = document.querySelectorAll(
        //   `label.${companyBillNames[i]}`
        // );
        // newLabel[0].classList.add("active");
      }
    }
    // this.props.change("company_bill_name", company_name);
    // this.props.change("company_bill_address", company_address);
    // this.props.change("company_bill_city", company_city);
    // this.props.change("company_bill_state", company_state);
    // this.props.change("company_bill_zip", company_zip);
    // this.props.change("company_bill_phone", company_phone);
    // this.props.change("company_bill_fax", company_fax);
    // this.props.change("company_bill_email", company_email);
    //
    // let newLabel = document.querySelectorAll("label.companyBillAddress");
    // console.log(newLabel[0]);
    // newLabel[0].classList.add("active");

    setTimeout(function() {
      let elems = document.querySelectorAll('select')
      let instances = M.FormSelect.init(elems)
      M.toast({
        html: `Copied!`
      })
      // let newLabel = document.querySelectorAll("label");
      // for (let label of newLabel) {
      //   label.classList.add("active");
      // }
    }, 0)
  }

  // This renders a redux form, where it pulls the data from the redux state of state.company
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <section id="profile-add-new" className="app-container">
        <LoadingComponent loadingText="Edit Company Profile" />
        <div className="starting-id">
          <div className="starting-id__titleGroup">
            <h4 className="starting-id__title">Starting Invoice Number</h4>
            <h5 className="starting-id__subtitle">
              Choose what Invoice # you want to begin with
            </h5>
          </div>
          <Field
            label="Starting Invoice #"
            name="invoice_starting_id"
            component={renderField}
            className="col s4 starting-id__field"
            labelClass="invoice_starting_id"
            type="number"
            validate={[required, onlyInteger, maxLength10]}
          />
        </div>
        <ul className="tabs tabs__accountingEdit">
          {/*
          <li className="tab tab__accountingEdit">
            <a
              className="active"
              href="#test1"
              onClick={() => this.setState({ tab: 'profile' })}>
              Profile
            </a>
          </li>
          */}
          <li className="tab tab__accountingEdit">
            <a href="#test2" onClick={() => this.setState({ tab: 'billing' })}>
              Billing
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test3" onClick={() => this.setState({ tab: 'factor' })}>
              Factor Co.
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              href="#test4"
              onClick={() => this.setState({ tab: 'factoragent' })}>
              Factor Agent
            </a>
          </li>
        </ul>
        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {/*
          <div id="test1" className="col s12">
            <section className="form__section form__infoSection">
              <div className="form__copyButton" onClick={this.copyFields}>
                {' '}
                Copy Fields
                <i className="material-icons arrow-copy">arrow_forward</i>
              </div>
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
                  validate={maxLength100}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Address"
                  name="company_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  validate={maxLength100}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  name="company_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  validate={maxLength50}
                />

                <Field
                  label="State"
                  name="company_state"
                  className="col s12 form__field form__field--column form__field--flex1"
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
                  name="company_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeZip}
                  validate={[minLength5, maxLength10]}
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
                  validate={minLengthPhone}
                  id="phone-id"
                />
                <Field
                  label="Fax"
                  name="company_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                  id="fax-id"
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="company_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="email"
                />
              </div>
            </section>
          </div>
          */}
          <div id="test2" className="col s12">
            <section className="form__section form__billingSection">
              <h1 className="form__title">Invoice/Accounting : Remit To</h1>
              <h2 className="customer-form__subTitle">
                This will show up on your Invoices
              </h2>
              <h4 className="customer-form__subTitleRequired">
                <span className="customer-form__subTitleRequired--asterick">
                  *
                </span>{' '}
                Required Fields
              </h4>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Company Name"
                  requiredStar="*"
                  name="company_bill_name"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_name"
                  type="text"
                  validate={[required, maxLength200]}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Address"
                  requiredStar="*"
                  name="company_bill_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_address"
                  type="text"
                  validate={[required, maxLength100]}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  requiredStar="*"
                  name="company_bill_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  labelClass="company_bill_city"
                  type="text"
                  validate={[required, maxLength50]}
                />

                <Field
                  label="State"
                  requiredStar="*"
                  labelClass="company_bill_state"
                  name="company_bill_state"
                  className="col s12 form__field form__field--column form__field--flex1"
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
                  requiredStar="*"
                  name="company_bill_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_zip"
                  type="text"
                  normalize={normalizeZip}
                  validate={[required, minLength5, maxLength10]}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  requiredStar="*"
                  name="company_bill_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_phone"
                  type="text"
                  normalize={normalizePhone}
                  validate={[required, minLength12]}
                />
                <Field
                  label="Fax"
                  name="company_bill_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_fax"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLength12}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="company_bill_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="company_bill_email"
                  type="email"
                />
              </div>
            </section>
          </div>
          <div id="test3" className="col s12">
            <section className="form__section form__factorCompanySection">
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
                  validate={
                    this.factorValues() ? [required, maxLength200] : undefined
                  }
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Address"
                  name="factory_company_address"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  validate={
                    this.factorValues() ? [required, maxLength100] : undefined
                  }
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="City"
                  name="factory_company_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  validate={
                    this.factorValues() ? [required, maxLength100] : undefined
                  }
                />
                <Field
                  label="State"
                  name="factory_company_state"
                  className="col s12 form__field form__field--column form__field--flex1"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={this.factorValues() ? required : undefined}
                  placeholder="State"
                  options={stateOptions.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
                <Field
                  label="ZipCode"
                  name="factory_company_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeZip}
                  validate={
                    this.factorValues()
                      ? [required, minLength5, maxLength10]
                      : undefined
                  }
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="factory_company_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={
                    this.factorValues() ? [required, minLengthPhone] : undefined
                  }
                />
                <Field
                  label="Fax"
                  name="factory_company_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
              </div>

              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="factory_company_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="email"
                  validate={
                    this.factorValues() ? [required, maxLength100] : undefined
                  }
                />
                <Field
                  label="Charge %"
                  name="factory_company_process_fee"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeQuickpay}
                  validate={this.factorValues() ? required : undefined}
                />
                <Field
                  label="Reserve %"
                  name="factory_company_reserve_fee"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeQuickpay}
                  validate={this.factorValues() ? required : undefined}
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
                />
              </div>
            </section>
          </div>
          <div id="test4" className="col s12">
            <section className="form__section form__factorCompanySection">
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
                  validate={maxLength200}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Phone"
                  name="factory_company_rep_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
                <Field
                  label="Fax"
                  name="factory_company_rep_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
              </div>
              <div className="row form__row form__row--columnTablet">
                <Field
                  label="Email"
                  name="factory_company_rep_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="email"
                />
              </div>
            </section>
          </div>
          <div className="fixed-action-btn">
            <div className="fixed-action-btn__mainButton">
              <button
                className="btn-floating btn-large green"
                type="submit"
                disabled={submitting}>
                <i className="large material-icons">save</i>
              </button>
            </div>
            <ul>
              <li>
                <Link to="/profile" className="btn-floating red">
                  <i className="material-icons">cancel</i>
                </Link>
              </li>
            </ul>
            <h4 className="fixed-action-btn__title save">Save Changes</h4>
          </div>
        </form>

        {/*  <div className="add-load" onClick={this.handleSubmit}>
          <img src="./img/plus.svg" />
        </div> */}
      </section>
    )
  }
}
const selector = formValueSelector('ProfileNew')

ProfileAddNew = reduxForm({
  form: 'ProfileNew',
  touchOnChange: true,
  touchOnBlur: true,
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: false,
  destroyOnUnmount: false
})(ProfileAddNew)

// You have to connect() to any reducers that you wish to connect to yourself
ProfileAddNew = connect(
  state => ({
    setttings: state.settings,
    synchronousError: getFormSyncErrors('ProfileNew')(state),
    customerBillName: selector(state, 'customer_bill_name'),
    customerBillPhone: selector(state, 'customer_bill_phone'),
    processTypeValue: selector(state, 'process_type'),
    quickpayEmailValue: selector(state, 'quickpay_email'),
    quickpayChargeValue: selector(state, 'quickpay_charge'),
    companyBillingValues: selector(
      state,
      'company_bill_name',
      'company_bill_address',
      'company_bill_city',
      'company_bill_state',
      'company_bill_zip',
      'company_bill_phone'
    ),
    factorValues: selector(
      state,
      'factory_company_name',
      'factory_company_address',
      'factory_company_city',
      'factory_company_zip',
      'factory_company_phone',
      'factory_company_fax',
      'factory_company_email',
      'factory_company_process_fee',
      'factory_company_reserve_fee'
    ),
    companyProfileValues: selector(
      state,
      'company_name',
      'company_address',
      'company_city',
      'company_state',
      'company_zip',
      'company_phone',
      'company_fax',
      'company_email'
    ),
    companyBillingState: selector(state, 'company_bill_state'),

    touchOnChange: true,
    touchOnBlur: true,
    initialized: true,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: false,
    destroyOnUnmount: false
  }),
  { createProfile } // bind account loading action creator
)(ProfileAddNew)

export default ProfileAddNew
